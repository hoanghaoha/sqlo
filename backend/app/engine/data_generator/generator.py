import sqlite3
import random
import numpy as np
from faker import Faker
from typing import Any

fake = Faker()


class DataGenerator:
    """
    Generate realistic SQLite data from a schema definition.

    This class reads a schema dictionary and populates a SQLite database
    with synthetic data using deterministic Python logic. It avoids any
    dynamic code execution such as `exec` or subprocess usage.

    Attributes:
        schema (dict): Schema definition containing tables and columns.
        db_path (str): Path to the SQLite database file.
        conn (sqlite3.Connection): Active SQLite connection.
        pk_cache (dict[str, list]): Cache of primary key values for FK usage.
    """

    def __init__(self, schema: dict, db_path: str):
        """
        Initialize the data generator.

        Args:
            schema (dict): Schema describing tables and columns.
            db_path (str): Path to the SQLite database file.
        """
        self.schema = schema
        self.db_path = db_path
        self.conn: sqlite3.Connection = sqlite3.connect(self.db_path)
        self.pk_cache: dict[str, list] = {}

    def generate(self) -> int:
        """
        Create tables and populate them with data.

        Returns:
            int: Total number of rows inserted across all tables.

        Raises:
            Exception: If any database operation fails.
        """
        self.conn = sqlite3.connect(self.db_path)

        try:
            self._create_tables()
            total_rows = self._insert_all_tables()
            self.conn.commit()
            return total_rows
        except Exception:
            self.conn.rollback()
            raise
        finally:
            self.conn.close()

    def _sorted_tables(self) -> list[dict]:
        """
        Return tables sorted so referenced tables come before tables that reference them.
        """
        tables_by_name = {t["name"]: t for t in self.schema["tables"]}
        deps: dict[str, set[str]] = {name: set() for name in tables_by_name}

        for table in self.schema["tables"]:
            for col in table["columns"]:
                ref = col.get("generator", {}).get("references")
                if ref:
                    ref_table = ref.split(".")[0]
                    if ref_table in tables_by_name:
                        deps[table["name"]].add(ref_table)

        sorted_tables: list[dict] = []
        visited: set[str] = set()

        def visit(name: str) -> None:
            if name in visited:
                return
            visited.add(name)
            for dep in deps[name]:
                visit(dep)
            sorted_tables.append(tables_by_name[name])

        for name in tables_by_name:
            visit(name)

        return sorted_tables

    def _create_tables(self) -> None:
        """
        Create database tables based on the schema definition.
        """
        cur = self.conn.cursor()

        for table in self._sorted_tables():
            col_defs = []

            for col in table["columns"]:
                col_def = f"{col['name']} {col['type']}"

                if col.get("primary_key"):
                    col_def += " PRIMARY KEY AUTOINCREMENT"
                if not col.get("nullable", True) and not col.get("primary_key"):
                    col_def += " NOT NULL"
                if col.get("unique"):
                    col_def += " UNIQUE"

                col_defs.append(col_def)

            ddl = f"CREATE TABLE IF NOT EXISTS {table['name']} ({', '.join(col_defs)})"
            cur.execute(ddl)

    def _insert_all_tables(self) -> int:
        """
        Generate and insert data for all tables in schema order.

        Returns:
            int: Total number of rows inserted.
        """
        total = 0

        for table in self._sorted_tables():
            rows = self._generate_rows(table)
            inserted = self._insert_rows(table, rows)
            total += inserted
            self._cache_pks(table, rows)

        return total

    def _generate_rows(self, table: dict) -> list[tuple]:
        """
        Generate rows for a single table.

        Args:
            table (dict): Table schema definition.

        Returns:
            list[tuple]: Generated row values excluding primary keys.
        """
        row_count = table.get("row_count", 100)
        non_pk_cols = [col for col in table["columns"] if not col.get("primary_key")]

        rows = []
        for i in range(row_count):
            row = tuple(self._generate_value(col, i, row_count) for col in non_pk_cols)
            rows.append(row)

        return rows

    def _insert_rows(self, table: dict, rows: list[tuple]) -> int:
        """
        Insert rows into a table.

        Args:
            table (dict): Table schema definition.
            rows (list[tuple]): Rows to insert.

        Returns:
            int: Number of rows inserted.
        """
        non_pk_cols = [col for col in table["columns"] if not col.get("primary_key")]
        col_names = [col["name"] for col in non_pk_cols]
        placeholders = ", ".join(["?" for _ in col_names])

        sql = (
            f"INSERT OR IGNORE INTO {table['name']} "
            f"({', '.join(col_names)}) "
            f"VALUES ({placeholders})"
        )

        self.conn.executemany(sql, rows)
        return len(rows)

    def _cache_pks(self, table: dict, rows: list[tuple]) -> None:
        """
        Cache primary key values after insertion for foreign key usage.

        Args:
            table (dict): Table schema definition.
            rows (list[tuple]): Inserted rows.
        """
        pk_col = self._get_pk_col(table)
        if not pk_col:
            return

        cur = self.conn.cursor()
        cur.execute(f"SELECT {pk_col['name']} FROM {table['name']}")
        pks = [row[0] for row in cur.fetchall()]

        cache_key = f"{table['name']}.{pk_col['name']}"
        self.pk_cache[cache_key] = pks

    def _generate_value(self, col: dict, index: int, total: int) -> Any:
        """
        Generate a value for a column based on its generator config.

        Args:
            col (dict): Column definition.
            index (int): Row index.
            total (int): Total number of rows.

        Returns:
            Any: Generated value.
        """
        gen = col.get("generator", {})

        null_rate = col.get("null_rate", 0)
        if null_rate > 0 and random.random() < null_rate:
            return None

        method = gen.get("method")

        if method == "faker":
            return self._faker(gen)
        elif method == "enum":
            return self._enum(gen)
        elif method == "numpy":
            return self._numpy(gen)
        elif method == "foreign_key":
            return self._foreign_key(gen)
        elif method == "random_int":
            return random.randint(gen.get("min", 1), gen.get("max", 100))
        elif method == "random_float":
            return round(random.uniform(gen.get("min", 1.0), gen.get("max", 100.0)), 2)
        else:
            return None

    def _faker(self, gen: dict) -> Any:
        """
        Generate data using Faker.

        Args:
            gen (dict): Generator configuration.

        Returns:
            Any: Generated fake value.

        Raises:
            ValueError: If the Faker method does not exist.
        """
        faker_key = gen["faker_key"]
        faker_args = gen.get("faker_args", {})

        method = getattr(fake, faker_key, None)
        if method is None:
            raise ValueError(f"Unknown faker method: {faker_key}")

        result = method(**faker_args) if faker_args else method()
        return str(result)

    def _enum(self, gen: dict) -> str:
        """
        Select a value from a list using optional weights.

        Args:
            gen (dict): Generator configuration.

        Returns:
            str: Selected value.
        """
        values = gen["values"]
        weights = gen.get("weights")

        return random.choices(values, weights=weights, k=1)[0]

    def _numpy(self, gen: dict) -> float:
        """
        Generate a numeric value using a NumPy distribution.

        Args:
            gen (dict): Generator configuration.

        Returns:
            float: Generated numeric value.

        Raises:
            ValueError: If distribution type is unsupported.
        """
        dist = gen["distribution"]
        round_dp = gen.get("round", 2)

        if dist == "lognormal":
            val = np.random.lognormal(mean=gen["mean"], sigma=gen["sigma"])
        elif dist == "normal":
            val = np.random.normal(loc=gen["mean"], scale=gen["std"])
            if "min" in gen:
                val = max(val, gen["min"])
            if "max" in gen:
                val = min(val, gen["max"])
        elif dist == "uniform":
            val = np.random.uniform(low=gen["min"], high=gen["max"])
        elif dist == "exponential":
            val = np.random.exponential(scale=gen["scale"])
        else:
            raise ValueError(f"Unknown numpy distribution: {dist}")

        return round(float(val), round_dp)

    def _foreign_key(self, gen: dict) -> int:
        """
        Generate a foreign key reference value.

        Args:
            gen (dict): Generator configuration.

        Returns:
            int: Selected foreign key value.

        Raises:
            ValueError: If referenced keys are not available.
        """
        ref_key = gen["references"]
        distribution = gen.get("distribution", "uniform")

        cached = self.pk_cache.get(ref_key)
        if not cached:
            ref_table = ref_key.split(".")[0]
            raise ValueError(
                f"Foreign key reference '{ref_key}' not found in cache. "
                f"Make sure '{ref_table}' table appears before "
                f"this table in the schema."
            )

        if distribution == "power_law":
            idx = int(np.random.zipf(a=1.5)) % len(cached)
            return cached[idx]
        else:
            return random.choice(cached)

    def _get_pk_col(self, table: dict) -> dict | None:
        """
        Retrieve the primary key column from a table schema.

        Args:
            table (dict): Table schema definition.

        Returns:
            dict | None: Primary key column definition or None.
        """
        for col in table["columns"]:
            if col.get("primary_key"):
                return col
        return None

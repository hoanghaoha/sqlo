import sqlite3
import pytest
from app.engine.data_generator.generator import DataGenerator


SIMPLE_SCHEMA = {
    "tables": [
        {
            "name": "users",
            "row_count": 5,
            "columns": [
                {"name": "id", "type": "INTEGER", "primary_key": True, "nullable": False},
                {"name": "full_name", "type": "TEXT", "nullable": False, "generator": {"method": "faker", "faker_key": "name"}},
                {"name": "email", "type": "TEXT", "nullable": False, "unique": True, "generator": {"method": "faker", "faker_key": "email"}},
                {"name": "status", "type": "TEXT", "nullable": False, "generator": {"method": "enum", "values": ["active", "inactive"], "weights": [80, 20]}},
                {"name": "score", "type": "REAL", "nullable": False, "generator": {"method": "numpy", "distribution": "normal", "mean": 50.0, "std": 10.0, "round": 2}},
            ],
        }
    ]
}

FK_SCHEMA = {
    "tables": [
        {
            "name": "categories",
            "row_count": 3,
            "columns": [
                {"name": "id", "type": "INTEGER", "primary_key": True, "nullable": False},
                {"name": "name", "type": "TEXT", "nullable": False, "generator": {"method": "faker", "faker_key": "word"}},
            ],
        },
        {
            "name": "products",
            "row_count": 10,
            "columns": [
                {"name": "id", "type": "INTEGER", "primary_key": True, "nullable": False},
                {"name": "category_id", "type": "INTEGER", "nullable": False, "generator": {"method": "foreign_key", "references": "categories.id", "distribution": "uniform"}},
                {"name": "price", "type": "REAL", "nullable": False, "generator": {"method": "numpy", "distribution": "lognormal", "mean": 3.0, "sigma": 0.5, "round": 2}},
            ],
        },
    ]
}


@pytest.fixture
def tmp_db(tmp_path):
    return str(tmp_path / "test.db")


def test_generate_creates_rows(tmp_db):
    total = DataGenerator(SIMPLE_SCHEMA, tmp_db).generate()
    assert total == 5
    conn = sqlite3.connect(tmp_db)
    count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    conn.close()
    assert count == 5


def test_generate_with_foreign_keys(tmp_db):
    total = DataGenerator(FK_SCHEMA, tmp_db).generate()
    assert total == 13

    conn = sqlite3.connect(tmp_db)
    cat_ids = {row[0] for row in conn.execute("SELECT id FROM categories").fetchall()}
    fk_vals = {row[0] for row in conn.execute("SELECT DISTINCT category_id FROM products").fetchall()}
    conn.close()

    assert len(cat_ids) == 3
    assert fk_vals.issubset(cat_ids)


def test_generate_rollback_on_error(tmp_db):
    bad_schema = {
        "tables": [
            {
                "name": "t",
                "row_count": 3,
                "columns": [
                    {"name": "id", "type": "INTEGER", "primary_key": True, "nullable": False},
                    {"name": "ref", "type": "INTEGER", "nullable": False, "generator": {"method": "foreign_key", "references": "nonexistent.id", "distribution": "uniform"}},
                ],
            }
        ]
    }
    with pytest.raises(Exception):
        DataGenerator(bad_schema, tmp_db).generate()


def test_faker_method(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "n", "type": "TEXT", "nullable": False, "generator": {"method": "faker", "faker_key": "name"}}
    val = gen._generate_value(col, 0, 1)
    assert isinstance(val, str) and val


def test_faker_with_args(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "d", "type": "TEXT", "nullable": False, "generator": {"method": "faker", "faker_key": "date_between", "faker_args": {"start_date": "-1y", "end_date": "today"}}}
    val = gen._generate_value(col, 0, 1)
    assert isinstance(val, str) and val


def test_faker_unknown_key_raises(tmp_db):
    gen = DataGenerator({}, tmp_db)
    with pytest.raises(ValueError, match="Unknown faker method"):
        gen._faker({"faker_key": "not_a_real_method_xyz"})


def test_enum_method(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "s", "type": "TEXT", "nullable": False, "generator": {"method": "enum", "values": ["a", "b", "c"], "weights": [1, 1, 1]}}
    for _ in range(20):
        assert gen._generate_value(col, 0, 1) in {"a", "b", "c"}


def test_numpy_lognormal(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "v", "type": "REAL", "nullable": False, "generator": {"method": "numpy", "distribution": "lognormal", "mean": 3.0, "sigma": 0.5, "round": 2}}
    val = gen._generate_value(col, 0, 1)
    assert isinstance(val, float) and val > 0


def test_numpy_normal(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "v", "type": "REAL", "nullable": False, "generator": {"method": "numpy", "distribution": "normal", "mean": 50.0, "std": 10.0, "round": 1}}
    val = gen._generate_value(col, 0, 1)
    assert isinstance(val, float)


def test_numpy_uniform(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "v", "type": "REAL", "nullable": False, "generator": {"method": "numpy", "distribution": "uniform", "min": 0.0, "max": 10.0, "round": 2}}
    val = gen._generate_value(col, 0, 1)
    assert isinstance(val, float) and 0.0 <= val <= 10.0


def test_numpy_exponential(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "v", "type": "REAL", "nullable": False, "generator": {"method": "numpy", "distribution": "exponential", "scale": 30.0, "round": 0}}
    val = gen._generate_value(col, 0, 1)
    assert isinstance(val, float) and val >= 0


def test_numpy_normal_clipping(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "v", "type": "REAL", "nullable": False, "generator": {"method": "numpy", "distribution": "normal", "mean": 50.0, "std": 10.0, "min": 45.0, "max": 55.0, "round": 2}}
    for _ in range(20):
        val = gen._generate_value(col, 0, 1)
        assert 45.0 <= val <= 55.0


def test_numpy_unknown_distribution_raises(tmp_db):
    gen = DataGenerator({}, tmp_db)
    with pytest.raises(ValueError, match="Unknown numpy distribution"):
        gen._numpy({"distribution": "unknown", "round": 2})


def test_foreign_key_uniform(tmp_db):
    gen = DataGenerator({}, tmp_db)
    gen.pk_cache["items.id"] = [10, 20, 30]
    col = {"name": "item_id", "type": "INTEGER", "nullable": False, "generator": {"method": "foreign_key", "references": "items.id", "distribution": "uniform"}}
    for _ in range(20):
        assert gen._generate_value(col, 0, 1) in {10, 20, 30}


def test_foreign_key_power_law(tmp_db):
    gen = DataGenerator({}, tmp_db)
    gen.pk_cache["items.id"] = list(range(1, 11))
    col = {"name": "item_id", "type": "INTEGER", "nullable": False, "generator": {"method": "foreign_key", "references": "items.id", "distribution": "power_law"}}
    for _ in range(20):
        assert gen._generate_value(col, 0, 1) in set(range(1, 11))


def test_foreign_key_missing_cache_raises(tmp_db):
    gen = DataGenerator({}, tmp_db)
    with pytest.raises(ValueError, match="not found in cache"):
        gen._foreign_key({"references": "ghost.id", "distribution": "uniform"})


def test_null_rate_always_null(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "x", "type": "TEXT", "nullable": True, "null_rate": 1.0, "generator": {"method": "faker", "faker_key": "name"}}
    assert gen._generate_value(col, 0, 1) is None


def test_null_rate_never_null(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "x", "type": "TEXT", "nullable": False, "null_rate": 0.0, "generator": {"method": "faker", "faker_key": "name"}}
    assert gen._generate_value(col, 0, 1) is not None


def test_unknown_method_returns_none(tmp_db):
    gen = DataGenerator({}, tmp_db)
    col = {"name": "x", "type": "TEXT", "nullable": True, "generator": {"method": "unknown_method"}}
    assert gen._generate_value(col, 0, 1) is None

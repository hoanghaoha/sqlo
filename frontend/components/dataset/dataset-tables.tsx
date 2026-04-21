import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { IconTable } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Dataset } from "@/lib/types";

const DatasetTables = (dataset: Dataset) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [tableData, setTableData] = useState<{ columns: string[]; rows: unknown[][] } | null>(null)
  const [loading, setLoading] = useState(false)
  const schemaTable = dataset.schema.tables.find(t => t.name === selectedTable)
  const colTypeMap = Object.fromEntries(schemaTable?.columns.map(c => [c.name, c.type]) ?? [])

  useEffect(() => {
    if (!selectedTable) return
    setTableData(null)
    setLoading(true)
    apiFetch(`/datasets/${dataset.id}/${selectedTable}`)
      .then((data) => setTableData(data as { columns: string[]; rows: unknown[][] }))
      .finally(() => setLoading(false))
  }, [selectedTable])


  if (!dataset) return <p>Loading...</p>

  return (
    <div className="flex gap-0 flex-1 min-h-0 overflow-hidden h-full">
      <div className="flex flex-col gap-0.5 w-48 shrink-0 overflow-y-auto border-r p-2">
        {dataset.schema.tables.map((table) => (
          <button
            key={table.name}
            onClick={() => setSelectedTable(table.name)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-left transition-colors",
              selectedTable === table.name
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-1.5 truncate">
              <IconTable className="size-3.5 shrink-0 opacity-60" />
              <span className="truncate">{table.name}</span>
            </span>
            <span className="text-xs text-muted-foreground tabular-nums shrink-0">{table.row_count.toLocaleString()}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col flex-1 min-h-0 min-w-0">
        {loading ? (
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full" />
            ))}
          </div>
        ) : tableData ? (
          <>
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableData.columns.map((col) => (
                      <TableHead key={col} className="bg-muted/50 border-b">
                        <div className="flex items-center gap-1.5">
                          <span>{col}</span>
                          {colTypeMap[col] && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 font-mono text-muted-foreground">
                              {colTypeMap[col]}
                            </Badge>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j} className="text-sm">
                          {cell === null
                            ? <span className="text-muted-foreground italic">null</span>
                            : String(cell)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="border-t px-4 py-2 text-xs text-muted-foreground shrink-0">
              {tableData.rows.length.toLocaleString()} rows · {tableData.columns.length} columns
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 text-muted-foreground">
            <IconTable className="size-8 opacity-30" />
            <span className="text-sm">Select a table to view data</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DatasetTables

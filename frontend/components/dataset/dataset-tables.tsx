import { useEffect, useState } from "react";
import { Button } from "../ui/button"
import { apiFetch } from "@/lib/api";
import { Dataset } from "@/lib/types";


const DatasetTables = (dataset: Dataset) => {

  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [tableData, setTableData] = useState<{ columns: string[]; rows: unknown[][] } | null>(null)

  useEffect(() => {
    if (!selectedTable) return
    const load = async () => {
      const data = await apiFetch(`/datasets/${dataset?.id}/${selectedTable}`) as { columns: string[]; rows: unknown[][] }
      setTableData(data)
    }
    load()
  }, [selectedTable])
  return (
    <div className="flex gap-2 flex-1 min-h-0 overflow-hidden h-full">
      <div className="flex flex-col gap-1 w-min shrink-0 overflow-y-auto border-r p-1">
        {(dataset.schema as any).tables.map((table: any) => (
          <Button
            key={table.name}
            variant={selectedTable === table.name ? "secondary" : "ghost"}
            size="sm"
            className="justify-start"
            onClick={() => setSelectedTable(table.name)}
          >
            {table.name}
          </Button>
        ))}
      </div>
      <div className="flex-1 overflow-auto">
        {tableData ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                {tableData.columns.map((col) => (
                  <th key={col} className="text-left px-3 py-2 border border-border font-medium text-muted-foreground whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, i) => (
                <tr key={i} className="hover:bg-muted/50">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-1.5 border border-border text-foreground whitespace-nowrap">
                      {cell === null ? <span className="text-muted-foreground italic">null</span> : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-muted-foreground text-sm p-4">Select a table to view data</div>
        )}
      </div>
    </div>
  )
}

export default DatasetTables

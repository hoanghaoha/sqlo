"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "../ui/button"
import { IconArrowsVertical, IconBulb, IconChecks, IconFlask, IconPlayerPlay, IconPuzzle, IconX } from "@tabler/icons-react"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"
import { oneDark } from "@codemirror/theme-one-dark"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer"

interface QueryResult {
  columns: string[]
  rows: unknown[][]
}

const ExerciseSqlEditor = ({ datasetId }: { datasetId: string }) => {
  const [query, setQuery] = useState("SELECT *\nFROM ")
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const runQuery = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<QueryResult>(`/datasets/${datasetId}`, {
        method: "POST",
        body: JSON.stringify({ query }),
      })
      setResult(data)
      setOpen(true)
    } catch (e: any) {
      setError(e?.message ?? "Query failed")
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <CodeMirror
        value={query}
        onChange={setQuery}
        extensions={[sql()]}
        theme={oneDark}
        basicSetup={{ lineNumbers: true, foldGutter: false }}
        onKeyDown={e => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault()
            runQuery()
          }
        }}
        className="flex-1 text-sm"
      />
      <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20">
        <div className="flex gap-2">
          <Button size="sm" variant={"outline"} onClick={() => { }}>
            <IconBulb className="text-yellow-300" />
            Hint
          </Button>
          <Button size="sm" variant={"outline"} onClick={() => { }}>
            <IconPuzzle className="text-purple-300" />
            Solution
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={"outline"} onClick={() => setOpen(!open)}>
            <IconArrowsVertical />
            Result
          </Button>
          <Button size="sm" variant={"outline"} onClick={runQuery} disabled={loading} className="border-primary border-2">
            <IconFlask className="text-primary" />
            {loading ? "Running..." : "Try"}
          </Button>
          <Button size="sm" variant={"default"} onClick={runQuery} disabled={loading} className="border-primary border-2">
            <IconChecks />
            {loading ? "Running..." : "Submit"}
          </Button>
        </div>
      </div>
      <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[60vh]">
          <DrawerHeader className="flex flex-row items-center justify-between py-2 px-4">
            <DrawerTitle className="text-sm">
              {error ? "Error" : `${result?.rows.length ?? 0} row${result?.rows.length !== 1 ? "s" : ""} returned`}
            </DrawerTitle>
            <Button variant="ghost" size="icon" className="size-6" onClick={() => setOpen(false)}>
              <IconX className="size-3.5" />
            </Button>
          </DrawerHeader>

          <div className="overflow-auto flex-1 px-2 pb-4">
            {error ? (
              <pre className="text-sm font-mono text-destructive bg-destructive/10 rounded p-3">{error}</pre>
            ) : result && result.rows.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2">Query returned 0 rows.</p>
            ) : result ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    {result.columns.map(col => (
                      <th key={col} className="text-left px-3 py-2 border border-border font-medium text-muted-foreground whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      {(row as unknown[]).map((cell, j) => (
                        <td key={j} className="px-3 py-1.5 border border-border whitespace-nowrap">
                          {cell === null
                            ? <span className="text-muted-foreground italic">null</span>
                            : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ExerciseSqlEditor

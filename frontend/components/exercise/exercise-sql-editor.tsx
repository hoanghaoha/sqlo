"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "../ui/button"
import { IconArrowsVertical, IconBackspace, IconBulb, IconChecks, IconClearFormatting, IconFlask, IconPuzzle, IconX } from "@tabler/icons-react"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"
import { oneDark } from "@codemirror/theme-one-dark"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer"
import { useExercise } from "@/hooks/exercises"
import { useDataset } from "@/hooks/datasets"
import { format } from "sql-formatter"

interface QueryResult {
  columns: string[]
  rows: unknown[][]
}

type DrawerMode = "try" | "submit"

const ResultTable = ({ result }: { result: QueryResult }) => (
  result.rows.length === 0
    ? <p className="text-sm text-muted-foreground px-2">Query returned 0 rows.</p>
    : <table className="w-full text-sm border-collapse">
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
)

const ExerciseSqlEditor = ({ exerciseId }: { exerciseId: string }) => {
  const [query, setQuery] = useState("SELECT *\nFROM ")
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("try")
  const [solved, setSolved] = useState<boolean | null>(null)
  const [hintLoading, setHintLoading] = useState(false)

  const exercise = useExercise(exerciseId)
  const dataset = useDataset(exercise?.dataset_id || "")

  if (!exercise) return <div className="p-4 text-muted-foreground">Loading...</div>

  const loadHint = async () => {
    setHintLoading(true)
    try {
      const data = await apiFetch<{ hint: string }>(`/exercises/hint`, {
        method: "POST",
        body: JSON.stringify({
          sql: query,
          dataset_schema: JSON.stringify(dataset?.schema ?? {}),
          exercise_name: exercise.name,
          exercise_description: exercise.description,
          solution: exercise.solution,
        }),
      })
      const commentLines = data.hint.split("\n").map(l => `-- ${l}`).join("\n")
      setQuery(prev => `${commentLines}\n${prev}`)
    } finally {
      setHintLoading(false)
    }
  }

  const runQuery = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setDrawerMode("try")
    setSolved(null)
    try {
      const data = await apiFetch<QueryResult>(`/datasets/${exercise.dataset_id}`, {
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

  const submitQuery = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setDrawerMode("submit")
    setSolved(null)
    try {
      const data = await apiFetch<{ solved: boolean; user_result: QueryResult }>(`/exercises/exercise/${exerciseId}/submit`, {
        method: "POST",
        body: JSON.stringify({ sql: query }),
      })
      setSolved(data.solved)
      setResult(data.user_result)
      setOpen(true)
    } catch (e: any) {
      setError(e?.message ?? "Query failed")
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const drawerTitle = () => {
    if (error) return "Error"
    if (drawerMode === "submit" && solved !== null) {
      return solved ? "SOLVED" : "WRONG ANSWER"
    }
    return `${result?.rows.length ?? 0} row${result?.rows.length !== 1 ? "s" : ""} returned`
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
        className="flex-1 text-sm overflow-y-auto"
      />
      <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20">
        <div className="flex gap-2">
          <Button size="sm" variant={"outline"} onClick={loadHint} disabled={hintLoading}>
            <IconBulb className="text-yellow-300" />
            {hintLoading ? "Loading..." : "Hint"}
          </Button>
          <Button size="sm" variant={"outline"} onClick={() => { setQuery(format(exercise.solution, { language: "sqlite" })) }}>
            <IconPuzzle className="text-purple-300" />
            Solution
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={"outline"} onClick={() => setQuery(format(query))}>
            <IconBackspace />
            Remove comments
          </Button>
          <Button size="sm" variant={"outline"} onClick={() => setQuery(format(query))}>
            <IconClearFormatting />
            Format
          </Button>
          <Button size="sm" variant={"outline"} onClick={() => setOpen(!open)}>
            <IconArrowsVertical />
            Result
          </Button>
          <Button size="sm" variant={"outline"} onClick={runQuery} disabled={loading} className="border-primary border-2">
            <IconFlask className="text-primary" />
            {loading && drawerMode === "try" ? "Running..." : "Try"}
          </Button>
          <Button size="sm" variant={"default"} onClick={submitQuery} disabled={loading} className="border-primary border-2">
            <IconChecks />
            {loading && drawerMode === "submit" ? "Checking..." : "Submit"}
          </Button>
        </div>
      </div>
      <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[60vh]">
          <DrawerHeader className="flex flex-row items-center justify-between py-2 px-4">
            <DrawerTitle className={`text-sm font-semibold ${drawerMode === "submit" && solved === true ? "text-green-500" : drawerMode === "submit" && solved === false ? "text-red-500" : ""}`}>
              {drawerTitle()}
            </DrawerTitle>
            <Button variant="ghost" size="icon" className="size-6" onClick={() => setOpen(false)}>
              <IconX className="size-3.5" />
            </Button>
          </DrawerHeader>

          <div className="overflow-auto flex-1 px-2 pb-4">
            {error ? (
              <pre className="text-sm font-mono text-destructive bg-destructive/10 rounded p-3">{error}</pre>
            ) : result ? (
              <ResultTable result={result} />
            ) : null}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ExerciseSqlEditor

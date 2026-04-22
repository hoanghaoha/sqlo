"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "./ui/button"
import { IconArrowsVertical, IconBackspace, IconBulb, IconChecks, IconClearFormatting, IconFlask, IconPlayerPlay, IconPuzzle, IconX } from "@tabler/icons-react"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"
import { oneDark } from "@codemirror/theme-one-dark"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { format } from "sql-formatter"
import { useExercise } from "@/hooks/exercises"
import { useDataset } from "@/hooks/datasets"
import { Dataset, Exercise } from "@/lib/types"

interface QueryResult {
  columns: string[]
  rows: unknown[][]
}

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

interface SqlEditorProps {
  dataset: Dataset,
  exercise?: Exercise,
}

const SqlEditor = ({ dataset, exercise }: SqlEditorProps) => {
  const [query, setQuery] = useState("SELECT *\nFROM ")
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [solved, setSolved] = useState<boolean | null>(null)
  const [hintLoading, setHintLoading] = useState(false)
  const [solutionConfirmOpen, setSolutionConfirmOpen] = useState(false)

  const runQuery = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setIsSubmit(false)
    setSolved(null)
    try {
      const data = await apiFetch<QueryResult>(`/datasets/${dataset.id}`, {
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
    setIsSubmit(true)
    setSolved(null)
    try {
      const data = await apiFetch<{ solved: boolean; user_result: QueryResult }>(`/exercises/exercise/${exercise?.id}/submit`, {
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

  const loadHint = async () => {
    if (!exercise) return
    setHintLoading(true)
    try {
      const data = await apiFetch<{ hint: string }>(`/exercises/hint`, {
        method: "POST",
        body: JSON.stringify({
          exercise_id: exercise.id,
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

  const loadSolution = async () => {
    if (!exercise) return
    try {
      const data = await apiFetch<{ solution: string }>(
        `/exercises/exercise/${exercise.id}/solution`,
        { method: "POST" }
      )
      setQuery(format(data.solution, { language: "sqlite" }))
    } catch (e: any) {
      setError(e?.message ?? "Failed to load solution")
      setOpen(true)
    }
  }

  const drawerTitle = () => {
    if (error) return "Error"
    if (isSubmit && solved !== null) return solved ? "SOLVED" : "WRONG ANSWER"
    return `${result?.rows.length ?? 0} row${result?.rows.length !== 1 ? "s" : ""} returned`
  }

  const drawerTitleColor = isSubmit && solved === true
    ? "text-green-500"
    : isSubmit && solved === false
      ? "text-red-500"
      : ""

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
        {exercise ? (
          <>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={loadHint} disabled={hintLoading}>
                <IconBulb className="text-yellow-300" />
                {hintLoading ? "Loading..." : "Hint"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSolutionConfirmOpen(true)}>
                <IconPuzzle className="text-purple-300" />
                Solution
              </Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setQuery(query.split("\n").filter(l => !l.startsWith("--")).join("\n"))}>
                <IconBackspace />
                Comments
              </Button>
              <Button size="sm" variant="outline" onClick={() => setQuery(format(query))}>
                <IconClearFormatting />
                Format
              </Button>
              <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
                <IconArrowsVertical />
                Result
              </Button>
              <Button size="sm" variant="outline" onClick={runQuery} disabled={loading} className="border-primary border-2">
                <IconFlask className="text-primary" />
                {loading && !isSubmit ? "Running..." : "Try"}
              </Button>
              <Button size="sm" onClick={submitQuery} disabled={loading} className="border-primary border-2">
                <IconChecks />
                {loading && isSubmit ? "Checking..." : "Submit"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="text-xs text-muted-foreground">Ctrl+Enter to run</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setQuery(format(query))}>
                <IconClearFormatting />
                Format
              </Button>
              <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
                <IconArrowsVertical />
                Result
              </Button>
              <Button size="sm" onClick={runQuery} disabled={loading}>
                <IconPlayerPlay className="size-3.5" />
                {loading ? "Running..." : "Run"}
              </Button>
            </div>
          </>
        )}
      </div>

      <AlertDialog open={solutionConfirmOpen} onOpenChange={setSolutionConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>View solution?</AlertDialogTitle>
            <AlertDialogDescription>
              Viewing the solution will set your score to 0 for this exercise. You won't be able to earn points after this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={loadSolution}>View Solution</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[60vh]">
          <DrawerHeader className="flex flex-row items-center justify-between py-2 px-4">
            <DrawerTitle className={`text-sm font-semibold ${drawerTitleColor}`}>
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

export default SqlEditor

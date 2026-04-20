"use client"

import DatasetExercise from "@/components/dataset/dataset-exercise"
import DatasetSettings from "@/components/dataset/dataset-settings"
import DatasetTables from "@/components/dataset/dataset-tables"
import SchemaVisualizer from "@/components/dataset/schema-visualizer"
import SqlEditor from "@/components/sql-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataset, useDatasets } from "@/hooks/datasets"
import { useParams, useRouter } from "next/navigation"

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const dataset = useDataset(id)
  const router = useRouter()
  const { refresh } = useDatasets()


  if (!dataset) return <div className="p-4 text-muted-foreground">Loading...</div>

  return (
    <div className="flex flex-1 flex-col min-h-0 h-full">
      <Tabs defaultValue="schema" className="w-full flex-1 min-h-0 flex flex-col">
        <TabsList variant={"line"}>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="editor">SQL Editor</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent forceMount value="schema" className="flex-1 min-h-0 data-[state=inactive]:hidden">
          <SchemaVisualizer datasetId={id} />
        </TabsContent>
        <TabsContent forceMount value="tables" className="flex gap-2 min-h-0 flex-1 overflow-hidden data-[state=inactive]:hidden">
          <DatasetTables datasetId={id} />
        </TabsContent>
        <TabsContent forceMount value="editor" className="flex-1 min-h-0 overflow-hidden data-[state=inactive]:hidden">
          <SqlEditor datasetId={id} />
        </TabsContent>
        <TabsContent forceMount value="exercises" className="data-[state=inactive]:hidden">
          <DatasetExercise datasetId={id} />
        </TabsContent>
        <TabsContent forceMount value="settings" className="data-[state=inactive]:hidden p-4">
          <DatasetSettings datasetId={id} onUpdated={refresh} onDeleted={() => router.push("/datasets")} />
        </TabsContent>
      </Tabs>
    </div>
  )

}

export default Page

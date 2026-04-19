"use client"

import DatasetSettings from "@/components/dataset/dataset-settings"
import DatasetSqlEditor from "@/components/dataset/dataset-sql-editor"
import DatasetTables from "@/components/dataset/dataset-tables"
import SchemaVisualizer from "@/components/dataset/schema-visualizer"
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
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent forceMount value="schema" className="flex-1 min-h-0 data-[state=inactive]:hidden">
          <SchemaVisualizer schema={dataset.schema as any} />
        </TabsContent>
        <TabsContent forceMount value="tables" className="flex gap-2 min-h-0 flex-1 overflow-hidden p-2 data-[state=inactive]:hidden">
          <DatasetTables {...dataset} />
        </TabsContent>
        <TabsContent forceMount value="editor" className="flex-1 min-h-0 overflow-hidden data-[state=inactive]:hidden">
          <DatasetSqlEditor datasetId={id} />
        </TabsContent>
        <TabsContent forceMount value="problems" className="data-[state=inactive]:hidden">{dataset?.db_path}</TabsContent>
        <TabsContent forceMount value="settings" className="p-2 data-[state=inactive]:hidden">
          <DatasetSettings dataset={dataset} onUpdated={refresh} onDeleted={() => router.push("/datasets")} />
        </TabsContent>
      </Tabs>
    </div>
  )

}

export default Page

"use client"

import DatasetInfo from "@/components/dataset/dataset-info"
import DatasetTables from "@/components/dataset/dataset-tables"
import SchemaVisualizer from "@/components/dataset/schema-visualizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataset } from "@/hooks/datasets"
import { useParams } from "next/navigation"

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const dataset = useDataset(id)


  return !dataset ? (
    <div>Error</div>
  ) : (
    <div className="flex flex-1 flex-col min-h-0 h-full">
      <Tabs defaultValue="schema" className="w-full flex-1 min-h-0 flex flex-col">
        <TabsList variant={"line"}>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
        </TabsList>
        <TabsContent value="schema" className="flex-1 min-h-0">
          <SchemaVisualizer schema={dataset.schema as any} />
        </TabsContent>
        <TabsContent value="info" className="p-2">
          <DatasetInfo {...dataset} />
        </TabsContent>
        <TabsContent value="tables" className="flex gap-2 min-h-0 flex-1 overflow-hidden p-2">
          <DatasetTables {...dataset} />
        </TabsContent>
        <TabsContent value="problems">{dataset?.db_path}</TabsContent>
      </Tabs>
    </div>
  )

}

export default Page

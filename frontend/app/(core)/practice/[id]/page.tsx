"use client"

import SchemaVisualizer from "@/components/dataset/schema-visualizer"
import ExerciseTopic from "@/components/exercise/exercise-topic"
import SqlEditor from "@/components/sql-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataset } from "@/hooks/datasets"
import { useExercise } from "@/hooks/exercises"
import { useParams } from "next/navigation"

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const exercise = useExercise(id)
  const dataset = useDataset(exercise?.dataset_id || "")

  if (!exercise) return <div className="p-4 text-muted-foreground">Loading...</div>
  if (!dataset) return <div className="p-4 text-muted-foreground">Loading...</div>

  return (
    <div className="flex flex-1 flex-col min-h-0 h-full">
      <Tabs defaultValue="schema" className="w-full flex-1 min-h-0 flex flex-col">
        <TabsList variant={"line"}>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="topic">Topic</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
        </TabsList>
        <TabsContent forceMount value="schema" className="flex-1 min-h-0 data-[state=inactive]:hidden">
          <SchemaVisualizer datasetId={dataset.id} />
        </TabsContent>
        <TabsContent forceMount value="topic" className="flex-1 min-h-0 data-[state=inactive]:hidden">
          <ExerciseTopic exerciseId={id} />
        </TabsContent>
        <TabsContent forceMount value="assignment" className="flex-1 min-h-0 overflow-hidden data-[state=inactive]:hidden">
          <SqlEditor exerciseId={id} />
        </TabsContent>
      </Tabs>
    </div >
  )

}

export default Page

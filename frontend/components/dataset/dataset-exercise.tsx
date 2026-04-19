import { Exercise } from "@/lib/types"
import DatasetExercisesCreateButton from "./dataset-exercises-create-button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item"
import { Button } from "../ui/button"
import { IconArrowRight } from "@tabler/icons-react"
import { Badge } from "../ui/badge"
import { useDatasetExercises } from "@/hooks/exercises"

const DatasetExercise = ({ datasetId, onCreated }: {
  datasetId: string
  onCreated?: (exercise: Exercise) => void
}) => {
  const { exercises } = useDatasetExercises(datasetId)
  return (
    <div className="flex flex-col gap-2 p-4">
      <DatasetExercisesCreateButton datasetId={datasetId} onCreated={onCreated} />
      <div className="flex flex-col items-center justify-center gap-4">
        {exercises?.map((exercise) => (
          <Item key={exercise.id} variant={"outline"}>
            <ItemMedia>
              <Badge>{exercise.level}</Badge>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{exercise.name}</ItemTitle>
              <ItemDescription>{exercise.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant={"outline"}>
                Practice
                <IconArrowRight />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  )
}

export default DatasetExercise

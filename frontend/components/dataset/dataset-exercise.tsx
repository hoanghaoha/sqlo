import DatasetExercisesCreateButton from "./dataset-exercises-create-button"
import { useDatasetExercises } from "@/hooks/exercises"
import ExerciseCard from "../exercise/exercise-card"

const DatasetExercise = ({ datasetId }: { datasetId: string }) => {
  const { exercises, refresh } = useDatasetExercises(datasetId)
  return (
    <div className="flex flex-col gap-2 p-4">
      <DatasetExercisesCreateButton datasetId={datasetId} onCreated={refresh} />
      <div className="flex flex-col gap-4">
        {exercises?.map((exercise) => (
          <ExerciseCard {...exercise} key={exercise.id} onDeleted={refresh} />
        ))}
      </div>
    </div>
  )
}

export default DatasetExercise

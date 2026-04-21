import { useDatasetExercises } from "@/hooks/exercises"
import ExerciseCard from "../exercise/exercise-card"
import { Dataset } from "@/lib/types"
import ExerciseCreateButton from "../exercise/exercise-create-button"

const DatasetExercise = (dataset: Dataset) => {
  const { exercises, refresh } = useDatasetExercises(dataset.id)
  return (
    <div className="flex flex-col gap-2 p-4">
      <ExerciseCreateButton dataset={dataset} onCreated={refresh} />
      <div className="flex flex-col gap-4">
        {exercises?.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} includeIndustry={false} onDeleted={refresh} />
        ))}
      </div>
    </div>
  )
}

export default DatasetExercise

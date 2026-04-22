"use client"

import { useUserExercises } from "@/hooks/exercises"
import ExerciseCard from "@/components/exercise/exercise-card"
import ExerciseCreateButton from "@/components/exercise/exercise-create-button"

const Page = () => {
  const { exercises, refresh } = useUserExercises()

  return (
    <div className="flex flex-col gap-6 pt-12 w-[60%] mx-auto">
      <div className="flex items-center justify-between w-full">
        <p className="text-xl font-semibold">Exercises</p>
        <ExerciseCreateButton />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        {exercises?.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            includeIndustry={true}
            onDeleted={refresh}
            onUpdated={refresh}
          />
        ))}
      </div>
    </div>
  )
}

export default Page

"use client"

import { useUserExercises } from "@/hooks/exercises"
import ExerciseCard from "@/components/exercise/exercise-card"

const Page = () => {
  const { exercises } = useUserExercises()
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        {exercises?.map((exercise) => (
          <ExerciseCard key={exercise.id} {...exercise} />
        ))}
      </div>
    </div>
  )
}

export default Page

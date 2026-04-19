import { Exercise } from "@/lib/types"
import { Badge } from "../ui/badge"

const ExerciseTopic = (exercise: Exercise) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="font-extrabold text-xl">{exercise.name}</p>
      <Badge>{exercise.level}</Badge>
      {exercise.topics.map((topic) => (<Badge key={topic}>{topic}</Badge>))}
      <p className="font-medium text-lg">{exercise.description}</p>
    </div>
  )
}

export default ExerciseTopic

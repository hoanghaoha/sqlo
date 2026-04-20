import ReactMarkdown from "react-markdown"
import { Badge } from "../ui/badge"
import { useExercise } from "@/hooks/exercises"

const ExerciseTopic = ({ exerciseId }: { exerciseId: string }) => {
  const exercise = useExercise(exerciseId)

  if (!exercise) return <p>Loading...</p>

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-xl font-extrabold">{exercise.name}</p>
      <div className="flex flex-wrap gap-2">
        <Badge>{exercise.level}</Badge>
        {exercise.topics.map((topic) => (
          <Badge key={topic}>{topic}</Badge>
        ))}
      </div>
      <div className="text-sm leading-relaxed">
        <ReactMarkdown
          components={{
            h3: ({ children }) => (
              <h3 className="mt-4 mb-2 text-base font-semibold first:mt-0">
                {children}
              </h3>
            ),
            p: ({ children }) => <p className="mb-2">{children}</p>,
            ul: ({ children }) => (
              <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>
            ),
            code: ({ children }) => (
              <code className="bg-muted rounded px-1 py-0.5 font-mono text-[0.85em]">
                {children}
              </code>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
          }}
        >
          {exercise.description}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default ExerciseTopic

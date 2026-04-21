import { Exercise } from "@/lib/types"
import { Button } from "../ui/button"
import ReactMarkdown from "react-markdown"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from "../ui/item"
import { IconArrowRight, IconTrash } from "@tabler/icons-react"
import { Badge } from "../ui/badge"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { EXERCISE_LEVEL_MAP } from "@/lib/const"

const ExerciseCard = (exercise: Exercise & { onDeleted?: () => void }) => {
  const router = useRouter()
  const level = EXERCISE_LEVEL_MAP[exercise.level]
  const LevelIcon = level?.icon

  return (
    <Item variant={"outline"}>
      <ItemContent>
        <ItemTitle>
          <HoverCard>
            <HoverCardTrigger className="hover:underline">{exercise.name}</HoverCardTrigger>
            <HoverCardContent className="max-h-[50vh] overflow-y-auto border-primary border-2" align="start">
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
              >{exercise.description}</ReactMarkdown>
            </HoverCardContent>
          </HoverCard>
        </ItemTitle>
        <ItemDescription className={`font-bold flex items-center gap-1 ${level?.color ?? ""}`}>
          {LevelIcon && <LevelIcon className="h-5 w-5" />}
          {exercise.level.toUpperCase()}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size={"icon"} onClick={() => router.push(`/practice/${exercise.id}`)}>
          <IconArrowRight />
        </Button>
        <Button size={"icon"} variant={"destructive"} onClick={async () => {
          await apiFetch(`/exercises/exercise/${exercise.id}`, { method: "DELETE" })
          exercise.onDeleted?.()
        }}>
          <IconTrash />
        </Button>
      </ItemActions>
      <ItemFooter className="flex flex-row gap-2 justify-start">
        {exercise.topics.map((topic, index) => <Badge key={index} variant={"secondary"}>{topic}</Badge>)}
      </ItemFooter>
    </Item >
  )
}


export default ExerciseCard

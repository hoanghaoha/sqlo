import { Exercise } from "@/lib/types"
import { Button } from "../ui/button"
import ReactMarkdown from "react-markdown"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from "../ui/item"
import { IconArrowRight, IconGlobe, IconLock, IconTrash } from "@tabler/icons-react"
import { Badge } from "../ui/badge"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { EXERCISE_LEVEL_MAP, DATASET_INDUSTRIES } from "@/lib/const"
import { useDataset } from "@/hooks/datasets"
import { useState } from "react"

const ExerciseCard = ({ exercise, onDeleted, onUpdated, includeIndustry }: { exercise: Exercise, includeIndustry: boolean, onDeleted?: () => void, onUpdated?: () => void }) => {
  const dataset = useDataset(exercise.dataset_id)
  const router = useRouter()
  const level = EXERCISE_LEVEL_MAP[exercise.level]
  const [toggling, setToggling] = useState(false)
  const LevelIcon = level?.icon
  const industry = DATASET_INDUSTRIES.find(i => i.value === dataset?.industry)
  const IndustryIcon = industry?.icon

  return (
    <Item variant={"outline"}>
      <ItemContent>
        <ItemTitle>
          <HoverCard>
            <HoverCardTrigger className="hover:underline flex items-center justify-start gap-2">
              <p>
                {exercise.name.length > 50 ? exercise.name.slice(0, 40) + "..." : exercise.name}
              </p>
              {includeIndustry && industry && IndustryIcon &&
                <Badge variant={"outline"} className="gap-1">
                  <IndustryIcon className="size-3.5" />
                  {industry.label}
                </Badge>
              }
            </HoverCardTrigger>
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
        <Button
          size="icon"
          variant="outline"
          disabled={toggling}
          title={exercise.visibility === true ? "Make private" : "Make public"}
          onClick={async () => {
            setToggling(true)
            try {
              await apiFetch(`/exercises/exercise/${exercise.id}/visibility`, { method: "PUT" })
              onUpdated?.()
            } finally {
              setToggling(false)
            }
          }}
        >
          {exercise.visibility === true
            ? <IconGlobe className="size-4 text-primary" />
            : <IconLock className="size-4 text-muted-foreground" />
          }
        </Button>
        <Button size={"icon"} onClick={() => router.push(`/practice/${exercise.id}`)}>
          <IconArrowRight />
        </Button>
        <Button size={"icon"} variant={"destructive"} onClick={async () => {
          await apiFetch(`/exercises/exercise/${exercise.id}`, { method: "DELETE" })
          onDeleted?.()
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

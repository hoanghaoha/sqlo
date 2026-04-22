"use client"

import { CommunityExercise } from "@/lib/types"
import { Button } from "../ui/button"
import ReactMarkdown from "react-markdown"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from "../ui/item"
import { IconArrowRight, IconGlobe, IconLock } from "@tabler/icons-react"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { EXERCISE_LEVEL_MAP, DATASET_INDUSTRIES } from "@/lib/const"
import { useState } from "react"

const CommunityExerciseCard = ({
  exercise,
  onVisibilityToggled,
}: {
  exercise: CommunityExercise
  onVisibilityToggled?: () => void
}) => {
  const router = useRouter()
  const level = EXERCISE_LEVEL_MAP[exercise.level]
  const LevelIcon = level?.icon
  const industry = DATASET_INDUSTRIES.find(i => i.value === exercise.industry)
  const IndustryIcon = industry?.icon
  const [toggling, setToggling] = useState(false)

  const handleToggleVisibility = async () => {
    setToggling(true)
    try {
      await apiFetch(`/exercises/exercise/${exercise.id}/visibility`, { method: "PUT" })
      onVisibilityToggled?.()
    } finally {
      setToggling(false)
    }
  }

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>
          <HoverCard>
            <HoverCardTrigger className="hover:underline flex items-center justify-start gap-2">
              <p>{exercise.name.length > 50 ? exercise.name.slice(0, 40) + "..." : exercise.name}</p>
              {industry && IndustryIcon && (
                <Badge variant="outline" className="gap-1">
                  <IndustryIcon className="size-3.5" />
                  {industry.label}
                </Badge>
              )}
            </HoverCardTrigger>
            <HoverCardContent className="max-h-[50vh] overflow-y-auto border-primary border-2" align="start">
              <ReactMarkdown
                components={{
                  h3: ({ children }) => <h3 className="mt-4 mb-2 text-base font-semibold first:mt-0">{children}</h3>,
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>,
                  code: ({ children }) => <code className="bg-muted rounded px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                }}
              >{exercise.description}</ReactMarkdown>
            </HoverCardContent>
          </HoverCard>
        </ItemTitle>

        <ItemDescription className={`font-bold flex items-center gap-1 ${level?.color ?? ""}`}>
          {LevelIcon && <LevelIcon className="size-5" />}
          {exercise.level.toUpperCase()}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        {exercise.is_owner && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleToggleVisibility}
            disabled={toggling}
            title={exercise.visibility === true ? "Make private" : "Make public"}
          >
            {exercise.visibility === true
              ? <IconGlobe className="size-4 text-primary" />
              : <IconLock className="size-4 text-muted-foreground" />
            }
          </Button>
        )}
        <Button size="icon" onClick={() => router.push(`/practice/${exercise.id}`)}>
          <IconArrowRight />
        </Button>
      </ItemActions>

      <ItemFooter className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2 flex-wrap">
          {exercise.topics.map((topic, i) => (
            <Badge key={i} variant="secondary">{topic}</Badge>
          ))}
        </div>
        {!exercise.is_owner && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <Avatar className="size-4">
              <AvatarImage src={exercise.author_avatar ?? undefined} />
              <AvatarFallback className="text-[9px]">{exercise.author_name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            {exercise.author_name}
          </div>
        )}
      </ItemFooter>
    </Item>
  )
}

export default CommunityExerciseCard

"use client"

import { useState } from "react"
import { Exercise } from "@/lib/types"
import { Button } from "../ui/button"
import ReactMarkdown from "react-markdown"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from "../ui/item"
import { IconArrowRight, IconBookmark, IconGlobe, IconLock, IconTrash } from "@tabler/icons-react"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { EXERCISE_LEVEL_MAP, DATASET_INDUSTRIES } from "@/lib/const"
import { useDataset } from "@/hooks/datasets"

interface ExerciseCardProps {
  exercise: Exercise
  onDeleted?: () => void
  onUpdated?: () => void
}

const ExerciseCard = ({ exercise, onDeleted, onUpdated }: ExerciseCardProps) => {
  const router = useRouter()
  const [toggling, setToggling] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // use pre-fetched industry (community exercises) or fetch from dataset
  const dataset = useDataset(exercise.industry ? "" : exercise.dataset_id)
  const industryValue = exercise.industry ?? dataset?.industry
  const level = EXERCISE_LEVEL_MAP[exercise.level]
  const LevelIcon = level?.icon
  const industry = DATASET_INDUSTRIES.find(i => i.value === industryValue)
  const IndustryIcon = industry?.icon

  // is_owner is undefined for own exercises (always show controls), explicit for community
  const isOwner = exercise.is_owner ?? true

  const handleSave = async () => {
    setSaving(true)
    try {
      await apiFetch(`/exercises/exercise/${exercise.id}/save`, { method: "POST" })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleVisibility = async () => {
    setToggling(true)
    try {
      await apiFetch(`/exercises/exercise/${exercise.id}/visibility`, { method: "PUT" })
      onUpdated?.()
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
              {exercise.is_solved && (
                <Badge className="gap-1 bg-green-500/10 text-green-600 border-green-500/30 dark:text-green-400">
                  SOLVED
                </Badge>
              )}
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
        {!isOwner && (
          <Button
            size="icon"
            variant="outline"
            disabled={saving || saved}
            title={saved ? "Saved to your exercises" : "Save to your exercises"}
            onClick={handleSave}
          >
            <IconBookmark className={`size-4 ${saved ? "fill-current text-primary" : "text-muted-foreground"}`} />
          </Button>
        )}
        {isOwner && (
          <Button
            size="icon"
            variant="outline"
            disabled={toggling}
            title={exercise.visibility ? "Make private" : "Make public"}
            onClick={handleToggleVisibility}
          >
            {exercise.visibility
              ? <IconGlobe className="size-4 text-primary" />
              : <IconLock className="size-4 text-muted-foreground" />
            }
          </Button>
        )}
        <Button size="icon" onClick={() => router.push(`/practice/${exercise.id}`)}>
          <IconArrowRight />
        </Button>
        {isOwner && onDeleted && (
          <Button size="icon" variant="destructive" onClick={async () => {
            await apiFetch(`/exercises/exercise/${exercise.id}`, { method: "DELETE" })
            onDeleted()
          }}>
            <IconTrash />
          </Button>
        )}
      </ItemActions>

      <ItemFooter className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2 flex-wrap">
          {exercise.topics.map((topic, i) => (
            <Badge key={i} variant="secondary">{topic}</Badge>
          ))}
        </div>
        {!isOwner && exercise.author_name && (
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

export default ExerciseCard

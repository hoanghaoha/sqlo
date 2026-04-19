"use client"

import { IconArrowRight } from "@tabler/icons-react"
import { useUserExercises } from "@/hooks/exercises"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const Page = () => {
  const { exercises } = useUserExercises()
  const router = useRouter()
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        {exercises?.map((exercise) => (
          <Item key={exercise.id} variant={"outline"}>
            <ItemContent className="flex flex-col gap-4">
              <ItemTitle className="flex flex-col gap-2 items-start">
                <p>{exercise.name}</p>
                <Badge>{exercise.level}</Badge>
              </ItemTitle>
              <ItemDescription>{exercise.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant={"outline"} onClick={() => router.push(`/practice/${exercise.id}`)}>
                Practice
                <IconArrowRight />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  )
}

export default Page

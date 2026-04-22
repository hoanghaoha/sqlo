"use client"

import { useState } from "react"
import { useCommunityExercises } from "@/hooks/exercises"
import ExerciseCard from "@/components/exercise/exercise-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DATASET_INDUSTRIES, EXERCISE_LEVELS } from "@/lib/const"

const ALL = "__all__"

const Page = () => {
  const [level, setLevel] = useState("")
  const [industry, setIndustry] = useState("")
  const { exercises, loading, refresh } = useCommunityExercises(level || undefined, industry || undefined)

  return (
    <div className="flex flex-col gap-6 pt-12 w-[60%] mx-auto">
      <div className="flex items-center justify-between w-full">
        <p className="text-xl font-semibold">Community Exercises</p>
        <div className="flex items-center gap-2">
          <Select value={level || ALL} onValueChange={v => setLevel(v === ALL ? "" : v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All levels</SelectItem>
              {EXERCISE_LEVELS.map(l => (
                <SelectItem key={l.value} value={l.value}>
                  <span className={`flex items-center gap-2 ${l.color}`}>
                    <l.icon className="size-4" />
                    {l.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={industry || ALL} onValueChange={v => setIndustry(v === ALL ? "" : v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All industries</SelectItem>
              {DATASET_INDUSTRIES.map(i => (
                <SelectItem key={i.value} value={i.value}>
                  <span className="flex items-center gap-2">
                    <i.icon className="size-4" />
                    {i.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground py-8 text-center">Loading...</div>
      ) : exercises?.length === 0 ? (
        <div className="text-sm text-muted-foreground py-8 text-center">
          No public exercises yet. Be the first to share one!
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {exercises?.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onUpdated={refresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Page

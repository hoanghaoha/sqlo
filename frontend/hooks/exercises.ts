import { apiFetch } from "@/lib/api";
import { Exercise } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useUserExercises() {
  const [exercises, setExercises] = useState<Exercise[] | null>(null)
  const load = useCallback(async () => {
    const data = await apiFetch<Exercise[]>(`/exercises/`)
    setExercises(data)
  }, [])

  useEffect(() => { load() }, [load])

  return { exercises, refresh: load }
}

export function useDatasetExercises(datasetId: string) {
  const [exercises, setExercises] = useState<Exercise[] | null>(null)
  const load = useCallback(async () => {
    const data = await apiFetch<Exercise[]>(`/exercises/${datasetId}`)
    setExercises(data)
  }, [])

  useEffect(() => { load() }, [load])

  return { exercises, refresh: load }
}

export function useExercise(exerciseId: string) {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const load = useCallback(async () => {
    if (!exerciseId) return
    const data = await apiFetch<Exercise>(`/exercises/exercise/${exerciseId}`)
    setExercise(data)
  }, [exerciseId])

  useEffect(() => { load() }, [load])

  return exercise
}


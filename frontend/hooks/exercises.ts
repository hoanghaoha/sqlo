import { apiFetch } from "@/lib/api";
import { Exercise } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useExercises(datasetId: string) {
  const [exercises, setExercises] = useState<Exercise[] | null>(null)
  const load = useCallback(async () => {
    const data = await apiFetch<Exercise[]>(`/exercises/${datasetId}`)
    setExercises(data)
  }, [])

  useEffect(() => { load() }, [load])

  return { exercises, refresh: load }
}

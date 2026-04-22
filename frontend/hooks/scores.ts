import { apiFetch } from "@/lib/api"
import { ScoreSummary } from "@/lib/types"
import { useCallback, useEffect, useState } from "react"

export function useScoreSummary() {
  const [summary, setSummary] = useState<ScoreSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiFetch<ScoreSummary>(`/scores/summary`)
      setSummary(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { summary, loading, refresh: load }
}

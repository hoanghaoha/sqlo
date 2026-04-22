import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/api"
import { UserProfile } from "@/lib/types"

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      await apiFetch("/users/onboard", { method: "POST" })
      const data = await apiFetch<UserProfile>("/users/me")
      setProfile(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const update = useCallback(async (patch: Partial<UserProfile>) => {
    await apiFetch("/users/me", {
      method: "PUT",
      body: JSON.stringify(patch),
    })
    await load()
  }, [load])

  return { profile, loading, refresh: load, update }
}

import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { UserProfile } from "@/lib/types"

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function load() {
      await apiFetch("/users/onboard", { method: "POST" })
      const data = await apiFetch<UserProfile>("/users/me")
      setProfile(data)
    }
    load()
  }, [])

  return profile
}

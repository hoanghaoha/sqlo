"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useProfile } from "@/hooks/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DATASET_INDUSTRIES } from "@/lib/const"
import { IconCheck } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

const SQL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

const PURPOSES = [
  { value: "learning", label: "Learning" },
  { value: "interview", label: "Interview prep" },
  { value: "work", label: "Work practice" },
]

const Page = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { profile, loading, update } = useProfile()

  const [industry, setIndustry] = useState("")
  const [level, setLevel] = useState("")
  const [purpose, setPurpose] = useState("")
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  useEffect(() => {
    if (!profile) return
    setIndustry(profile.industry ?? "")
    setLevel(profile.level ?? "")
    setPurpose(profile.purpose ?? "")
  }, [profile])

  const dirty =
    !!profile &&
    (industry !== (profile.industry ?? "") ||
      level !== (profile.level ?? "") ||
      purpose !== (profile.purpose ?? ""))

  const handleSave = async () => {
    setSaving(true)
    try {
      await update({ industry, level, purpose } as never)
      setSavedAt(Date.now())
    } finally {
      setSaving(false)
    }
  }

  if (loading || !profile) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6 pt-12 w-[60%] mx-auto">
      <div>
        <p className="text-xl font-semibold">Profile</p>
        <p className="text-sm text-muted-foreground">Manage your account and practice preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Synced from your sign-in provider</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
            <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-sm font-medium">{user?.user_metadata?.full_name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="capitalize">{profile.plan}</Badge>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => router.push("/plan")}>
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Tailor exercises and dashboard to how you practice</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <Label>Preferred industry</Label>
              <Select value={industry || undefined} onValueChange={setIndustry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick an industry" />
                </SelectTrigger>
                <SelectContent>
                  {DATASET_INDUSTRIES.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <opt.icon className="size-4" />
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label>SQL level</Label>
              <Select value={level || undefined} onValueChange={setLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick your level" />
                </SelectTrigger>
                <SelectContent>
                  {SQL_LEVELS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label>Purpose</Label>
              <Select value={purpose || undefined} onValueChange={setPurpose}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Why are you practicing?" />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSES.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-end gap-3 mt-6">
            {savedAt && !dirty && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <IconCheck className="size-3.5" /> Saved
              </span>
            )}
            <Button onClick={handleSave} disabled={!dirty || saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page

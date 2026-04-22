"use client"

import { useCallback, useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { LeaderboardEntry, LeaderboardResponse } from "@/lib/types"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  IconCrown, IconSwords, IconDiamond, IconHexagonFilled,
  IconTrophy, IconMedal, IconAward,
} from "@tabler/icons-react"

type Period = "all_time" | "this_month" | "this_week"

const RANK_STYLES: Record<string, { color: string; icon: React.ElementType }> = {
  Challenger: { color: "text-red-500",    icon: IconSwords },
  Master:     { color: "text-purple-500", icon: IconCrown },
  Diamond:    { color: "text-cyan-400",   icon: IconDiamond },
  Platinum:   { color: "text-teal-400",   icon: IconHexagonFilled },
  Gold:       { color: "text-yellow-500", icon: IconTrophy },
  Silver:     { color: "text-slate-400",  icon: IconMedal },
  Bronze:     { color: "text-amber-700",  icon: IconAward },
}

const MEDAL_COLOR: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-slate-400",
  3: "text-amber-600",
}

function RankBadge({ rankName }: { rankName: string }) {
  const style = RANK_STYLES[rankName] ?? RANK_STYLES.Bronze
  const Icon = style.icon
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${style.color}`}>
      <Icon className="size-3.5" />
      {rankName}
    </span>
  )
}

function EntryRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry
  isCurrentUser: boolean
}) {
  const medalColor = entry.rank ? MEDAL_COLOR[entry.rank] : undefined

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isCurrentUser ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-muted/50"}`}>
      <span className={`w-7 text-sm font-bold tabular-nums text-right shrink-0 ${medalColor ?? "text-muted-foreground"}`}>
        {entry.rank ?? "—"}
      </span>

      <Avatar className="size-8 shrink-0">
        <AvatarImage src={entry.avatar_url ?? undefined} alt={entry.display_name} />
        <AvatarFallback className="text-xs">{entry.display_name[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {entry.display_name}
          {isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
        </p>
        <RankBadge rankName={entry.rank_name} />
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold tabular-nums">{entry.total_score.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{entry.solved_count} solved</p>
      </div>
    </div>
  )
}

const Page = () => {
  const { user } = useAuth()
  const [period, setPeriod] = useState<Period>("all_time")
  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (p: Period) => {
    setLoading(true)
    try {
      const result = await apiFetch<LeaderboardResponse>(`/leaderboard/?period=${p}`)
      setData(result)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(period) }, [period, load])

  const currentUserId = user?.id
  const currentUserInTop = data?.entries.some(e => e.user_id === currentUserId)
  const currentUser = data?.current_user

  return (
    <div className="flex flex-col gap-6 pt-12 w-[55%] mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold">Leaderboard</p>
        <Tabs value={period} onValueChange={v => setPeriod(v as Period)}>
          <TabsList>
            <TabsTrigger value="all_time">All time</TabsTrigger>
            <TabsTrigger value="this_month">This month</TabsTrigger>
            <TabsTrigger value="this_week">This week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground py-8 text-center">Loading...</div>
      ) : !data || data.entries.length === 0 ? (
        <div className="text-sm text-muted-foreground py-8 text-center">No scores yet for this period.</div>
      ) : (
        <div className="flex flex-col gap-1">
          {data.entries.map(entry => (
            <EntryRow
              key={entry.user_id}
              entry={entry}
              isCurrentUser={entry.user_id === currentUserId}
            />
          ))}

          {!currentUserInTop && currentUser && (
            <>
              <div className="flex items-center gap-2 px-4 py-1">
                <div className="flex-1 border-t border-dashed border-border" />
                <span className="text-xs text-muted-foreground shrink-0">your position</span>
                <div className="flex-1 border-t border-dashed border-border" />
              </div>
              <EntryRow entry={currentUser} isCurrentUser />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Page

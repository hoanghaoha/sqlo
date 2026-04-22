"use client"

import { Bar, BarChart, CartesianGrid, RadialBar, RadialBarChart, XAxis, YAxis, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { IconFlame, IconTrophy, IconTarget, IconCrown, IconSwords, IconDiamond, IconHexagonFilled, IconMedal, IconAward } from "@tabler/icons-react"
import type { ComponentType } from "react"
import { useScoreSummary } from "@/hooks/scores"

interface Rank {
  name: string
  min: number
  color: string
  bg: string
  bar: string
  icon: ComponentType<{ className?: string }>
}

const RANKS: Rank[] = [
  { name: "Challenger", min: 20000, color: "text-red-500", bg: "bg-red-500/10", bar: "bg-red-500", icon: IconSwords },
  { name: "Master", min: 10000, color: "text-purple-500", bg: "bg-purple-500/10", bar: "bg-purple-500", icon: IconCrown },
  { name: "Diamond", min: 5000, color: "text-cyan-400", bg: "bg-cyan-400/10", bar: "bg-cyan-400", icon: IconDiamond },
  { name: "Platinum", min: 2000, color: "text-teal-400", bg: "bg-teal-400/10", bar: "bg-teal-400", icon: IconHexagonFilled },
  { name: "Gold", min: 1000, color: "text-yellow-500", bg: "bg-yellow-500/10", bar: "bg-yellow-500", icon: IconTrophy },
  { name: "Silver", min: 500, color: "text-slate-400", bg: "bg-slate-400/10", bar: "bg-slate-400", icon: IconMedal },
  { name: "Bronze", min: 0, color: "text-amber-700", bg: "bg-amber-700/10", bar: "bg-amber-700", icon: IconAward },
]

function getRank(score: number) {
  return RANKS.find(r => score >= r.min) ?? RANKS[RANKS.length - 1]
}

function getNextRank(score: number) {
  const idx = RANKS.findIndex(r => score >= r.min)
  return idx > 0 ? RANKS[idx - 1] : null
}

function getRankProgress(score: number) {
  const idx = RANKS.findIndex(r => score >= r.min)
  const next = idx > 0 ? RANKS[idx - 1] : null
  if (!next) return 100
  const prevMin = RANKS[idx + 1]?.min ?? 0
  return Math.min(100, ((score - prevMin) / (next.min - prevMin)) * 100)
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const activityConfig = {
  count: { label: "Solved", color: "var(--primary)" },
} satisfies ChartConfig

const difficultyConfig = {
  easy: { label: "Easy", color: "var(--color-green-500)" },
  medium: { label: "Medium", color: "var(--color-yellow-500)" },
  hard: { label: "Hard", color: "var(--color-red-500)" },
} satisfies ChartConfig

const industryConfig = {
  count: { label: "Solved", color: "var(--primary)" },
} satisfies ChartConfig

export function ScoreDashboard() {
  const { summary, loading } = useScoreSummary()

  if (loading || !summary) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  }

  const stats = summary
  const rank = getRank(stats.total_score)
  const next = getNextRank(stats.total_score)
  const progress = getRankProgress(stats.total_score)
  const totalSolved =
    stats.solved.beginner +
    stats.solved.easy +
    stats.solved.medium +
    stats.solved.hard +
    stats.solved.hell

  const difficultyData = [
    { level: "Beginner", count: stats.solved.beginner, fill: "#94a3b8" },
    { level: "Easy", count: stats.solved.easy, fill: "#22c55e" },
    { level: "Medium", count: stats.solved.medium, fill: "#eab308" },
    { level: "Hard", count: stats.solved.hard, fill: "#ef4444" },
    { level: "Hell", count: stats.solved.hell, fill: "#7c3aed" },
  ]

  const industryData = Object.entries(stats.by_industry)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }))

  const activityData = stats.activity.map(a => ({
    date: WEEKDAY[new Date(a.date).getUTCDay()],
    count: a.count,
  }))

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* Hero row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Rank hero */}
        <Card className={`lg:col-span-1 ${rank.bg} ring-1 ring-inset ring-foreground/10 flex flex-col items-center justify-center text-center`}>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <rank.icon className={`size-20 ${rank.color}`} />
            <p className={`text-5xl font-black tracking-tight ${rank.color}`}>{rank.name}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 w-full items-start">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <IconTrophy className="size-4" />
              {stats.total_score.toLocaleString()} pts total
            </div>
            {next ? (
              <div className="w-full flex flex-col gap-1.5 items-start">
                <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${rank.bar}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {(next.min - stats.total_score).toLocaleString()} pts to{" "}
                  <span className={`font-semibold ${next.color}`}>{next.name}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Maximum rank achieved</p>
            )}
          </CardFooter>
        </Card>

        {/* Sub-stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <Card className="flex flex-col justify-center items-center text-center">
            <CardContent className="flex items-center gap-3 py-6">
              <IconFlame className="size-12 text-orange-500" />
              <div>
                <p className="text-5xl font-black tabular-nums">{stats.streak}</p>
                <p className="text-xs text-muted-foreground mt-1">day streak</p>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Best: <span className="font-semibold text-foreground ml-1">{stats.best_streak}</span>
              <span className="ml-1">days</span>
            </CardFooter>
          </Card>
          <Card className="flex flex-col justify-center items-center text-center">
            <CardContent className="flex items-center gap-3 py-6">
              <IconTarget className="size-12 text-primary" />
              <div>
                <p className="text-5xl font-black tabular-nums">{totalSolved}</p>
                <p className="text-xs text-muted-foreground mt-1">solved</p>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              across all difficulties
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Activity bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Exercises solved — last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={activityConfig} className="h-[160px] w-full">
              <BarChart data={activityData} barSize={24}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" fill="var(--primary)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Difficulty radial chart */}
        <Card>
          <CardHeader>
            <CardTitle>By Difficulty</CardTitle>
            <CardDescription>Solved per level</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <ChartContainer config={difficultyConfig} className="h-[160px] flex-1 min-w-0">
              <RadialBarChart
                data={difficultyData}
                innerRadius={30}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
              >
                <ChartTooltip content={<ChartTooltipContent nameKey="level" hideLabel />} />
                <RadialBar dataKey="count" background={{ fill: "var(--muted)" }} cornerRadius={4}>
                  {difficultyData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </RadialBar>
              </RadialBarChart>
            </ChartContainer>
            <div className="flex flex-col gap-1.5 text-xs shrink-0 min-w-[80px]">
              {difficultyData.map(d => (
                <div key={d.level} className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-muted-foreground">{d.level}</span>
                  <span className="font-medium tabular-nums ml-auto pl-2">{d.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Industry horizontal bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>By Industry</CardTitle>
            <CardDescription>Solved per industry</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={industryConfig} className="h-[160px] w-full">
              <BarChart data={industryData} layout="vertical" barSize={16}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tickMargin={8} width={80} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" fill="var(--primary)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

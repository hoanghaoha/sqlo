"use client"

import { useProfile } from "@/hooks/user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconCheck, IconCrown } from "@tabler/icons-react"

const tiers = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Enough to feel the value.",
    features: [
      "2 datasets stored (small only)",
      "5 exercises stored",
      "Unlimited SQL practice",
      "Hints & score tracking",
      "Community exercises",
      "Leaderboard",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$9",
    period: "per month",
    yearlyNote: "$79/yr — save 27%",
    description: "For serious learners and interview prep.",
    features: [
      "Unlimited datasets stored",
      "Small / Medium / Large datasets",
      "Unlimited exercises",
      "Everything in Free",
    ],
  },
]

const Page = () => {
  const { profile, loading } = useProfile()

  if (loading || !profile) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  }

  const currentPlan = profile.plan ?? "free"

  return (
    <div className="flex flex-col gap-6 pt-12 w-[60%] mx-auto">
      <div>
        <p className="text-xl font-semibold">Plan & Billing</p>
        <p className="text-sm text-muted-foreground">
          You are on the <span className="font-medium capitalize">{currentPlan}</span> plan.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tiers.map((tier) => {
          const isCurrent = tier.key === currentPlan
          const isUpgrade = tier.key === "pro" && currentPlan === "free"

          return (
            <Card
              key={tier.key}
              className={`relative flex flex-col ${isCurrent ? "border-primary shadow-md overflow-visible" : "border-border/60"}`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <Badge className="rounded-full px-3">Current plan</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                  {tier.key === "pro" && <IconCrown className="size-4 text-yellow-500" />}
                  {tier.name}
                </CardTitle>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">/{tier.period}</span>
                </div>
                {"yearlyNote" in tier && tier.yearlyNote && (
                  <p className="text-xs text-muted-foreground">{tier.yearlyNote}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-6">
                <ul className="space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <IconCheck className="size-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isUpgrade && (
                  <Button className="w-full" asChild>
                    <a href="mailto:hhhao.vn@gmail.com?subject=Upgrade to Pro">
                      Upgrade to Pro
                    </a>
                  </Button>
                )}
                {isCurrent && tier.key === "pro" && (
                  <Button variant="outline" className="w-full" disabled>
                    Manage Subscription
                  </Button>
                )}
                {isCurrent && tier.key === "free" && (
                  <Button variant="ghost" className="w-full" disabled>
                    Current plan
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Payment integration coming soon — upgrading sends an email to get you set up manually.
      </p>
    </div>
  )
}

export default Page

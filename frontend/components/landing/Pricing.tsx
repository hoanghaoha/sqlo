"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { signInWithGoogle } from "@/lib/supabase"
import { IconCheck } from "@tabler/icons-react"

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Enough to feel the value.",
    cta: "Get Started",
    highlight: false,
    features: [
      "2 datasets",
      "10 problems per dataset",
      "3 AI solves per day",
      "Community datasets",
      "Basic score tracking",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    yearlyNote: "$99/yr — save 31%",
    description: "For serious learners and interview prep.",
    cta: "Start Pro Free",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited datasets",
      "Unlimited problems",
      "Unlimited AI solves",
      "CSV upload",
      "Concept analytics",
      "Full attempt history",
    ],
  },
  {
    name: "Teacher",
    price: "$49",
    period: "per month",
    yearlyNote: "$399/yr",
    description: "For instructors and bootcamps.",
    cta: "Start Teaching",
    highlight: false,
    features: [
      "Everything in Pro",
      "Cohort management",
      "Assignments with due dates",
      "Student progress dashboard",
      "Class leaderboard",
      "CSV export of scores",
    ],
  },
]

const Pricing = () => {
  return (
    <section id="pricing" className="px-6 py-24 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Simple pricing</h2>
          <p className="text-muted-foreground mt-3">Start free. Upgrade when you hit the wall.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-5">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col ${tier.highlight ? "border-primary shadow-md overflow-visible" : "border-border/60"}`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <Badge className="rounded-full px-3">{tier.badge}</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium text-muted-foreground">{tier.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">/{tier.period}</span>
                </div>
                {tier.yearlyNote && (
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
                <Button
                  variant={tier.highlight ? "default" : "outline"}
                  className="w-full"
                  onClick={signInWithGoogle}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          All plans include Google sign-in · No credit card required to start
        </p>
      </div>
    </section>
  )
}

export default Pricing

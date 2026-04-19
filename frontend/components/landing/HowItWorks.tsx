import { IconDatabase, IconSparkles, IconCode, IconCheckbox, IconTrendingUp } from "@tabler/icons-react"

const steps = [
  {
    icon: IconDatabase,
    title: "Create a Dataset",
    description: "Describe any database in plain English. AI generates the schema and fills it with realistic data in seconds.",
    example: '"E-commerce database with customers, orders, products — 1,000 rows"',
  },
  {
    icon: IconSparkles,
    title: "Generate Problems",
    description: "AI writes practice problems tailored to your dataset. Choose difficulty, concept focus, and quantity.",
    example: "5 hard problems focused on window functions",
  },
  {
    icon: IconCode,
    title: "Solve in Browser",
    description: "Write SQL in a full editor with syntax highlighting and schema autocomplete. No setup, no installs.",
    example: "Monaco editor with your table and column names",
  },
  {
    icon: IconCheckbox,
    title: "Auto-Graded",
    description: "Your results are compared to the solution by value — not string matching. Get row diffs on wrong answers.",
    example: "You got 8 rows, expected 5 rows",
  },
  {
    icon: IconTrendingUp,
    title: "Track Your Score",
    description: "Points accumulate per dataset. See your progress across every concept: JOINs, GROUP BY, window functions.",
    example: "E-commerce: 8/12 problems · 67%",
  },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="px-6 py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          <p className="text-muted-foreground mt-3">From zero to practicing SQL in under 2 minutes.</p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-8 bottom-8 w-px bg-border hidden md:block" />
          <div className="space-y-10">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-6 relative">
                <div className="flex-shrink-0 flex items-start justify-center">
                  <div className="size-12 rounded-xl bg-background border flex items-center justify-center shadow-sm z-10">
                    <step.icon className="size-5 text-primary" />
                  </div>
                </div>
                <div className="pt-2 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground mt-1">{step.description}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-mono bg-muted/60 rounded px-2 py-1 inline-block">
                    {step.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

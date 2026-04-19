import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconInfinity, IconLock, IconFolderOpen, IconX, IconCheck } from "@tabler/icons-react"

const features = [
  {
    icon: IconInfinity,
    title: "Infinite Problems",
    description: "AI generates fresh problems on demand — every one is unique. Nothing to memorize, nothing to Google.",
  },
  {
    icon: IconFolderOpen,
    title: "Your Datasets, Your Library",
    description: "Datasets persist. Build an e-commerce DB today, add harder problems next week. Your content grows with you.",
  },
  {
    icon: IconLock,
    title: "Cheat-Proof by Design",
    description: "Problems are generated for your specific dataset. No two users get the same questions — answers can't be shared.",
  },
]

const competitors = [
  { name: "DataLemur", problems: "~250 static", leaked: true, aiGenerated: false, ownDatasets: false },
  { name: "StrataScratch", problems: "600+ static", leaked: true, aiGenerated: false, ownDatasets: false },
  { name: "LeetCode SQL", problems: "~300 static", leaked: true, aiGenerated: false, ownDatasets: false },
  { name: "Sqlo", problems: "Unlimited", leaked: false, aiGenerated: true, ownDatasets: true },
]

const WhySqlo = () => {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight">Why Sqlo beats the alternatives</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Every SQL practice platform has the same problem: static questions with answers on Reddit and YouTube.
          Sqlo solves this at the root.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {features.map((f) => (
          <Card key={f.title} className="border-border/60">
            <CardHeader className="pb-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <f.icon className="size-5 text-primary" />
              </div>
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-4 py-3 font-medium">Platform</th>
              <th className="text-center px-4 py-3 font-medium">Problems</th>
              <th className="text-center px-4 py-3 font-medium">Answers leaked?</th>
              <th className="text-center px-4 py-3 font-medium">AI-generated</th>
              <th className="text-center px-4 py-3 font-medium">Own datasets</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((c, i) => (
              <tr
                key={c.name}
                className={`border-b last:border-0 ${c.name === "Sqlo" ? "bg-primary/5 font-semibold" : ""}`}
              >
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-center text-muted-foreground">{c.problems}</td>
                <td className="px-4 py-3 text-center">
                  {c.leaked
                    ? <IconX className="size-4 text-red-500 mx-auto" />
                    : <IconCheck className="size-4 text-green-500 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center">
                  {c.aiGenerated
                    ? <IconCheck className="size-4 text-green-500 mx-auto" />
                    : <IconX className="size-4 text-red-500 mx-auto" />}
                </td>
                <td className="px-4 py-3 text-center">
                  {c.ownDatasets
                    ? <IconCheck className="size-4 text-green-500 mx-auto" />
                    : <IconX className="size-4 text-red-500 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default WhySqlo

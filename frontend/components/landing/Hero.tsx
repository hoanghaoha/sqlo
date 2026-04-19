"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { signInWithGoogle } from "@/lib/supabase"
import { IconBrandGoogle, IconArrowRight } from "@tabler/icons-react"

const Hero = () => {
  return (
    <section className="flex flex-col items-center text-center px-6 py-24 gap-6 max-w-3xl mx-auto">
      <Badge variant="secondary" className="rounded-full px-4 py-1">
        AI-Powered SQL Practice
      </Badge>

      <h1 className="text-5xl font-bold tracking-tight leading-tight">
        SQL Practice That{" "}
        <span className="text-primary">Can&apos;t Be Googled</span>
      </h1>

      <p className="text-lg text-muted-foreground max-w-xl">
        Build datasets with AI, generate unlimited problems, solve them in-browser.
        Every answer is unique — nothing can be looked up.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
        <Button size="lg" onClick={signInWithGoogle} className="gap-2 px-6">
          <IconBrandGoogle className="size-4" />
          Start Practicing Free
        </Button>
        <Button size="lg" variant="outline" asChild className="gap-2">
          <Link href="#how-it-works">
            See how it works
            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        No credit card required · Free forever plan available
      </p>

      <div className="w-full mt-6 rounded-xl border bg-muted/40 p-6 text-left font-mono text-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-3 rounded-full bg-red-400" />
          <div className="size-3 rounded-full bg-yellow-400" />
          <div className="size-3 rounded-full bg-green-400" />
          <span className="ml-2 text-xs text-muted-foreground">SQL Editor — E-commerce Dataset</span>
        </div>
        <div className="space-y-1 text-muted-foreground">
          <p><span className="text-blue-500">SELECT</span> c.name, <span className="text-blue-500">SUM</span>(o.total_amount) <span className="text-blue-500">AS</span> revenue</p>
          <p><span className="text-blue-500">FROM</span> orders o</p>
          <p><span className="text-blue-500">JOIN</span> customers c <span className="text-blue-500">ON</span> o.customer_id = c.id</p>
          <p><span className="text-blue-500">GROUP BY</span> c.name</p>
          <p><span className="text-blue-500">HAVING</span> revenue &gt; <span className="text-green-500">10000</span></p>
          <p><span className="text-blue-500">ORDER BY</span> revenue <span className="text-blue-500">DESC</span>;</p>
        </div>
        <div className="mt-4 pt-4 border-t flex items-center gap-2">
          <span className="text-green-500 font-semibold">✓ Correct</span>
          <span className="text-muted-foreground">+25 pts · 5 rows matched</span>
        </div>
      </div>
    </section>
  )
}

export default Hero

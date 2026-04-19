import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconSql } from "@tabler/icons-react"

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <IconSql className="size-6 text-primary" />
        <span className="text-lg font-bold tracking-tight">Sqlo</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Pricing
        </Link>
        <Button asChild>
          <Link href="/login">Get Started Free</Link>
        </Button>
      </div>
    </nav>
  )
}

export default NavBar

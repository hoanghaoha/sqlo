import { IconSql } from "@tabler/icons-react"

const Footer = () => {
  return (
    <footer className="border-t px-6 py-10">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <IconSql className="size-5 text-primary" />
          <span className="font-bold">Sqlo</span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © 2026 Sqlo
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

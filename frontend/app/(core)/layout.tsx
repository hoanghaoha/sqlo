"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"


export default function CoreLayout({ children }: { children: React.ReactNode }) {
  const sizing = {
    "--sidebar-width": "calc(var(--spacing) * 58)",
    "--header-height": "calc(var(--spacing) * 12)",
  } as React.CSSProperties

  return (
    <div className="flex h-svh flex-col" style={sizing}>
      <SiteHeader />
      <TooltipProvider>
        <SidebarProvider className="flex-1 min-h-0" style={sizing}>
          <AppSidebar
            variant="sidebar"
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]"
          />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}

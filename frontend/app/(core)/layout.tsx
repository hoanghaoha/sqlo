"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"


export default function CoreLayout({ children }: { children: React.ReactNode }) {
  const sizing = {
    "--sidebar-width": "calc(var(--spacing) * 58)",
    "--header-height": "calc(var(--spacing) * 12)",
  } as React.CSSProperties

  return (
    <div className="flex h-svh flex-col" style={sizing}>
      <TooltipProvider>
        <SidebarProvider className="flex-1 min-h-0" style={sizing} defaultOpen={false}>
          <AppSidebar
            variant="sidebar"
          />
          <SidebarInset>
            {children}
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}

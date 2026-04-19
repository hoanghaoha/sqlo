"use client"

import { Separator } from "@/components/ui/separator"
import { IconSql } from "@tabler/icons-react"
import { AvatarDropdown } from "./avatar-dropdown"


export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex justify-between w-full pr-4">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <IconSql />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <AvatarDropdown />
      </div>
    </header>
  )
}

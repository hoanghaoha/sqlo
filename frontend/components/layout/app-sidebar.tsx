"use client"

import * as React from "react"

import { NavMain } from "@/components/layout/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { data } from "@/lib/const"
import NavUser from "./nav-user"
import { IconLayoutSidebar, IconSql } from "@tabler/icons-react"
import { Button } from "../ui/button"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader className="flex flex-row items-center justify-between">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center justify-between">
            {open ?
              <div className="flex items-center justify-between w-full">
                <Button variant={"ghost"}>
                  <IconSql />
                </Button>
                <Button variant={"ghost"} onClick={toggleSidebar}>
                  <IconLayoutSidebar />
                </Button>
              </div>
              :
              <SidebarMenuButton onClick={toggleSidebar}>
                <IconLayoutSidebar />
              </SidebarMenuButton>
            }
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Workspace" items={data.navWorkpsace} />
        <NavMain label="Community" items={data.navCommnity} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

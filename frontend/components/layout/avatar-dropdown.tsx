"use client"

import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { Separator } from "@/components/ui/separator"
import { signOut } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/user"
import { Badge } from "@/components/ui/badge"

export function AvatarDropdown() {
  const router = useRouter()
  const user = useAuth()
  const profile = useProfile()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={user.user?.user_metadata.avatar_url} alt="shadcn" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup className="px-3 py-1">
          <p className="text-sm">{user.user?.user_metadata.full_name}</p>
          <p className="text-sm">{user.user?.email}</p>
          <Badge>{profile?.plan}</Badge>
        </DropdownMenuGroup>
        <Separator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => {
            signOut()
            router.push("/")
          }}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client'

import { Discord, Google } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { signIn, signOut } from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserAvatar({ user }:{ user: any }) {
  return (
    <div className="flex items-center">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='sm' variant="outline" className="font-sans">
              <Avatar className="w-6 h-6 rounded-full" >
                <AvatarImage 
                  src={user.image || `https://i2.wp.com/ui-avatars.com/api/${user.name}/128/random?ssl=1`}
                  alt="avatar"
                />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
              <span className="ml-2 font-bold">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0">
            <Button onClick={() => signOut()} size='sm' variant="ghost" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/80">
              Logout
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <Button onClick={() => signIn("discord")} size='sm' className="font-sans bg-[#5865F2] text-white" variant="outline">
              <Discord />
            </Button>
            <Button onClick={() => signIn("google")} size='sm' className="font-sans bg-[#4285F4] text-white" variant="outline">
              <Google />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
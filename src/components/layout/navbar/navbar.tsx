'use client'

import { UserAvatar } from "./user"
import { NavLinks } from "./navlinks";
import { Flame } from "lucide-react"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/lib/types";
import { useSession } from "next-auth/react";

interface Props {
  aside?: {
    isAsideOpen: boolean;
    setIsAsideOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export function Navbar({ aside }: Props) {
  const { data } = useSession() 
  const user = data && data.user ? data.user as User : null
  return (
    <nav className="grid grid-cols-4 items-center justify-between w-full h-16 px-24 border-b z-50 bg-background">
      <div className="flex items-center justify-center">
        {aside && (
          <Button size='icon' variant='ghost' className="justify-center items-center flex" onClick={() => aside.setIsAsideOpen(!aside.isAsideOpen)}>
            <div className={`hamburger-icon${aside.isAsideOpen ? ' active' : ''}`}>
              <span className="bg-foreground" />
              <span className="bg-foreground" />
              <span className="bg-foreground" />  
            </div>
          </Button>
        )}
        <Button className="flex items-center" asChild variant='ghost'>
          <Link href='/'>
            <Flame className="text-red-500"/>
            <h1 className="font-bold text-xl">ignyte</h1>
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-start col-span-2">
        <NavLinks user={user} />
      </div>
      <div className="flex items-center justify-center">
        <UserAvatar user={user} />
      </div>
    </nav>
  )
}
'use client'

import { Button } from "@/components/ui/button"
import { mobileLinks } from "@/lib/nav"
import { User } from "@/lib/types"
import { useSession } from "next-auth/react"
import Link from "next/link"

export function MobileNav() {
  const { data } = useSession() 
  const user = data && data.user ? data.user as User : null
  return (
    <nav className="flex md:hidden justify-center w-full h-16 border-t fixed left-0 right-0 bottom-0 pb-4 z-50">
      <div className="grid grid-cols-4 items-center justify-center gap-6">
        {mobileLinks.map((link, i) => (
          <Button key={i} size='lg' variant='ghost' className={`justify-center items-center w-full h-16${link.auth && !user ? ' hidden' : ' flex'}`}>
            <Link href={link.url}>
              {link.icon}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
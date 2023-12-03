import { Spinner } from "@/components/icons"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import db from "@/lib/db"
import Link from "next/link"

export default async function Page() {
  const users = await db.user.findMany()
  
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {users.map((user, i) => (
          <Button key={i} size="sm" variant="outline" className="h-24 w-24 md:h-32 md:w-32">
            <Link href={`/u/${user.id}`} className="w-full h-full flex flex-col justify-center items-center">
              <Avatar>
                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                <AvatarFallback>
                  <Spinner />
                </AvatarFallback>
              </Avatar>
              {user.name}
            </Link>
          </Button>
        ))}
      </div>
    </main>
  )
}

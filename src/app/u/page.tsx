import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import db from "@/lib/db"

export default async function Page() {
  const data = await getServerSession()
  
  if (!data || !data.user || !data.user.email) {
    return redirect('/')
  } else {
    const user = await db.user.findUnique({
      where: {
        email: data.user.email
      }
    })

    if (!user) {
      return redirect('/')
    } else {
      return redirect(`/u/${user.id}`)
    }
  }
}

import ChatComponent from "@/components/chat/chat";
import db from "@/lib/db"
import { Chat } from "@/lib/types";

interface Props {
  params: {
    slug: string;
  }
}

export default async function Page({ params }: Props) {

  const chat: any = await db.chat.findUnique({
    where: {
      id: params.slug
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      },
      messages: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
      }
    }
  })

  return (
    <main className="flex flex-col justify-center items-center mt-10">
      <ChatComponent chat={chat} />
    </main>
  )
}
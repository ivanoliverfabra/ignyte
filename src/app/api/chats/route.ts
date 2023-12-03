import db from "@/lib/db"
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/types";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as User | null

  if (!session || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await db.chat.findMany({
    include: {
      users: true,
    },
    where: {
      users: {
        some: {
          id: user.id
        }
      }
    }
  })

  if (!data) {
    return Response.json({ error: "No chats found" }, { status: 404 })
  }

  return Response.json(data, { status: 200 });  
}

export async function POST(request: NextRequest) {
  const { title: name, users } = await request.json()
  const session = await getServerSession(authOptions)
  const user = session?.user as User | null

  if (!session || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!name) {
    return Response.json({ error: "No name provided" }, { status: 400 })
  }

  if (!users) {
    return Response.json({ error: "No users provided" }, { status: 400 })
  }

  if (users.length < 2) {
    return Response.json({ error: "You need at least 2 users to create a chat" }, { status: 400 })
  }

  if (!users.includes(user.id)) users.push(user.id)

  const data = await db.chat.create({
    data: {
      name,
      creatorId: user.id,
      users: {
        connect: users.map((id: string) => ({ id }))
      }
    },
    include: {
      users: true,
    },
  })

  if (!data) {
    return Response.json({ error: "No chats found" }, { status: 404 })
  }

  return Response.json(data, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as User | null

  if (!session || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const { id } = await request.json()

  try {
    const data = await db.chat.deleteMany({
      where: {
        AND: [
          { id },
          { creatorId: user.id },
        ]
      },
    })

    return Response.json(data.count, { status: 200 })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
import { NextRequest } from "next/server";
import db from "@/lib/db"

export async function GET(request: NextRequest, { params }:{ params: { slug: string }}) {
  const { slug } = params

  try {
    const messages = await db.message.findMany({
      where: {
        chatId: slug,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            followers: true,
            following: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return Response.json(messages, { status: 200 })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }:{ params: { slug: string }}) {
  const { slug } = params
  const { clientId, data } = await request.json()

  try {
    const message = await db.message.create({
      data: {
        chatId: slug,
        content: data,
        userId: clientId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            followers: true,
            following: true,
          },
        },
      }
    })

    return Response.json(message, { status: 200 })
  } catch (error: any) {
    return Response.json(null, { status: 500 })
  }
}
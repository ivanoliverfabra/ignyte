import { NextRequest } from 'next/server'
import db from "@/lib/db"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { User } from '@/lib/types'

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as User | null
  const body = await request.json()
  const { followingId } = body

  if (!session || !user) {
    return Response.json({ error: 'Unauthorized' }, {
      status: 401,
      statusText: 'Unauthorized'
    })
  }

  if (!followingId) {
    return Response.json({ error: 'No followingId provided' }, {
      status: 400,
      statusText: 'Bad Request'
    })
  }

  const followerId = user.id

    
  const isFollowing = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId
      }
    }
  })

  if (isFollowing) {
    try {
      await db.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId
          }
        }
      })
    } catch (error) {
      return Response.json({ message: 'error', error }, {
        status: 500,
        statusText: 'Internal Server Error'
      })
    }
  } else {
    try {
      await db.follow.create({
        data: {
          followerId,
          followingId
        }
      })
    } catch (error) {
      return Response.json({ message: 'error', error }, {
        status: 500,
        statusText: 'Internal Server Error'
      })
    }
  }

  return Response.json({ message: 'success' }, {
    status: 200,
    statusText: 'OK'
  })
}
import Ably from "ably/promises";
import { getServerSession } from "next-auth"
import db from "@/lib/db"
import { NextRequest } from "next/server";

export async function GET(request: NextRequest | Request) {
  const data = await getServerSession()
  let clientId: string = 'anonymous'
  
  if (data?.user?.email) {
    const userData = await db.user.findUnique({
      where: {
        email: data?.user?.email
      }
    })
    if (userData) clientId = userData.id
  }

  const client = new Ably.Realtime(process.env.ABLY_API_KEY as string);
  const tokenRequestData = await client.auth.requestToken({ clientId })
  return Response.json(tokenRequestData);
};
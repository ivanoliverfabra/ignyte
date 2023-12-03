import { NextRequest } from "next/server";
import db from "@/lib/db"

export async function GET(request: NextRequest) {
  const users = await db.user.findMany()
  
  if (!users) {
    return Response.json({ error: "No users found" }, { status: 404 })
  }

  return Response.json(users, { status: 200 });
}
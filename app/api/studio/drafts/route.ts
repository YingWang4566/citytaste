import { NextResponse } from "next/server"
import { OWNER_COOKIE } from "@/lib/auth"
import { getDrafts } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const ownerCookie = request.headers
    .get("cookie")
    ?.split(";")
    .find((part) => part.trim().startsWith(`${OWNER_COOKIE}=`))

  if (!ownerCookie?.includes(`${OWNER_COOKIE}=1`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const drafts = await getDrafts()
  return NextResponse.json({ data: drafts })
}

import { NextResponse } from "next/server"
import { OWNER_COOKIE } from "@/lib/auth"
import { publishDraft } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ownerCookie = request.headers
    .get("cookie")
    ?.split(";")
    .find((part) => part.trim().startsWith(`${OWNER_COOKIE}=`))

  if (!ownerCookie?.includes(`${OWNER_COOKIE}=1`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const place = await publishDraft(id)

  if (!place) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 })
  }

  return NextResponse.json({ data: place })
}

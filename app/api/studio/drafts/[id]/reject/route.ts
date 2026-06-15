import { NextResponse } from "next/server"
import { OWNER_COOKIE } from "@/lib/auth"
import { declineDraft } from "@/lib/data"

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
  const draft = await declineDraft(id)

  if (!draft) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 })
  }

  return NextResponse.json({ data: draft })
}

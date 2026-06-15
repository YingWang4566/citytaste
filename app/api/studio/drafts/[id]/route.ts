import { NextResponse } from "next/server"
import { OWNER_COOKIE } from "@/lib/auth"
import { patchDraft } from "@/lib/data"
import type { SubmissionDraft } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function PATCH(
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
  const body = (await request.json()) as SubmissionDraft
  const draft = await patchDraft(id, body)

  if (!draft) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 })
  }

  return NextResponse.json({ data: draft })
}

import { NextResponse } from "next/server"
import { OWNER_COOKIE } from "@/lib/auth"
import { parseSubmissionDraft } from "@/lib/parser"
import { saveDraft } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const ownerCookie = request.headers
    .get("cookie")
    ?.split(";")
    .find((part) => part.trim().startsWith(`${OWNER_COOKIE}=`))

  if (!ownerCookie?.includes(`${OWNER_COOKIE}=1`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as { rawText?: string; sourceUrl?: string }

  if (!body.rawText?.trim()) {
    return NextResponse.json({ error: "rawText is required" }, { status: 400 })
  }

  const result = parseSubmissionDraft(body.rawText, body.sourceUrl)
  const draft = await saveDraft(result.draft)

  return NextResponse.json({
    data: {
      draft,
      preview: result.preview,
    },
  })
}

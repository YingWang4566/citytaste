import { NextResponse } from "next/server"
import { getQuickSaves, saveQuickSave } from "@/lib/data"
import { normalizeCitySlug } from "@/lib/place-utils"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const quickSaves = await getQuickSaves(city ? normalizeCitySlug(city) : undefined)

  return NextResponse.json({ data: quickSaves })
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    city?: string
    sourceUrl?: string
    note?: string
    collectionId?: string
  }

  if (!body.city?.trim()) {
    return NextResponse.json({ error: "city is required" }, { status: 400 })
  }

  if (!body.sourceUrl?.trim()) {
    return NextResponse.json({ error: "sourceUrl is required" }, { status: 400 })
  }

  if (!body.note?.trim()) {
    return NextResponse.json({ error: "note is required" }, { status: 400 })
  }

  const quickSave = await saveQuickSave({
    city: body.city,
    sourceUrl: body.sourceUrl,
    note: body.note,
    collectionId: body.collectionId,
  })

  return NextResponse.json({ data: quickSave })
}

import { NextResponse } from "next/server"
import { createPlanCollection, getPublicPlaces } from "@/lib/data"
import { orderRoutePlaces } from "@/lib/planning"
import { normalizeCitySlug } from "@/lib/place-utils"
import type { MoodChip } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const body = (await request.json()) as {
    city?: string
    title?: string
    description?: string
    theme?: string
    note?: string
    placeIds?: string[]
    routeOrder?: string[]
    moodTags?: MoodChip[]
  }

  if (!body.city?.trim()) {
    return NextResponse.json({ error: "city is required" }, { status: 400 })
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 })
  }

  if (!body.description?.trim()) {
    return NextResponse.json({ error: "description is required" }, { status: 400 })
  }

  if (!body.placeIds?.length) {
    return NextResponse.json({ error: "placeIds is required" }, { status: 400 })
  }

  const city = normalizeCitySlug(body.city)
  const places = await getPublicPlaces(city)
  const selectedPlaces = body.placeIds
    .map((placeId) => places.find((place) => place.id === placeId))
    .filter((place): place is NonNullable<typeof place> => Boolean(place))

  if (!selectedPlaces.length) {
    return NextResponse.json({ error: "No valid places found" }, { status: 400 })
  }

  const orderedPlaceIds = body.routeOrder?.length
    ? [
        ...body.routeOrder.filter((placeId) =>
          selectedPlaces.some((place) => place.id === placeId),
        ),
        ...selectedPlaces
          .map((place) => place.id)
          .filter((placeId) => !body.routeOrder?.includes(placeId)),
      ].filter((placeId, index, array) => array.indexOf(placeId) === index)
    : orderRoutePlaces(selectedPlaces).map((place) => place.id)

  const collection = await createPlanCollection({
    city,
    title: body.title.trim(),
    description: body.description.trim(),
    theme: body.theme?.trim() || body.title.trim(),
    note: body.note?.trim(),
    placeIds: selectedPlaces.map((place) => place.id),
    routeOrder: orderedPlaceIds,
    moodTags: body.moodTags ?? [],
    kind: "personal_plan",
  })

  return NextResponse.json({ data: collection })
}

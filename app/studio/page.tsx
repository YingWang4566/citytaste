import { redirect } from "next/navigation"
import { normalizeCitySlug } from "@/lib/place-utils"

export default async function StudioIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>
}) {
  const params = await searchParams
  const selectedCity = normalizeCitySlug(params.city)

  redirect(`/studio/import?city=${selectedCity}`)
}

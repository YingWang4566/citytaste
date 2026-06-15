import { notFound } from "next/navigation"
import { getPlace, getPublicPlaces } from "@/lib/data"
import { localizeCityLabel, pickRelatedPlaces } from "@/lib/place-utils"
import { CityMapShell } from "@/components/city-map-shell"
import { PlaceCard } from "@/components/place-card"
import { PlaceCover } from "@/components/place-cover"
import { SourceLinkList } from "@/components/source-link-list"
import { StatusToggles } from "@/components/status-toggles"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const place = await getPlace(slug)

  if (!place) {
    notFound()
  }

  const places = await getPublicPlaces()
  const relatedPlaces = pickRelatedPlaces(places, place)

  return (
    <div className="page-shell py-10">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <div className="space-y-6">
          <div className="editorial-card rounded-[2rem] p-4 sm:p-5">
            <PlaceCover place={place} />
          </div>
          <div className="editorial-card rounded-[2rem] p-6 sm:p-8">
            <p className="eyebrow">{localizeCityLabel(place.city)} · {place.area}</p>
            <h1 className="mt-3 font-heading text-5xl">{place.name}</h1>
            <p className="mt-5 text-base leading-8 text-foreground/78">{place.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {place.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-6">
              <StatusToggles place={place} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="editorial-card rounded-[2rem] p-6">
            <p className="eyebrow">来源链接</p>
            <h2 className="mt-3 font-heading text-4xl">保留原始推荐语境</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              每个地点都保留来源链接，而不是把原始推荐压缩成一段脱离语境的描述。
            </p>
            <div className="mt-5">
              <SourceLinkList sourceLinks={place.sourceLinks} />
            </div>
          </div>

          <div className="editorial-card rounded-[2rem] p-3 sm:p-4">
            <div className="mb-3 px-3 pt-3">
              <p className="eyebrow">地图位置</p>
              <h2 className="mt-3 font-heading text-4xl">在地图上看位置</h2>
            </div>
            <CityMapShell
              places={[place]}
              city={place.city}
              selectedSlug={place.slug}
              className="h-[360px]"
            />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <p className="eyebrow">相关地点</p>
          <h2 className="mt-3 font-heading text-4xl">继续逛附近的相似氛围</h2>
        </div>
        <div className="grid gap-5 xl:grid-cols-3">
          {relatedPlaces.map((relatedPlace, index) => (
            <PlaceCard key={relatedPlace.id} place={relatedPlace} index={index} />
          ))}
        </div>
      </section>
    </div>
  )
}

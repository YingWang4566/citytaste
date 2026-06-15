import { CITY_META } from "@/lib/constants"
import { getPublicPlaces } from "@/lib/data"
import { isCityAvailable, normalizeCitySlug } from "@/lib/place-utils"
import { CitySwitcher } from "@/components/city-switcher"
import { ExploreScreen } from "@/components/explore-screen"

export const dynamic = "force-dynamic"

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>
}) {
  const params = await searchParams
  const selectedCity = normalizeCitySlug(params.city)
  const cityReady = isCityAvailable(selectedCity)
  const places = await getPublicPlaces(selectedCity)

  return (
    <div className="page-shell py-10">
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">当前城市</p>
          <h1 className="mt-3 font-heading text-5xl leading-none sm:text-6xl">
            探索{CITY_META[selectedCity].label}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-foreground/78">
            {cityReady
              ? `切换城市后，地图中心、地点列表、筛选区域和合集入口会一起更新。当前正在查看${CITY_META[selectedCity].label}，${CITY_META[selectedCity].subtitle}。`
              : `切换城市后，地图中心会先跟着更新。${CITY_META[selectedCity].label} 的公开地点内容还在准备中，所以这页会更偏向展示切换能力和后续入口，而不是强行塞一堆假数据。`}
          </p>
        </div>
        <CitySwitcher selectedCity={selectedCity} basePath="/explore" />
      </section>
      <ExploreScreen key={selectedCity} places={places} selectedCity={selectedCity} />
    </div>
  )
}

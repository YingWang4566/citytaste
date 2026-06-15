import { CITY_META } from "@/lib/constants"
import { getPublicPlaces } from "@/lib/data"
import { isCityAvailable, normalizeCitySlug } from "@/lib/place-utils"
import { CitySwitcher } from "@/components/city-switcher"
import { PlanBuilder } from "@/components/plan-builder"

export const dynamic = "force-dynamic"

export default async function NewPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>
}) {
  const params = await searchParams
  const selectedCity = normalizeCitySlug(params.city)
  const cityReady = isCityAvailable(selectedCity)
  const places = await getPublicPlaces(selectedCity)

  return (
    <div className="page-shell py-10 sm:py-12">
      <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl">
          <p className="eyebrow">自动路径规划</p>
          <h1 className="mt-4 font-heading text-5xl leading-none sm:text-6xl">
            新建今天计划
          </h1>
          <p className="mt-5 text-base leading-8 text-foreground/78 sm:text-lg">
            {cityReady
              ? `先选想去的地点，再让 CityTaste 按同一区域优先、白天项目在前、晚餐和夜生活在后的规则，自动排出一条更顺路的路线。当前正在创建 ${CITY_META[selectedCity].label} 的计划。`
              : `${CITY_META[selectedCity].label} 还没有足够的公开地点样本，所以这页会先以“可创建计划的入口”存在。你仍然可以切城市、理解流程，再去快速收藏里先沉淀灵感。`}
          </p>
        </div>
        <CitySwitcher selectedCity={selectedCity} basePath="/plans/new" />
      </section>

      <PlanBuilder key={`${selectedCity}-${places.length}`} selectedCity={selectedCity} places={places} />
    </div>
  )
}

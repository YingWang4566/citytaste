import Link from "next/link"
import {
  ArrowRightIcon,
  BookmarkPlusIcon,
  MapIcon,
  WaypointsIcon,
} from "lucide-react"
import { CITY_META } from "@/lib/constants"
import { getCollections, getFeaturedPlaces, getPublicPlaces } from "@/lib/data"
import {
  getCollectionPlaces,
  isCityAvailable,
  normalizeCitySlug,
} from "@/lib/place-utils"
import { CitySwitcher } from "@/components/city-switcher"
import { CollectionCard } from "@/components/collection-card"
import { HomeMapPreview } from "@/components/home-map-preview"
import { PlaceCard } from "@/components/place-card"
import { SceneBuilder } from "@/components/scene-builder"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>
}) {
  const params = await searchParams
  const selectedCity = normalizeCitySlug(params.city)
  const [places, featuredPlaces, collections] = await Promise.all([
    getPublicPlaces(selectedCity),
    getFeaturedPlaces(selectedCity),
    getCollections(selectedCity),
  ])
  const cityMeta = CITY_META[selectedCity]
  const cityReady = isCityAvailable(selectedCity)
  const heroAreas = featuredPlaces.length
    ? Array.from(new Set(featuredPlaces.map((place) => place.area))).slice(0, 4)
    : ["先快速收藏灵感", "再新建今天计划", "等待内容补齐"]

  return (
    <div className="page-shell py-10 sm:py-12">
      <section className="hero-glow editorial-card relative overflow-hidden rounded-[2.2rem] border-none px-6 py-8 sm:px-10 sm:py-12">
        <div className="absolute inset-y-0 right-0 hidden w-[34%] border-l border-white/45 bg-white/18 backdrop-blur md:block" />
        <div className="relative grid gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="max-w-3xl">
            <p className="eyebrow">互动式个人城市规划</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">切换城市</span>
              <CitySwitcher selectedCity={selectedCity} basePath="/" />
            </div>
            <h1 className="mt-5 font-heading text-5xl leading-none text-foreground sm:text-6xl lg:text-7xl">
              把散落收藏、
              <span className="block text-primary">今天的心情和真正能走的路线连起来。</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/78 sm:text-lg">
              {cityReady
                ? `CityTaste 不再只是展示地点，而是帮你把小红书、抖音、Google Maps、聊天记录和备忘录里的灵感，变成可以快速收藏、按场景生成、回到地图上继续使用的个人生活方式规划产品。当前示例城市为${cityMeta.label}，${cityMeta.subtitle}。`
                : `CityTaste 现在已经可以先把城市切到${cityMeta.label}，提前做灵感归档、快速收藏和计划准备。公开地点样本还在补齐中，所以这里更适合展示产品的“收进来 → 先规划 → 之后再接回地图”这一层。`}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs tracking-[0.18em] text-muted-foreground">
                {featuredPlaces.length ? "这座城市的入口" : "这座城市的下一步"}
              </span>
              {heroAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-white/55 bg-white/70 px-3 py-1.5 text-sm text-foreground/82 backdrop-blur"
                >
                  {area}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/plans/new?city=${selectedCity}`}
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-full")}
              >
                新建今天计划
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
              <Link
                href={`/quick-save?city=${selectedCity}`}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full")}
              >
                <BookmarkPlusIcon data-icon="inline-start" />
                快速收藏一条
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link
                href={`/explore?city=${selectedCity}`}
                className="inline-flex items-center gap-1 text-primary transition hover:text-primary/80"
              >
                <MapIcon className="size-4" />
                去探索地图
              </Link>
              <span>
                更完整的维护流程仍然保留在
                <Link
                  href={`/studio/import?city=${selectedCity}`}
                  className="mx-1 text-primary transition hover:text-primary/80"
                >
                  导入工作台
                </Link>
                中。
              </span>
            </div>
          </div>

          <div className="grid gap-4 self-end md:pr-2">
            <HeroStat label="当前城市" value={cityMeta.label} />
            <HeroStat label="开放状态" value={cityReady ? "已开放" : "准备中"} compact />
            <HeroStat label="地点数" value={places.length ? `${places.length}` : "待补充"} />
            <HeroStat label="合集数" value={collections.length ? `${collections.length}` : "待创建"} />
            <HeroStat label="产品闭环" value="收藏 → 生成 → 成线" compact />
          </div>
        </div>
      </section>

      <SceneBuilder
        key={`${selectedCity}-${places.length}-${collections.length}`}
        selectedCity={selectedCity}
        places={places}
        collections={collections}
      />

      <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="editorial-card rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">路线与场景</p>
              <h2 className="mt-3 font-heading text-4xl">按场景探索</h2>
            </div>
            <WaypointsIcon className="size-5 text-primary" />
          </div>
          <div className="mt-6 grid gap-4">
            {collections.length ? (
              collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  count={getCollectionPlaces(places, collection).length}
                />
              ))
            ) : (
              <div className="rounded-[1.55rem] border border-dashed border-border/70 bg-background/55 p-5">
                <h3 className="font-heading text-2xl text-foreground">这座城市还没有现成路线</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  先从快速收藏或“今天计划”开始会更合理。等你积累了几个点，路线合集自然就会长出来。
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/quick-save?city=${selectedCity}`}
                    className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
                  >
                    先快速收藏
                  </Link>
                  <Link
                    href={`/plans/new?city=${selectedCity}`}
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                  >
                    新建今天计划
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="editorial-card rounded-[2rem] p-3 sm:p-4">
          <HomeMapPreview
            key={`${selectedCity}-${featuredPlaces.length}`}
            city={selectedCity}
            places={featuredPlaces}
          />
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">精选地点</p>
            <h2 className="mt-3 font-heading text-4xl">这座城市实际逛起来是什么感觉</h2>
          </div>
          <Link
            href={`/explore?city=${selectedCity}`}
            className="text-sm font-medium text-primary transition hover:text-primary/80"
          >
            查看{cityMeta.label}全部地点
          </Link>
        </div>
        {featuredPlaces.length ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {featuredPlaces.map((place, index) => (
              <PlaceCard key={place.id} place={place} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.7rem] border border-dashed border-border/70 bg-card/75 p-6">
            <h3 className="font-heading text-3xl text-foreground">{cityMeta.label} 公开地点还在准备中</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              这个城市现在更适合展示“可切换、可归档、可提前做计划”的产品骨架，而不是假装已经有完整内容库。你可以先把链接存进来，等地点样本补齐后，这里会自然长成有图、有 pin、有路线感的探索页。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/quick-save?city=${selectedCity}`}
                className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
              >
                先保存一条灵感
              </Link>
              <Link
                href="/?city=shanghai"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
              >
                看上海完整样本
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        <WorkflowCard
          step="1. 收藏"
          title="快速收藏先收进来"
          description="先把一条链接和一句备注存下来，不要求立刻结构化，也不要求立刻变成公开地点。"
        />
        <WorkflowCard
          step="2. 生成"
          title="按心情拼出方案"
          description="场景生成器依据现有标签、分类、时间线索和城市上下文，生成一条更像真的会去走的路线。"
        />
        <WorkflowCard
          step="3. 成线"
          title="回到地图继续使用"
          description={`路线合集会把地点顺序、地图路径和来源链接一起保留下来，让${cityMeta.label}不只是“看起来好看”，而是可以继续被安排和复用。`}
        />
      </section>
    </div>
  )
}

function HeroStat({
  label,
  value,
  compact = false,
}: {
  label: string
  value: string
  compact?: boolean
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/55 bg-white/55 p-4 backdrop-blur">
      <p className="text-xs tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className={cn("mt-3 font-heading text-3xl text-foreground", compact && "text-2xl")}>
        {value}
      </p>
    </div>
  )
}

function WorkflowCard({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="editorial-card rounded-[1.8rem] p-6">
      <p className="eyebrow">{step}</p>
      <h3 className="mt-3 font-heading text-3xl">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  )
}

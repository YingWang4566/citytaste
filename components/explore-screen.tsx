"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  ArrowRightIcon,
  BookmarkPlusIcon,
  FilterIcon,
  MapIcon,
  SearchIcon,
  SparklesIcon,
  Rows3Icon,
} from "lucide-react"
import { CATEGORY_META, CITY_META, STATUS_META } from "@/lib/constants"
import { filterPlaces, isCityAvailable } from "@/lib/place-utils"
import type { Category, CitySlug, LocalVisitState, Place } from "@/lib/types"
import { useVisitState } from "@/components/visit-state-provider"
import { PlaceCard } from "@/components/place-card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const CityMap = dynamic(() => import("@/components/city-map"), { ssr: false })

const categories: Array<Category | "all"> = [
  "all",
  "food",
  "cafe",
  "bar",
  "shopping",
  "activity",
  "exhibition",
]

const statuses: Array<keyof LocalVisitState | "all"> = [
  "all",
  "want_to_go",
  "visited",
  "favorite",
]

export function ExploreScreen({
  places,
  selectedCity,
}: {
  places: Place[]
  selectedCity: CitySlug
}) {
  const { visitStateBySlug } = useVisitState()
  const [query, setQuery] = useState("")
  const [queryInput, setQueryInput] = useState("")
  const [isQueryComposing, setIsQueryComposing] = useState(false)
  const [category, setCategory] = useState<(typeof categories)[number]>("all")
  const [area, setArea] = useState<string | "all">("all")
  const [status, setStatus] = useState<(typeof statuses)[number]>("all")
  const [mobileView, setMobileView] = useState<"list" | "map">("list")
  const [isDesktopViewport, setIsDesktopViewport] = useState(false)
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(places[0]?.slug)
  const [hoveredSlug, setHoveredSlug] = useState<string | undefined>()
  const [selectionSource, setSelectionSource] = useState<"auto" | "list" | "map">("auto")
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const cityReady = isCityAvailable(selectedCity)

  const areaOptions = useMemo(
    () => ["all", ...Array.from(new Set(places.map((place) => place.area)))],
    [places],
  )
  const deferredQuery = useDeferredValue(query)
  const filteredPlaces = filterPlaces(
    places,
    {
      query: deferredQuery,
      category,
      area,
      status,
    },
    visitStateBySlug as Record<string, Record<string, boolean>>,
  )
  const effectiveSelectedSlug = filteredPlaces.some(
    (place) => place.slug === selectedSlug,
  )
    ? selectedSlug
    : filteredPlaces[0]?.slug
  const effectiveHoveredSlug = filteredPlaces.some((place) => place.slug === hoveredSlug)
    ? hoveredSlug
    : undefined
  const activeSlug = effectiveHoveredSlug ?? effectiveSelectedSlug
  const activePlace = filteredPlaces.find((place) => place.slug === activeSlug)

  useEffect(() => {
    if (selectionSource !== "map" || !effectiveSelectedSlug || mobileView === "map") {
      return
    }

    const node = cardRefs.current[effectiveSelectedSlug]
    node?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [effectiveSelectedSlug, mobileView, selectionSource])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const syncViewport = () => setIsDesktopViewport(mediaQuery.matches)

    syncViewport()
    mediaQuery.addEventListener("change", syncViewport)

    return () => mediaQuery.removeEventListener("change", syncViewport)
  }, [])

  function handleMapSelect(slug: string) {
    setHoveredSlug(undefined)
    setSelectionSource("map")
    setSelectedSlug(slug)
  }

  function handleCardSelect(slug: string) {
    setSelectionSource("list")
    setSelectedSlug(slug)
  }

  function resetFilters() {
    setHoveredSlug(undefined)
    setSelectionSource("auto")
    setQueryInput("")
    setIsQueryComposing(false)
    startTransition(() => {
      setQuery("")
      setCategory("all")
      setArea("all")
      setStatus("all")
    })
  }

  const hasActiveFilters =
    Boolean(queryInput.trim()) ||
    category !== "all" ||
    area !== "all" ||
    status !== "all"
  const isContentEmpty = !places.length
  const showCityEmptyState = isContentEmpty && !hasActiveFilters

  const mapPanel = (
    <div className="sticky top-32 flex flex-col gap-3">
      <div className="editorial-card rounded-[1.7rem] border border-border/70 bg-card/88 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.18em] text-muted-foreground">当前聚焦</p>
            <h3 className="mt-2 font-heading text-3xl text-foreground">
              {activePlace ? activePlace.name : `探索${CITY_META[selectedCity].label}`}
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {activePlace
                ? `${activePlace.area} · ${activePlace.address}`
                : `点击地图上的 pin 或右侧卡片，快速定位到${CITY_META[selectedCity].label}里更具体的地点。`}
            </p>
          </div>
          {activePlace ? (
            <Badge variant="secondary" className="w-fit rounded-full px-4 py-2 text-sm">
              {CATEGORY_META[activePlace.category].emoji}{" "}
              {CATEGORY_META[activePlace.category].label}
            </Badge>
          ) : null}
        </div>

        {activePlace ? (
          <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-7 text-foreground/78">
              {activePlace.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/place/${activePlace.slug}?city=${activePlace.city}`}
                className={cn(buttonVariants({ variant: "outline" }), "w-fit rounded-full")}
              >
                查看详情
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileView("list")}
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-fit rounded-full lg:hidden",
                )}
              >
                在列表里看卡片
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 border-t border-border/60 pt-4 text-sm leading-7 text-foreground/72">
            列表 hover 会高亮地图位置；地图点击会锁定一个地点，并同步到右侧卡片。
          </p>
        )}
      </div>

      <CityMap
        places={filteredPlaces}
        city={selectedCity}
        activeSlug={activeSlug}
        focusedSlug={effectiveSelectedSlug}
        onSelect={handleMapSelect}
        className="h-[520px]"
      />
    </div>
  )

  return (
    <div className="flex flex-col gap-8">
      <section className="editorial-card rounded-[2rem] px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">可搜索地图与结构化卡片</p>
              <h2 className="mt-3 font-heading text-4xl text-foreground sm:text-5xl">
                把保存夹里的灵感，变成今天真的可以去的路线。
              </h2>
            </div>
            <Badge variant="secondary" className="w-fit rounded-full px-4 py-2 text-sm">
              当前显示 {filteredPlaces.length} 个地点
            </Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={queryInput}
                onChange={(event) => {
                  const nextValue = event.target.value
                  setQueryInput(nextValue)

                  if (isQueryComposing) {
                    return
                  }

                  startTransition(() => setQuery(nextValue))
                }}
                onCompositionStart={() => setIsQueryComposing(true)}
                onCompositionEnd={(event) => {
                  const nextValue = event.currentTarget.value
                  setIsQueryComposing(false)
                  setQueryInput(nextValue)
                  startTransition(() => setQuery(nextValue))
                }}
                placeholder="搜索店名、区域、标签或氛围…"
                className="h-12 rounded-full border-border/70 bg-background/80 pl-11 text-sm"
              />
            </div>

            <div className="hidden items-center justify-end gap-2 lg:flex">
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                onClick={resetFilters}
                disabled={!hasActiveFilters}
              >
                <FilterIcon data-icon="inline-start" />
                清空筛选
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 lg:hidden">
              <button
                type="button"
                className={cn(
                  buttonVariants({
                    variant: mobileView === "list" ? "default" : "outline",
                  }),
                  "rounded-full",
                )}
                onClick={() => setMobileView("list")}
              >
                <Rows3Icon data-icon="inline-start" />
                列表
              </button>
              <button
                type="button"
                className={cn(
                  buttonVariants({
                    variant: mobileView === "map" ? "default" : "outline",
                  }),
                  "rounded-full",
                )}
                onClick={() => setMobileView("map")}
              >
                <MapIcon data-icon="inline-start" />
                地图
              </button>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                onClick={resetFilters}
              >
                <FilterIcon data-icon="inline-start" />
                重置
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <FilterRow
              label="分类"
              options={categories.map((item) => ({
                value: item,
                label:
                  item === "all"
                    ? "全部"
                    : `${CATEGORY_META[item].emoji} ${CATEGORY_META[item].label}`,
              }))}
              value={category}
              onChange={(value) => startTransition(() => setCategory(value as typeof category))}
            />
            <FilterRow
              label="区域"
              options={areaOptions.map((item) => ({
                value: item,
                label: item === "all" ? "全部区域" : item,
              }))}
              value={area}
              onChange={(value) => startTransition(() => setArea(value))}
            />
            <FilterRow
              label="状态"
              options={statuses.map((item) => ({
                value: item,
                label:
                  item === "all"
                    ? "全部状态"
                    : `${STATUS_META[item].emoji} ${STATUS_META[item].label}`,
              }))}
              value={status}
              onChange={(value) => startTransition(() => setStatus(value as typeof status))}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {isDesktopViewport ? <div className="hidden lg:block">{mapPanel}</div> : null}
        {!isDesktopViewport && mobileView === "map" ? (
          <div className="block lg:hidden">{mapPanel}</div>
        ) : null}

        <div className={cn("flex flex-col gap-5", mobileView === "list" ? "flex" : "hidden lg:flex")}>
          {filteredPlaces.length ? (
            filteredPlaces.map((place, index) => (
              <div
                key={place.id}
                ref={(node) => {
                  cardRefs.current[place.slug] = node
                }}
                onMouseEnter={() => setHoveredSlug(place.slug)}
                onMouseLeave={() =>
                  setHoveredSlug((current) => (current === place.slug ? undefined : current))
                }
                onFocusCapture={() => handleCardSelect(place.slug)}
                onClick={() => handleCardSelect(place.slug)}
                className={cn(
                  "rounded-[1.9rem] transition-transform duration-200",
                  place.slug === activeSlug && "lg:translate-x-1",
                )}
              >
                <PlaceCard
                  place={place}
                  index={index}
                  selected={place.slug === activeSlug}
                />
              </div>
            ))
          ) : showCityEmptyState ? (
            <Empty className="editorial-card rounded-[1.8rem] border-border/70 bg-card/80">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MapIcon />
                </EmptyMedia>
                <EmptyTitle>
                  {cityReady
                    ? `${CITY_META[selectedCity].label} 还没有公开地点`
                    : `${CITY_META[selectedCity].label} 内容准备中`}
                </EmptyTitle>
                <EmptyDescription>
                  {cityReady
                    ? "当前城市暂时还没有可展示的公开地点样本，可以先从快速收藏或今天计划开始。"
                    : "这座城市已经能切换、能归档、能准备计划，但公开地点和路线样本还没补齐。"}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row flex-wrap justify-center gap-3">
                <Link
                  href={`/quick-save?city=${selectedCity}`}
                  className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
                >
                  <BookmarkPlusIcon data-icon="inline-start" />
                  先快速收藏
                </Link>
                <Link
                  href={`/plans/new?city=${selectedCity}`}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                >
                  <SparklesIcon data-icon="inline-start" />
                  新建今天计划
                </Link>
                <Link
                  href="/?city=shanghai"
                  className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
                >
                  看完整样本
                </Link>
              </EmptyContent>
            </Empty>
          ) : (
            <Empty className="editorial-card rounded-[1.8rem] border-border/70 bg-card/80">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchIcon />
                </EmptyMedia>
                <EmptyTitle>没有找到匹配结果</EmptyTitle>
                <EmptyDescription>
                  试着减少筛选条件，或者换一个更生活化的关键词，比如“雨天”“约会”“工作”。
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </section>
    </div>
  )
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              buttonVariants({
                variant: option.value === value ? "default" : "outline",
                size: "sm",
              }),
              "rounded-full whitespace-nowrap",
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

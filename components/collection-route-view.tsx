"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeftIcon, RouteIcon } from "lucide-react"
import { CITY_META } from "@/lib/constants"
import {
  buildRouteSummary,
  getCollectionKindLabel,
  getRouteMomentLabel,
  getRouteStepLabel,
  MOOD_CHIP_META,
} from "@/lib/planning"
import type { Collection, Place } from "@/lib/types"
import { CityMapShell } from "@/components/city-map-shell"
import { PlaceCard } from "@/components/place-card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CollectionRouteView({
  collection,
  orderedPlaces,
}: {
  collection: Collection
  orderedPlaces: Place[]
}) {
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>()
  const routeSummary = useMemo(() => buildRouteSummary(orderedPlaces), [orderedPlaces])
  const activeSlug = selectedSlug ?? orderedPlaces[0]?.slug

  return (
    <div className="page-shell py-10 sm:py-12">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)]">
        <div className="editorial-card rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">
                {CITY_META[collection.city].label} · {getCollectionKindLabel(collection.kind)}
              </p>
              <h1 className="mt-3 font-heading text-5xl sm:text-6xl">{collection.title}</h1>
            </div>
            <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
              {orderedPlaces.length} 站
            </Badge>
          </div>

          <p className="mt-5 text-base leading-8 text-foreground/78">{collection.description}</p>

          {collection.moodTags?.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {collection.moodTags.map((mood) => (
                <Badge key={mood} variant="secondary" className="rounded-full bg-primary/8 text-primary">
                  {MOOD_CHIP_META[mood].label}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.35rem] border border-border/70 bg-secondary/55 p-4">
              <p className="text-xs tracking-[0.18em] text-muted-foreground">推荐路径</p>
              <p className="mt-3 text-sm leading-7 text-foreground/80">{routeSummary || "按这一条线走"}</p>
            </div>
            <div className="rounded-[1.35rem] border border-border/70 bg-secondary/55 p-4">
              <p className="text-xs tracking-[0.18em] text-muted-foreground">排序逻辑</p>
              <p className="mt-3 text-sm leading-7 text-foreground/80">同一区域优先，白天项目先走，晚餐和夜生活放后面。</p>
            </div>
            <div className="rounded-[1.35rem] border border-border/70 bg-secondary/55 p-4">
              <p className="text-xs tracking-[0.18em] text-muted-foreground">使用方式</p>
              <p className="mt-3 text-sm leading-7 text-foreground/80">先看地图顺序，再按 A → B → C 进入地点详情和来源链接。</p>
            </div>
          </div>

          {collection.note ? (
            <div className="mt-6 rounded-[1.4rem] border border-primary/20 bg-primary/5 p-5 text-sm leading-7 text-foreground/78">
              {collection.note}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/explore?city=${collection.city}`}
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
            >
              <ArrowLeftIcon data-icon="inline-start" />
              回到探索页
            </Link>
            <Link
              href={`/quick-save?city=${collection.city}`}
              className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
            >
              继续快速收藏
            </Link>
          </div>
        </div>

        <div className="editorial-card rounded-[2rem] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 px-2">
            <div>
              <p className="eyebrow">路线地图</p>
              <h2 className="mt-2 font-heading text-4xl">把这组地点像路线一样走进去</h2>
            </div>
            <RouteIcon className="size-5 text-primary" />
          </div>
          <CityMapShell
            places={orderedPlaces}
            city={collection.city}
            activeSlug={activeSlug}
            focusedSlug={selectedSlug}
            onSelect={setSelectedSlug}
            routeOrder={orderedPlaces.map((place) => place.slug)}
            showRoute
            className="h-[400px]"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {orderedPlaces.map((place, index) => {
              const active = place.slug === activeSlug

              return (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => setSelectedSlug(place.slug)}
                  className={cn(
                    "rounded-[1.3rem] border px-4 py-3 text-left transition",
                    active
                      ? "border-primary/30 bg-primary/8 shadow-sm"
                      : "border-border/70 bg-background/75 hover:border-primary/25 hover:bg-white/85",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/7 text-sm font-semibold text-primary">
                      {getRouteStepLabel(index)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{place.name}</p>
                        <span className="text-xs tracking-[0.16em] text-muted-foreground">
                          {getRouteMomentLabel(place, index, orderedPlaces.length)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{place.area}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 xl:grid-cols-2">
        {orderedPlaces.map((place, index) => (
          <div key={place.id} onClick={() => setSelectedSlug(place.slug)}>
            <PlaceCard place={place} index={index} selected={place.slug === activeSlug} />
          </div>
        ))}
      </section>
    </div>
  )
}

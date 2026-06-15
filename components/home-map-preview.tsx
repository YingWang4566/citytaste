"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRightIcon, MapPinIcon } from "lucide-react"
import { CATEGORY_META, CITY_META } from "@/lib/constants"
import type { CitySlug, Place } from "@/lib/types"
import { CityMapShell } from "@/components/city-map-shell"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HomeMapPreview({
  city,
  places,
}: {
  city: CitySlug
  places: Place[]
}) {
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(places[0]?.slug)

  const activePlace = useMemo(
    () => places.find((place) => place.slug === selectedSlug) ?? places[0],
    [places, selectedSlug],
  )

  if (!places.length) {
    return (
      <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="order-1 flex flex-col rounded-[1.6rem] border border-border/70 bg-white/70 p-4 shadow-[0_22px_80px_-48px_rgba(78,48,30,0.42)]">
          <p className="eyebrow">地图预览</p>
          <h2 className="mt-3 font-heading text-4xl">
            {CITY_META[city].label} 先开放切换，再慢慢补内容
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            这座城市的公开地点样本还没上架完，但你已经可以先切过来做灵感归档、准备今天计划，后续再把路线接回真实地图。
          </p>

          <div className="mt-5 space-y-2">
            {[
              "先把小红书 / 抖音链接快速存进来",
              "给灵感加一句自己的备注",
              "等地点样本补齐后再自动生成路线",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.2rem] border border-border/70 bg-background/72 px-4 py-3 text-sm text-foreground/80"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/quick-save?city=${city}`}
              className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
            >
              先快速收藏
            </Link>
            <Link
              href="/?city=shanghai"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
            >
              看完整样本
            </Link>
          </div>
        </div>

        <div className="order-2 relative">
          <CityMapShell places={[]} city={city} className="h-[460px]" />
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-[1.35rem] border border-white/60 bg-white/88 p-4 shadow-[0_20px_60px_-40px_rgba(72,48,28,0.35)] backdrop-blur">
            <p className="text-xs tracking-[0.18em] text-muted-foreground">当前状态</p>
            <p className="mt-2 text-sm leading-7 text-foreground/80">
              地图中心已经切换到 {CITY_META[city].label}。等这座城市补齐地点数据后，这里会显示代表地点、路线预览和可点击 pin。
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="order-1 flex flex-col rounded-[1.6rem] border border-border/70 bg-white/70 p-4 shadow-[0_22px_80px_-48px_rgba(78,48,30,0.42)]">
        <p className="eyebrow">地图预览</p>
        <h2 className="mt-3 font-heading text-4xl">切到{CITY_META[city].label}后，从哪里开始逛</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          城市切换不只改标题，也会一起切换地图中心、代表地点和第一组可逛入口。
        </p>

        {activePlace ? (
          <div className="mt-5 rounded-[1.45rem] border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.18em] text-muted-foreground">当前预览</p>
                <h3 className="mt-2 font-heading text-3xl text-foreground">
                  {activePlace.name}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="size-4" />
                  {activePlace.area} · {activePlace.address}
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {CATEGORY_META[activePlace.category].emoji}{" "}
                {CATEGORY_META[activePlace.category].label}
              </Badge>
            </div>
            <p className="mt-4 text-sm leading-7 text-foreground/78">
              {activePlace.summary}
            </p>
            <Link
              href={`/place/${activePlace.slug}?city=${activePlace.city}`}
              className={cn(buttonVariants({ variant: "outline" }), "mt-4 rounded-full")}
            >
              查看这个地点
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-2">
          {places.slice(0, 4).map((place) => {
            const active = place.slug === activePlace?.slug

            return (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelectedSlug(place.slug)}
                className={cn(
                  "rounded-[1.2rem] border px-4 py-3 text-left transition",
                  active
                    ? "border-primary/30 bg-primary/8 shadow-sm"
                    : "border-border/70 bg-background/70 hover:border-primary/25 hover:bg-white/85",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-foreground">{place.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{place.area}</div>
                  </div>
                  <span className="text-lg">{CATEGORY_META[place.category].emoji}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="order-2">
        <CityMapShell
          places={places}
          city={city}
          selectedSlug={activePlace?.slug}
          onSelect={setSelectedSlug}
          className="h-[460px]"
        />
      </div>
    </div>
  )
}

"use client"

import dynamic from "next/dynamic"
import type { CitySlug, Place } from "@/lib/types"

const CityMap = dynamic(() => import("@/components/city-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-[1.75rem] border border-border/70 bg-card/60 text-sm text-muted-foreground">
      地图加载中…
    </div>
  ),
})

export function CityMapShell({
  places,
  city,
  selectedSlug,
  activeSlug,
  focusedSlug,
  onSelect,
  className,
  routeOrder,
  showRoute = false,
}: {
  places: Place[]
  city?: CitySlug
  selectedSlug?: string
  activeSlug?: string
  focusedSlug?: string
  onSelect?: (slug: string) => void
  className?: string
  routeOrder?: string[]
  showRoute?: boolean
}) {
  return (
    <CityMap
      places={places}
      city={city}
      selectedSlug={selectedSlug}
      activeSlug={activeSlug}
      focusedSlug={focusedSlug}
      onSelect={onSelect}
      className={className}
      routeOrder={routeOrder}
      showRoute={showRoute}
    />
  )
}

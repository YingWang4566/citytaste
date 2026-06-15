"use client"

import { HeartIcon, MapPinnedIcon, CheckCheckIcon } from "lucide-react"
import { useVisitState } from "@/components/visit-state-provider"
import { STATUS_META } from "@/lib/constants"
import type { Place } from "@/lib/types"
import { Button } from "@/components/ui/button"

const statusIcons = {
  want_to_go: MapPinnedIcon,
  visited: CheckCheckIcon,
  favorite: HeartIcon,
}

export function StatusToggles({
  place,
  compact = false,
}: {
  place: Place
  compact?: boolean
}) {
  const { getVisitState, toggleVisitState } = useVisitState()
  const state = getVisitState(place.slug, place.statusDefault)

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((key) => {
        const Icon = statusIcons[key]
        const active = state[key]

        return (
          <Button
            key={key}
            variant={active ? "default" : "outline"}
            size={compact ? "sm" : "default"}
            className="rounded-full"
            onClick={() => toggleVisitState(place.slug, key, place.statusDefault)}
          >
            <Icon data-icon="inline-start" />
            {STATUS_META[key].label}
          </Button>
        )
      })}
    </div>
  )
}

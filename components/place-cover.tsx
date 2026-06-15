/* eslint-disable @next/next/no-img-element */

import type { Place } from "@/lib/types"
import { getPlaceGradient } from "@/lib/place-utils"
import { CATEGORY_META } from "@/lib/constants"

export function PlaceCover({ place, compact = false }: { place: Place; compact?: boolean }) {
  const meta = CATEGORY_META[place.category]
  const coverNote = place.tags.slice(0, 2).join(" · ") || place.summary

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[1.35rem] border border-white/50",
        compact ? "h-44" : "h-72",
        place.coverImage ? "bg-stone-200" : getPlaceGradient(place),
      ].join(" ")}
    >
      {place.coverImage ? (
        <>
          <img
            src={place.coverImage}
            alt={place.name}
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover saturate-[0.82] contrast-[0.94]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,238,0.18)_0%,rgba(82,49,28,0.12)_48%,rgba(45,29,18,0.55)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.34)_0,transparent_32%)]" />
        </>
      ) : (
        <div className="cover-sheen absolute inset-0" />
      )}

      <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur">
        {meta.emoji} {meta.label}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="rounded-[1.15rem] border border-white/60 bg-white/60 p-4 shadow-sm backdrop-blur-md">
          <p className="text-xs tracking-[0.18em] text-foreground/58">{place.area}</p>
          <p className="mt-2 font-heading text-2xl leading-none text-foreground">
            {place.coverImage && !compact ? place.name : coverNote}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/75">
            {place.coverImage ? place.summary : place.name}
          </p>
        </div>
      </div>
    </div>
  )
}

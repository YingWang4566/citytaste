"use client"

import Link from "next/link"
import { ArrowRightIcon, MapPinIcon } from "lucide-react"
import { motion } from "framer-motion"
import { CATEGORY_META } from "@/lib/constants"
import { formatPublishDate, humanizePrice } from "@/lib/place-utils"
import type { Place } from "@/lib/types"
import { PlaceCover } from "@/components/place-cover"
import { SourceLinkList } from "@/components/source-link-list"
import { StatusToggles } from "@/components/status-toggles"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function PlaceCard({
  place,
  index = 0,
  selected = false,
}: {
  place: Place
  index?: number
  selected?: boolean
}) {
  const meta = CATEGORY_META[place.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.38 }}
      whileHover={{ y: -3 }}
    >
      <Card
        className={cn(
          "editorial-card group overflow-hidden rounded-[1.9rem] border bg-card/92 shadow-[0_16px_70px_-38px_rgba(75,47,29,0.5)] transition-all duration-200 hover:shadow-[0_26px_90px_-46px_rgba(86,54,31,0.56)]",
          selected
            ? "border-primary/40 bg-white/95 shadow-[0_24px_90px_-42px_rgba(130,76,28,0.58)]"
            : "border-transparent",
        )}
      >
        <CardHeader className="gap-4 p-4">
          <PlaceCover place={place} compact />
          <div className="flex items-start justify-between gap-4">
            <div>
              {selected ? (
                <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-primary">
                  <span className="size-2 rounded-full bg-primary" />
                  当前聚焦
                </div>
              ) : null}
              <CardTitle className="font-heading text-2xl leading-tight">{place.name}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="size-4" />
                {place.area} · {place.address}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1.5">
              {meta.emoji} {humanizePrice(place.priceLevel)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-4 pb-4">
          <p className="text-sm leading-7 text-foreground/78">{place.description}</p>

          <div className="flex flex-wrap gap-2">
            {place.tags.slice(0, 6).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full bg-secondary/70 text-foreground/75"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <SourceLinkList sourceLinks={place.sourceLinks} compact />
          <StatusToggles place={place} compact />
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/60 px-4 py-4">
          <span className="text-xs tracking-[0.2em] text-muted-foreground">
            发布于 {formatPublishDate(place.publishedAt)}
          </span>
          <Link
            href={`/place/${place.slug}?city=${place.city}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
          >
            查看地点
            <ArrowRightIcon className="size-4" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

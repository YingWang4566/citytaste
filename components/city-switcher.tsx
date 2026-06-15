"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { GlobeIcon, SearchIcon } from "lucide-react"
import { CITY_GROUPS, CITY_META } from "@/lib/constants"
import type { CitySlug } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function CitySwitcher({
  selectedCity,
  basePath,
  compact = false,
  className,
}: {
  selectedCity: CitySlug
  basePath: string
  compact?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement | null>(null)
  const selectedMeta = CITY_META[selectedCity]

  function closeSwitcher() {
    setOpen(false)
    setQuery("")
  }

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeSwitcher()
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSwitcher()
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return CITY_GROUPS.map((group) => ({
      ...group,
      cities: group.cities.filter((city) => {
        const meta = CITY_META[city]
        if (!normalizedQuery) return true

        return [city, meta.label, ...meta.aliases].some((token) =>
          token.toLowerCase().includes(normalizedQuery),
        )
      }),
    })).filter((group) => group.cities.length)
  }, [query])

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() =>
          setOpen((current) => {
            if (current) {
              setQuery("")
            }

            return !current
          })
        }
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/85 text-left shadow-sm transition hover:border-primary/25 hover:bg-card",
          compact ? "px-3 py-2" : "px-4 py-3",
          open && "border-primary/30 bg-card",
        )}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <GlobeIcon className="size-4" />
        </span>
        <span className="min-w-0">
          <span className={cn("block font-medium text-foreground", compact ? "text-sm" : "text-base")}>
            探索：{selectedMeta.label}
          </span>
          {!compact ? (
            <span className="block text-xs text-muted-foreground">
              {selectedMeta.available ? "已开放城市" : "城市切换已开放，内容正在准备中"}
            </span>
          ) : null}
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(92vw,24rem)] rounded-[1.6rem] border border-border/70 bg-card/96 p-3 shadow-[0_28px_90px_-42px_rgba(72,48,28,0.45)] backdrop-blur-xl">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索城市，比如东京 / Seoul / 巴黎"
              className="h-11 rounded-full border-border/70 bg-background/80 pl-11"
            />
          </div>

          <div className="mt-3 max-h-[26rem] space-y-3 overflow-y-auto pr-1">
            {filteredGroups.map((group) => (
              <div key={group.key} className="rounded-[1.25rem] border border-border/60 bg-background/58 p-3">
                <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                  {group.label}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {group.cities.map((city) => {
                    const meta = CITY_META[city]
                    const active = city === selectedCity

                    return (
                      <Link
                        key={city}
                        href={`${basePath}?city=${city}`}
                        onClick={closeSwitcher}
                        className={cn(
                          "flex items-center justify-between rounded-[1rem] border px-3 py-2.5 transition",
                          active
                            ? "border-primary/30 bg-primary/8"
                            : "border-border/60 bg-card/72 hover:border-primary/25 hover:bg-card",
                        )}
                      >
                        <span>
                          <span className="block text-sm font-medium text-foreground">
                            {meta.label}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {meta.subtitle}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[0.68rem] tracking-[0.16em]",
                            meta.available
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-muted-foreground",
                          )}
                        >
                          {meta.available ? "已开放" : "准备中"}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            {!filteredGroups.length ? (
              <div className="rounded-[1.25rem] border border-dashed border-border/70 bg-background/45 p-4 text-sm leading-7 text-muted-foreground">
                没有找到匹配城市。可以试试输入中文名、英文名，或者先切到上海 / 广州看看完整样本。
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

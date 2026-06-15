"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  BookmarkPlusIcon,
  CompassIcon,
  LogInIcon,
  LogOutIcon,
  SparklesIcon,
} from "lucide-react"
import { CITY_META } from "@/lib/constants"
import { normalizeCitySlug } from "@/lib/place-utils"
import { buttonVariants, Button } from "@/components/ui/button"
import { CitySwitcher } from "@/components/city-switcher"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "首页", preserveCity: true },
  { href: "/explore", label: "探索地图", preserveCity: true },
  { href: "/plans/new", label: "今天计划", preserveCity: true },
  { href: "/quick-save", label: "快速收藏", preserveCity: true },
  { href: "/case-study", label: "项目案例", preserveCity: true },
]

export function SiteHeaderClient({ isOwner }: { isOwner: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCity = normalizeCitySlug(searchParams.get("city"))
  const cityBasePath = pathname === "/" || pathname === "/explore" ? pathname : "/explore"

  function withCity(href: string, preserveCity: boolean) {
    if (!preserveCity) return href
    return `${href}?city=${currentCity}`
  }

  const importHref = `/studio/import?city=${currentCity}`
  const planHref = `/plans/new?city=${currentCity}`
  const quickSaveHref = `/quick-save?city=${currentCity}`
  const loginHref = `/studio/login?city=${currentCity}&from=${encodeURIComponent(importHref)}`

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="page-shell flex flex-col gap-3 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={withCity("/", true)}
              className="flex items-center gap-3 rounded-full border border-border/70 bg-card/90 px-4 py-2 shadow-sm transition hover:border-primary/30 hover:bg-card"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CompassIcon />
              </span>
              <div className="flex flex-col">
                <span className="font-heading text-lg leading-none">CityTaste</span>
                <span className="text-xs tracking-[0.22em] text-muted-foreground">
                  {CITY_META[currentCity].label} · {CITY_META[currentCity].available ? "个人生活方式路线" : "灵感归档准备中"}
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={withCity(item.href, item.preserveCity)}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto md:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={withCity(item.href, item.preserveCity)}
                  className="rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href={quickSaveHref}
                className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
              >
                <BookmarkPlusIcon data-icon="inline-start" />
                快速收藏
              </Link>
              <Link
                href={planHref}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
              >
                <SparklesIcon data-icon="inline-start" />
                今天计划
              </Link>
              <Link
                href={importHref}
                className={cn(buttonVariants({ variant: "ghost" }), "hidden rounded-full xl:inline-flex")}
              >
                <SparklesIcon data-icon="inline-start" />
                导入工作台
              </Link>
              {isOwner ? (
                <form action="/api/studio/logout" method="post">
                  <input type="hidden" name="redirectTo" value={`/?city=${currentCity}`} />
                  <Button variant="ghost" className="rounded-full">
                    <LogOutIcon data-icon="inline-start" />
                    退出
                  </Button>
                </form>
              ) : (
                <Link
                  href={loginHref}
                  className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
                >
                  <LogInIcon data-icon="inline-start" />
                  管理登录
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground">当前城市</p>
          </div>
          <CitySwitcher selectedCity={currentCity} basePath={cityBasePath} compact />
        </div>
      </div>
    </header>
  )
}

"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BookmarkPlusIcon, SparklesIcon } from "lucide-react"
import { CITY_META } from "@/lib/constants"
import { normalizeCitySlug } from "@/lib/place-utils"

export function SiteFooter() {
  const searchParams = useSearchParams()
  const currentCity = normalizeCitySlug(searchParams.get("city"))
  const importHref = `/studio/import?city=${currentCity}`
  const planHref = `/plans/new?city=${currentCity}`
  const quickSaveHref = `/quick-save?city=${currentCity}`

  return (
    <footer className="border-t border-border/70 bg-card/50">
      <div className="page-shell flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">从城市指南升级为可规划产品</p>
          <h2 className="mt-3 font-heading text-3xl text-foreground">
            把碎片化的生活收藏，整理成今天真的可以去走的路线。
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            CityTaste 现在不只展示地点，还在演示一套更真实的闭环：先快速收藏，再按心情生成方案，最后回到地图和来源链接继续使用。
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link href={`/explore?city=${currentCity}`} className="transition hover:text-foreground">
            探索全部地点
          </Link>
          <Link href={planHref} className="transition hover:text-foreground">
            新建今天计划
          </Link>
          <Link href={quickSaveHref} className="transition hover:text-foreground">
            打开快速收藏
          </Link>
          <Link href={`/case-study?city=${currentCity}`} className="transition hover:text-foreground">
            查看项目案例
          </Link>
          <Link href={importHref} className="transition hover:text-foreground">
            打开导入工作台
          </Link>
          <p className="mt-2 flex items-center gap-2 text-xs tracking-[0.22em]">
            <BookmarkPlusIcon className="size-3.5" />
            <SparklesIcon className="size-3.5" />
            {CITY_META[currentCity].label} 已支持城市切换；当前公开样本覆盖上海和广州
          </p>
        </div>
      </div>
    </footer>
  )
}

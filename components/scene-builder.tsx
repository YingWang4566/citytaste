"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowRightIcon,
  CompassIcon,
  SparklesIcon,
  WandSparklesIcon,
} from "lucide-react"
import { toast } from "sonner"
import { CITY_META } from "@/lib/constants"
import {
  buildRouteSummary,
  buildScenePlan,
  getCollectionKindLabel,
  getRouteMomentLabel,
  getRouteStepLabel,
  MOOD_CHIP_META,
} from "@/lib/planning"
import type { CitySlug, Collection, MoodChip, Place } from "@/lib/types"
import { CityMapShell } from "@/components/city-map-shell"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const DEFAULT_PROMPTS: Partial<Record<CitySlug, string>> = {
  shanghai: "今天有点无聊，想在上海安排一条轻松一点的城市漫走。",
  guangzhou: "今天想在广州轻松逛逛，最好适合一个人慢慢走。",
}

const QUICK_PROMPTS: Partial<Record<CitySlug, string[]>> = {
  shanghai: [
    "下雨天想找安静一点、适合坐坐的路线",
    "晚上约会，想从看展一路走到夜景收尾",
    "想找几家适合一个人慢慢逛的店和咖啡馆",
  ],
  guangzhou: [
    "想安排一条适合朋友一起边吃边走的广州路线",
    "下雨天想找可停留、出片一点的室内路线",
    "想一个人轻松散步，顺路吃点东西",
  ],
}

function getDefaultPrompt(city: CitySlug) {
  return (
    DEFAULT_PROMPTS[city] ??
    `今天想在${CITY_META[city].label}安排一条轻松一点、适合慢慢走的路线。`
  )
}

function getQuickPrompts(city: CitySlug) {
  return (
    QUICK_PROMPTS[city] ?? [
      `想在${CITY_META[city].label}安排一条适合朋友慢慢逛的路线`,
      `下雨天想在${CITY_META[city].label}找几处能坐下来停留的地方`,
      "想找一条适合一个人轻松漫走的半日路线",
    ]
  )
}

export function SceneBuilder({
  selectedCity,
  places,
  collections,
}: {
  selectedCity: CitySlug
  places: Place[]
  collections: Collection[]
}) {
  const [prompt, setPrompt] = useState(() => getDefaultPrompt(selectedCity))
  const [selectedMoods, setSelectedMoods] = useState<MoodChip[]>([])
  const [isComposing, setIsComposing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedSlug, setSavedSlug] = useState<string | null>(null)
  const [result, setResult] = useState(() =>
    buildScenePlan({
      city: selectedCity,
      prompt: getDefaultPrompt(selectedCity),
      selectedMoods: [],
      places,
      collections,
    }),
  )

  const cityQuickPrompts = useMemo(() => getQuickPrompts(selectedCity), [selectedCity])
  const matchedCollection = useMemo(
    () => collections.find((collection) => collection.id === result.matchedCollectionId) ?? null,
    [collections, result.matchedCollectionId],
  )
  const routeSummary = useMemo(() => buildRouteSummary(result.places), [result.places])

  function toggleMood(mood: MoodChip) {
    setSelectedMoods((current) =>
      current.includes(mood) ? current.filter((item) => item !== mood) : [...current, mood],
    )
  }

  function generateScene(nextPrompt = prompt) {
    setSavedSlug(null)
    setResult(
      buildScenePlan({
        city: selectedCity,
        prompt: nextPrompt,
        selectedMoods,
        places,
        collections,
      }),
    )
  }

  async function savePlan() {
    setSaving(true)

    try {
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: selectedCity,
          title: result.title,
          description: result.description,
          theme: result.title,
          note: `由场景生成器依据用户输入“${result.prompt}”生成。`,
          placeIds: result.places.map((place) => place.id),
          routeOrder: result.routeOrder,
          moodTags: result.moods,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || "保存路线失败")
      }

      const payload = (await response.json()) as { data: Collection }
      setSavedSlug(payload.data.slug)
      toast.success("已保存成一条新的路线合集。")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存路线失败")
    } finally {
      setSaving(false)
    }
  }

  if (!places.length) {
    return (
      <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        <div className="editorial-card rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">场景生成器</p>
              <h2 className="mt-3 font-heading text-4xl sm:text-5xl">先把这座城市的灵感收进来</h2>
            </div>
            <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
              内容准备中
            </Badge>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {CITY_META[selectedCity].label}
            还没有足够的公开地点样本，所以现在不适合假装生成一条“看起来像真的”路线。更诚实的 MVP 是先让你切城市、快速收藏、沉淀灵感，等地点样本补齐后再把它接回 Scene Builder。
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-border/70 bg-background/72 p-5">
            <p className="text-sm font-medium text-foreground">这时候最适合做的两步</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[1.15rem] border border-border/70 bg-card/75 px-4 py-3 text-sm leading-7 text-foreground/80">
                1. 从小红书、抖音或 Google Maps 把链接先分享进来，写一句为什么想去。
              </div>
              <div className="rounded-[1.15rem] border border-border/70 bg-card/75 px-4 py-3 text-sm leading-7 text-foreground/80">
                2. 等城市内容补齐后，再把这些灵感接成场景路线或今天计划。
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/quick-save?city=${selectedCity}`}
              className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
            >
              先快速收藏一条
            </Link>
            <Link
              href="/?city=shanghai"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
            >
              看完整样本
            </Link>
          </div>
        </div>

        <div className="editorial-card rounded-[2rem] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 px-2">
            <div>
              <p className="eyebrow">城市地图</p>
              <h2 className="mt-2 font-heading text-4xl">先把城市切过去，内容会慢慢长出来</h2>
            </div>
            <CompassIcon className="size-5 text-primary" />
          </div>
          <CityMapShell places={[]} city={selectedCity} className="h-[520px]" />
          <div className="mt-4 rounded-[1.35rem] border border-border/70 bg-background/72 p-4 text-sm leading-7 text-foreground/80">
            {CITY_META[selectedCity].label}
            的地图中心已经就位。等后续补齐地点样本后，这里会接上按心情生成的点位顺序、路线连线和可跳转详情。
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
      <div className="editorial-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">场景生成器</p>
            <h2 className="mt-3 font-heading text-4xl sm:text-5xl">把今天的心情直接翻成路线</h2>
          </div>
          <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
            规则匹配 MVP
          </Badge>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          先不用真正的 LLM。你可以写一句现在的状态，或者直接点心情标签，CityTaste 会根据现有地点的标签、氛围、分类、城市和时间线索，拼出一条更像真的会去走的路线。
        </p>

        <div className="mt-6 rounded-[1.6rem] border border-border/70 bg-background/75 p-4 sm:p-5">
          <label htmlFor="scene-prompt" className="text-sm font-medium text-foreground">
            今天想怎么逛
          </label>
          <Textarea
            id="scene-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(event) => {
              setIsComposing(false)
              setPrompt(event.currentTarget.value)
            }}
            placeholder="比如：今天有点无聊，想安排一条轻松一点、适合一个人慢慢走的城市漫走。"
            className="mt-3 min-h-28 rounded-[1.25rem] border-border/70 bg-card/70"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.entries(MOOD_CHIP_META) as Array<[MoodChip, (typeof MOOD_CHIP_META)[MoodChip]]>).map(
              ([mood, meta]) => {
                const active = selectedMoods.includes(mood)

                return (
                  <button
                    key={mood}
                    type="button"
                    className={cn(
                      buttonVariants({ variant: active ? "default" : "outline", size: "sm" }),
                      "rounded-full",
                    )}
                    onClick={() => toggleMood(mood)}
                  >
                    {meta.label}
                  </button>
                )
              },
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {cityQuickPrompts.map((quickPrompt) => (
            <button
              key={quickPrompt}
              type="button"
              className="rounded-full border border-border/70 bg-background/80 px-3 py-2 text-left text-sm text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
              onClick={() => {
                setPrompt(quickPrompt)
                generateScene(quickPrompt)
              }}
            >
              {quickPrompt}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => generateScene()}
            disabled={isComposing}
            className="rounded-full"
          >
            <WandSparklesIcon data-icon="inline-start" />
            {isComposing ? "正在输入中文..." : "生成今日方案"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={savePlan}
            disabled={saving || !result.places.length}
            className="rounded-full"
          >
            <SparklesIcon data-icon="inline-start" />
            {saving ? "保存中..." : "保存为路线合集"}
          </Button>
          <Link
            href={`/quick-save?city=${selectedCity}`}
            className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
          >
            先快速收藏一条
          </Link>
        </div>

        {savedSlug ? (
          <div className="mt-4 rounded-[1.35rem] border border-primary/20 bg-primary/5 p-4 text-sm text-foreground/80">
            已经保存成新的路线合集。
            <Link
              href={`/collections/${savedSlug}?city=${selectedCity}`}
              className="ml-2 inline-flex items-center gap-1 font-medium text-primary transition hover:text-primary/80"
            >
              立即查看
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        ) : null}
      </div>

      <div className="editorial-card rounded-[2rem] p-4 sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
          <div className="order-2 flex flex-col rounded-[1.6rem] border border-border/70 bg-white/72 p-4 shadow-[0_20px_80px_-52px_rgba(72,48,28,0.42)] xl:order-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">生成结果</p>
                <h3 className="mt-2 font-heading text-3xl text-foreground">{result.title}</h3>
              </div>
              <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
                {CITY_META[selectedCity].label}
              </Badge>
            </div>

            <p className="mt-3 text-sm leading-7 text-foreground/78">{result.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {result.moods.map((mood) => (
                <Badge key={mood} variant="secondary" className="rounded-full bg-primary/8 text-primary">
                  {MOOD_CHIP_META[mood].label}
                </Badge>
              ))}
            </div>

            <div className="mt-5 rounded-[1.35rem] border border-border/70 bg-background/78 p-4 text-sm leading-7 text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <CompassIcon className="size-4 text-primary" />
                推荐路径：{routeSummary}
              </div>
              {matchedCollection ? (
                <p className="mt-2">
                  最接近的现有{getCollectionKindLabel(matchedCollection.kind)}是
                  <Link
                    href={`/collections/${matchedCollection.slug}?city=${matchedCollection.city}`}
                    className="mx-1 font-medium text-primary transition hover:text-primary/80"
                  >
                    {matchedCollection.title}
                  </Link>
                  ，可以把它当成现成参考。
                </p>
              ) : (
                <p className="mt-2">这一条会优先把同一区域的点连在一起，再让白天项目先走、晚上的点位放到后面。</p>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {result.places.map((place, index) => (
                <div
                  key={place.id}
                  className="rounded-[1.25rem] border border-border/70 bg-card/75 px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/7 text-sm font-semibold text-primary">
                      {getRouteStepLabel(index)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{place.name}</p>
                        <span className="text-xs tracking-[0.16em] text-muted-foreground">
                          {getRouteMomentLabel(place, index, result.places.length)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {place.area} · {place.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 xl:order-2">
            <CityMapShell
              places={result.places}
              city={selectedCity}
              activeSlug={result.places[0]?.slug}
              routeOrder={result.places.map((place) => place.slug)}
              showRoute
              className="h-[520px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckIcon,
  RouteIcon,
  SearchIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"
import { toast } from "sonner"
import { CITY_META, READY_CITY_OPTIONS } from "@/lib/constants"
import {
  buildRouteSummary,
  getRouteMomentLabel,
  getRouteStepLabel,
  MOOD_CHIP_META,
  orderRoutePlaces,
} from "@/lib/planning"
import { CityMapShell } from "@/components/city-map-shell"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { CitySlug, MoodChip, Place } from "@/lib/types"

export function PlanBuilder({
  selectedCity,
  places,
}: {
  selectedCity: CitySlug
  places: Place[]
}) {
  const router = useRouter()
  const [title, setTitle] = useState(`今天和朋友去${CITY_META[selectedCity].label}`)
  const [description, setDescription] = useState("")
  const [note, setNote] = useState("")
  const [query, setQuery] = useState("")
  const [queryInput, setQueryInput] = useState("")
  const [isQueryComposing, setIsQueryComposing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [moods, setMoods] = useState<MoodChip[]>(["friends"])
  const [pending, setPending] = useState(false)

  const selectedPlaces = useMemo(
    () => selectedIds.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place)),
    [places, selectedIds],
  )
  const orderedPlaces = useMemo(() => orderRoutePlaces(selectedPlaces), [selectedPlaces])
  const routeSummary = useMemo(() => buildRouteSummary(orderedPlaces), [orderedPlaces])
  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return places.filter((place) => {
      if (!normalizedQuery) return true

      return [
        place.name,
        place.area,
        place.summary,
        place.tags.join(" "),
        place.vibes.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [places, query])

  const resolvedDescription = description.trim() || buildDefaultDescription(title, orderedPlaces)

  function togglePlace(placeId: string) {
    setSelectedIds((current) =>
      current.includes(placeId)
        ? current.filter((id) => id !== placeId)
        : [...current, placeId],
    )
  }

  function toggleMood(mood: MoodChip) {
    setMoods((current) =>
      current.includes(mood)
        ? current.filter((item) => item !== mood)
        : [...current, mood],
    )
  }

  async function savePlan() {
    if (!title.trim()) {
      toast.error("请先给今天计划起个名字。")
      return
    }

    if (orderedPlaces.length < 2) {
      toast.error("至少先选 2 个地点，路线才有意义。")
      return
    }

    setPending(true)

    try {
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: selectedCity,
          title: title.trim(),
          description: resolvedDescription,
          theme: title.trim(),
          note: note.trim(),
          placeIds: orderedPlaces.map((place) => place.id),
          routeOrder: orderedPlaces.map((place) => place.id),
          moodTags: moods,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || "保存计划失败")
      }

      const payload = (await response.json()) as { data: { slug: string; city: CitySlug } }
      toast.success("今天计划已经保存成路线合集。")
      router.push(`/collections/${payload.data.slug}?city=${payload.data.city}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存计划失败")
    } finally {
      setPending(false)
    }
  }

  if (!places.length) {
    return (
      <Card className="editorial-card rounded-[2rem] border-none bg-card/90">
        <CardHeader>
          <p className="eyebrow">内容准备中</p>
          <CardTitle className="font-heading text-4xl">
            {CITY_META[selectedCity].label} 还没有公开地点样本
          </CardTitle>
          <CardDescription className="text-sm leading-7 text-muted-foreground">
            城市切换器已经可以先工作，但这座城市还没有整理好的公开点位，所以今天计划暂时还排不出真实路线。你可以先用快速收藏把链接收进来，或者切到已开放城市体验完整流程。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href={`/quick-save?city=${selectedCity}`}
            className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
          >
            先快速收藏一条
          </Link>
          {READY_CITY_OPTIONS.map((city) => (
            <Link
              key={city}
              href={`/?city=${city}`}
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
            >
              看{CITY_META[city].label}样本
            </Link>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="space-y-6">
        <Card className="editorial-card rounded-[2rem] border-none bg-card/90">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">计划设置</p>
                <CardTitle className="font-heading text-4xl">先选点，再自动排线</CardTitle>
                <CardDescription className="mt-2 text-sm leading-7 text-muted-foreground">
                  这不是静态合集，而是面向今天出游、约会或朋友局的轻规划工具。你只需要挑出想去的点，系统会先帮你排出一个更顺路的版本。
                </CardDescription>
              </div>
              <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
                {orderedPlaces.length} 站
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="plan-title">计划标题</FieldLabel>
                <Input
                  id="plan-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="比如：今天和朋友去上海西区"
                  className="rounded-[1.2rem]"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="plan-description">一句说明</FieldLabel>
                <Textarea
                  id="plan-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="不写也可以，系统会根据选点自动生成一版路线说明。"
                  className="min-h-24 rounded-[1.25rem]"
                />
                <FieldDescription>
                  你可以自己写，也可以留空让系统根据选中的地点自动生成说明。
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>出游情境</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {(["friends", "date", "relaxed", "photo_friendly", "solo"] as MoodChip[]).map((mood) => {
                    const active = moods.includes(mood)
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
                        {MOOD_CHIP_META[mood].label}
                      </button>
                    )
                  })}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="plan-note">补充备注</FieldLabel>
                <Textarea
                  id="plan-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="比如：下午两点集合，晚上想安排一站可以坐久一点的地方。"
                  className="min-h-24 rounded-[1.25rem]"
                />
              </Field>
            </FieldGroup>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={savePlan}
                disabled={pending || orderedPlaces.length < 2 || !title.trim()}
                className="rounded-full"
              >
                <SparklesIcon data-icon="inline-start" />
                {pending ? "保存中..." : "保存为路线合集"}
              </Button>
              <Link
                href={`/quick-save?city=${selectedCity}`}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
              >
                先去快速收藏
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="editorial-card rounded-[2rem] border-none bg-card/88">
          <CardHeader>
            <p className="eyebrow">选择地点</p>
            <CardTitle className="font-heading text-4xl">把今天想去的地方加进来</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={queryInput}
                onChange={(event) => {
                  const nextValue = event.target.value
                  setQueryInput(nextValue)

                  if (isQueryComposing) {
                    return
                  }

                  setQuery(nextValue)
                }}
                onCompositionStart={() => setIsQueryComposing(true)}
                onCompositionEnd={(event) => {
                  const nextValue = event.currentTarget.value
                  setIsQueryComposing(false)
                  setQueryInput(nextValue)
                  setQuery(nextValue)
                }}
                placeholder="搜索店名、区域、标签或氛围…"
                className="h-12 rounded-full border-border/70 bg-background/80 pl-11"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {filteredPlaces.map((place) => {
                const selected = selectedIds.includes(place.id)
                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => togglePlace(place.id)}
                    className={cn(
                      "rounded-[1.4rem] border p-4 text-left transition",
                      selected
                        ? "border-primary/30 bg-primary/8 shadow-sm"
                        : "border-border/70 bg-background/72 hover:border-primary/25 hover:bg-white/85",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-foreground">{place.name}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {place.area} · {place.summary}
                        </div>
                      </div>
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full border",
                          selected
                            ? "border-primary/20 bg-primary text-primary-foreground"
                            : "border-border/70 bg-card/80 text-muted-foreground",
                        )}
                      >
                        {selected ? <CheckIcon className="size-4" /> : <UsersIcon className="size-4" />}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="editorial-card rounded-[2rem] border-none bg-card/90">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">路线预览</p>
                <CardTitle className="font-heading text-4xl">地图自动排出第一版路线</CardTitle>
                <CardDescription className="mt-2 text-sm leading-7 text-muted-foreground">
                  规则先尽量简单但可信：同一区域优先，白天项目在前，晚餐和夜生活放在后面。你后续还可以继续补“手动改顺序”。
                </CardDescription>
              </div>
              <RouteIcon className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-[1.35rem] border border-border/70 bg-secondary/50 p-4 text-sm leading-7 text-foreground/80">
              {orderedPlaces.length >= 2
                ? routeSummary
                : "先选至少 2 个地点，系统才会开始自动规划今天的路线。"}
            </div>

            <div className="mt-4">
              <CityMapShell
                places={orderedPlaces}
                city={selectedCity}
                activeSlug={orderedPlaces[0]?.slug}
                routeOrder={orderedPlaces.map((place) => place.slug)}
                showRoute
                className="h-[420px]"
              />
            </div>

            <div className="mt-4 space-y-3">
              {orderedPlaces.length ? (
                orderedPlaces.map((place, index) => (
                  <div
                    key={place.id}
                    className="rounded-[1.25rem] border border-border/70 bg-background/75 px-4 py-3"
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
                        <p className="mt-1 text-sm text-muted-foreground">
                          {place.area} · {place.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-border/70 bg-background/45 p-5 text-sm leading-7 text-muted-foreground">
                  右边这块会随着你的选点自动生成路线顺序和地图连线，适合做“今天和朋友去哪里”的第一版规划。
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function buildDefaultDescription(title: string, places: Place[]) {
  if (!places.length) {
    return `${title}：把今天想去的地点收进来后，系统会自动排出一条更顺路的路线。`
  }

  const firstPlace = places[0]
  const lastPlace = places.at(-1)

  if (firstPlace && lastPlace) {
    return `${title}：先从 ${firstPlace.name} 开场，再一路走到 ${lastPlace.name} 收尾，尽量把同一区域和更顺路的地点连在一起。`
  }

  return `${title}：把今天想去的地点收进来后，系统会自动排出一条更顺路的路线。`
}

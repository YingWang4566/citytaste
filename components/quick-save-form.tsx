"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpRightIcon,
  BookmarkPlusIcon,
  ExternalLinkIcon,
  Layers3Icon,
  SendHorizontalIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"
import { CITY_META, PLATFORM_META } from "@/lib/constants"
import { formatDateTime, getHostnameLabel } from "@/lib/place-utils"
import type { CitySlug, Collection, QuickSave } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export function QuickSaveForm({
  selectedCity,
  collections,
  initialQuickSaves,
  initialSourceUrl = "",
  initialNote = "",
  fromShare = false,
}: {
  selectedCity: CitySlug
  collections: Collection[]
  initialQuickSaves: QuickSave[]
  initialSourceUrl?: string
  initialNote?: string
  fromShare?: boolean
}) {
  const router = useRouter()
  const getFirstCollectionIdForCity = (city: CitySlug) =>
    collections.find((collection) => collection.city === city)?.id ?? ""
  const [city, setCity] = useState<CitySlug>(selectedCity)
  const [sourceUrl, setSourceUrl] = useState(initialSourceUrl)
  const [note, setNote] = useState(initialNote)
  const [pending, setPending] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [quickSaves, setQuickSaves] = useState<QuickSave[]>(initialQuickSaves)

  const cityCollections = useMemo(
    () => collections.filter((collection) => collection.city === city),
    [collections, city],
  )
  const quickSaveCollectionMap = useMemo(
    () => new Map(collections.map((collection) => [collection.id, collection])),
    [collections],
  )
  const [collectionId, setCollectionId] = useState<string>(getFirstCollectionIdForCity(selectedCity))

  const visibleQuickSaves = useMemo(
    () => quickSaves.filter((quickSave) => quickSave.city === city),
    [city, quickSaves],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isComposing) {
      return
    }

    setPending(true)

    try {
      const response = await fetch("/api/quick-saves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city,
          sourceUrl,
          note,
          collectionId: collectionId || undefined,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || "保存失败")
      }

      const payload = (await response.json()) as { data: QuickSave }
      setQuickSaves((current) => [payload.data, ...current])
      if (!fromShare) {
        setSourceUrl("")
      }
      setNote("")
      toast.success(fromShare ? "这条分享已经收进 CityTaste。" : "已加入快速收藏，之后可以再慢慢整理。")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card className="editorial-card rounded-[1.9rem] border-none bg-card/90">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">{fromShare ? "分享落地页" : "保存一条灵感"}</p>
              <CardTitle className="font-heading text-4xl">
                {fromShare ? "分享进来，补一句就能存" : "先收进来，再决定怎么用"}
              </CardTitle>
              <CardDescription className="mt-2 text-sm leading-7 text-muted-foreground">
                {fromShare
                  ? "这一步应该像手机里的收件箱，而不是后台。链接已经带进来了，你只需要补充一句为什么想去，以及把它放进哪个城市或计划里。"
                  : "快速收藏只做最轻的一步：记录链接、备注、城市和合集归属。更复杂的字段整理、结构化审核和发布，仍然留给导入工作台。"}
              </CardDescription>
            </div>
            {fromShare ? (
              <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
                <SendHorizontalIcon className="size-3.5" />
                来自外部分享
              </Badge>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {fromShare ? (
              <div className="flex flex-wrap gap-2">
                {["链接已带入", "补一句为什么想存", "归到城市或计划"].map((step) => (
                  <Badge key={step} variant="secondary" className="rounded-full px-3 py-1.5 text-xs">
                    {step}
                  </Badge>
                ))}
              </div>
            ) : null}

            <FieldGroup>
              <Field>
                <FieldLabel>城市</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CITY_META) as CitySlug[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={cn(
                        buttonVariants({ variant: city === option ? "default" : "outline" }),
                        "rounded-full",
                      )}
                      onClick={() => {
                        setCity(option)
                        setCollectionId(getFirstCollectionIdForCity(option))
                      }}
                    >
                      {CITY_META[option].label}
                    </button>
                  ))}
                </div>
                <FieldDescription>
                  就算这座城市还没有完整公开内容，也可以先把灵感归档进去。
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="quick-save-url">来源链接</FieldLabel>
                <Input
                  id="quick-save-url"
                  value={sourceUrl}
                  onChange={(event) => setSourceUrl(event.target.value)}
                  placeholder="https://www.xiaohongshu.com/..."
                  className="rounded-[1.2rem]"
                />
                <FieldDescription>
                  支持小红书、抖音、Google Maps、Instagram 或官网链接。
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="quick-save-note">一句备注</FieldLabel>
                <Textarea
                  id="quick-save-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(event) => {
                    setIsComposing(false)
                    setNote(event.currentTarget.value)
                  }}
                  placeholder="比如：雨天适合坐一下，靠窗位很多，适合和朋友慢慢聊。"
                  className={cn(
                    "rounded-[1.25rem]",
                    fromShare ? "min-h-28" : "min-h-32",
                  )}
                />
                <FieldDescription>
                  中文输入不会被打断；这里记录你真正关心的理由，比只存链接更有用。
                </FieldDescription>
              </Field>

              {cityCollections.length ? (
                <Field>
                  <FieldLabel>先放进哪个合集</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {cityCollections.map((collection) => (
                      <button
                        key={collection.id}
                        type="button"
                        className={cn(
                          buttonVariants({
                            variant: collectionId === collection.id ? "default" : "outline",
                            size: "sm",
                          }),
                          "rounded-full",
                        )}
                        onClick={() => setCollectionId(collection.id)}
                      >
                        {collection.title}
                      </button>
                    ))}
                  </div>
                </Field>
              ) : (
                <Field>
                  <FieldLabel>这座城市还没有现成合集</FieldLabel>
                  <FieldDescription>
                    你可以先保存这条灵感，稍后再去
                    <Link
                      href={`/plans/new?city=${city}`}
                      className="mx-1 font-medium text-primary transition hover:text-primary/80"
                    >
                      新建今天计划
                    </Link>
                    里把它变成一条完整路线。
                  </FieldDescription>
                </Field>
              )}
            </FieldGroup>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={pending || isComposing || !sourceUrl.trim() || !note.trim()}
                className="rounded-full"
              >
                <BookmarkPlusIcon data-icon="inline-start" />
                {pending ? "保存中..." : isComposing ? "正在输入中文..." : fromShare ? "保存这条分享" : "加入快速收藏"}
              </Button>
              <Link
                href={`/plans/new?city=${city}`}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
              >
                去做今天计划
              </Link>
              <Link
                href={`/studio/import?city=${city}`}
                className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
              >
                <SparklesIcon data-icon="inline-start" />
                打开导入工作台
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="editorial-card rounded-[1.9rem] border-none bg-card/88">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">最近保存</p>
              <CardTitle className="font-heading text-4xl">{CITY_META[city].label} 灵感收件夹</CardTitle>
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                这些轻量收藏不一定已经整理成公开地点，但已经开始形成你的个人路线素材库。
              </CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full px-4 py-2 text-sm">
              {visibleQuickSaves.length} 条
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {visibleQuickSaves.length ? (
            visibleQuickSaves.map((quickSave) => {
              const platformMeta = PLATFORM_META[quickSave.sourcePlatform]
              const linkedCollection = quickSave.collectionId
                ? quickSaveCollectionMap.get(quickSave.collectionId)
                : undefined

              return (
                <div
                  key={quickSave.id}
                  className="rounded-[1.45rem] border border-border/70 bg-background/75 p-4 shadow-[0_18px_50px_-40px_rgba(72,48,28,0.42)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full">
                          {platformMeta.emoji} {platformMeta.label}
                        </Badge>
                        {linkedCollection ? (
                          <Badge variant="secondary" className="rounded-full bg-primary/8 text-primary">
                            <Layers3Icon className="size-3.5" />
                            {linkedCollection.title}
                          </Badge>
                        ) : null}
                      </div>
                      <h3 className="mt-3 font-heading text-2xl text-foreground">
                        {quickSave.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-foreground/78">
                        {quickSave.note}
                      </p>
                    </div>
                    <span className="text-xs tracking-[0.18em] text-muted-foreground">
                      {formatDateTime(quickSave.createdAt)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{getHostnameLabel(quickSave.sourceUrl)}</span>
                    {linkedCollection ? (
                      <Link
                        href={`/collections/${linkedCollection.slug}?city=${linkedCollection.city}`}
                        className="inline-flex items-center gap-1 text-primary transition hover:text-primary/80"
                      >
                        查看路线
                        <ArrowUpRightIcon className="size-3.5" />
                      </Link>
                    ) : null}
                    <Link
                      href={quickSave.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary transition hover:text-primary/80"
                    >
                      打开原链接
                      <ExternalLinkIcon className="size-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-background/50 p-6 text-sm leading-7 text-muted-foreground">
              这座城市还没有快速收藏。先从一条链接开始，你后面做场景路线或今天计划时会更有“自己的东西”。
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3">
          <Link
            href={`/plans/new?city=${city}`}
            className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
          >
            新建今天计划
          </Link>
          <Link
            href={`/explore?city=${city}`}
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
          >
            看这座城市的公开地图
            <ArrowUpRightIcon data-icon="inline-end" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"
import type { CitySlug, ParsedPlaceDraft, SourceLink } from "@/lib/types"
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
import { Badge } from "@/components/ui/badge"
import { SourceLinkList } from "@/components/source-link-list"
import { CATEGORY_META } from "@/lib/constants"
import { cn } from "@/lib/utils"

type ImportResult = {
  draft: {
    id: string
  }
  preview: ParsedPlaceDraft
}

export function ImportStudio({ selectedCity }: { selectedCity: CitySlug }) {
  const router = useRouter()
  const [rawText, setRawText] = useState(
    "安福路雨天咖啡推荐｜靠窗位很多，肉桂卷很好吃，适合一个人工作半天。小红书上很多人说这家店下午三点之后光线很好，#雨天咖啡 #适合工作",
  )
  const [sourceUrl, setSourceUrl] = useState("")
  const [result, setResult] = useState<ImportResult | null>(null)
  const [pending, setPending] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isComposing) return
    setPending(true)

    try {
      const response = await fetch("/api/studio/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawText, sourceUrl }),
      })

      if (!response.ok) {
        throw new Error("导入失败")
      }

      const payload = (await response.json()) as { data: ImportResult }
      setResult(payload.data)
      toast.success("已生成结构化草稿，可以继续审核并发布。")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "导入失败")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <Card className="editorial-card rounded-[1.9rem] border-none bg-card/90">
        <CardHeader>
          <p className="eyebrow">输入区</p>
          <CardTitle className="font-heading text-4xl">导入原始收藏</CardTitle>
          <CardDescription className="text-sm leading-7 text-muted-foreground">
            支持贴一段小红书文案、聊天记录、备忘录内容，或者附上一条来源 URL。当前演示版不会抓取页面，只解析你主动粘贴的文本。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="source-url">来源 URL</FieldLabel>
                <Input
                  id="source-url"
                  value={sourceUrl}
                  onChange={(event) => setSourceUrl(event.target.value)}
                  placeholder="https://www.xiaohongshu.com/..."
                />
                <FieldDescription>
                  可选。用于推断来源平台，并保留回原始内容的跳转链接。
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="raw-text">原始文本</FieldLabel>
                <Textarea
                  id="raw-text"
                  value={rawText}
                  onChange={(event) => setRawText(event.target.value)}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(event) => {
                    setIsComposing(false)
                    setRawText(event.currentTarget.value)
                  }}
                  placeholder="粘贴原始收藏文本"
                  className="min-h-56 rounded-[1.35rem] font-sans"
                />
                <FieldDescription>
                  支持中文输入法连续输入；输入过程中不会自动提交或打断。
                </FieldDescription>
              </Field>
            </FieldGroup>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={pending || isComposing || !rawText.trim()}
                className="rounded-full"
              >
                <SparklesIcon data-icon="inline-start" />
                {pending ? "正在解析..." : isComposing ? "正在输入中文..." : "生成草稿"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  setRawText(
                    "北外滩夜景酒吧推荐：适合约会，露台视野非常开阔，朋友说落日之后灯亮起来最好看，抖音上有人分享过入夜后的现场视频。",
                  )
                }
              >
                换一条示例
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="editorial-card rounded-[1.9rem] border-none bg-card/88">
        <CardHeader>
          <p className="eyebrow">预览区</p>
          <CardTitle className="font-heading text-4xl">结构化草稿</CardTitle>
          <CardDescription className="text-sm leading-7 text-muted-foreground">
            这是解析器给出的第一版结构化结果。维护者可以去审核台调整字段，再决定是否发布到公共站点。
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {result ? (
            <>
              <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-3xl">
                      {result.preview.name ?? "未命名地点"}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {(result.preview.area ?? "待确认区域")} · {result.preview.address ?? "待补充地址"}
                    </p>
                  </div>
                  {result.preview.category ? (
                    <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                      {CATEGORY_META[result.preview.category].emoji}{" "}
                      {CATEGORY_META[result.preview.category].label}
                    </Badge>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-7 text-foreground/80">
                  {result.preview.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {result.preview.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {result.preview.sourceLinks?.length ? (
                  <div className="mt-5">
                    <SourceLinkList
                      sourceLinks={result.preview.sourceLinks as SourceLink[]}
                    />
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-background/50 p-6 text-sm leading-7 text-muted-foreground">
              还没有草稿。提交左侧表单后，这里会显示解析后的地点名称、区域、标签、来源链接和建议摘要。
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3">
          <Link
            href={`/studio/review?city=${selectedCity}`}
            className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
          >
            去审核台
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

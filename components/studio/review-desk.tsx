"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { SubmissionDraft } from "@/lib/types"
import { getPlatformLabel } from "@/lib/place-utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const REVIEW_STATUS_LABEL: Record<SubmissionDraft["reviewStatus"], string> = {
  pending: "待审核",
  approved: "已发布",
  rejected: "已驳回",
}

export function ReviewDesk({ initialDrafts }: { initialDrafts: SubmissionDraft[] }) {
  const [drafts, setDrafts] = useState(initialDrafts)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function saveDraft(draft: SubmissionDraft) {
    setBusyId(draft.id)

    try {
      const response = await fetch(`/api/studio/drafts/${draft.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      })

      if (!response.ok) {
        throw new Error("保存失败")
      }

      const payload = (await response.json()) as { data: SubmissionDraft }
      setDrafts((current) =>
        current.map((item) => (item.id === draft.id ? payload.data : item)),
      )
      toast.success("草稿已保存")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败")
    } finally {
      setBusyId(null)
    }
  }

  async function transitionDraft(id: string, action: "approve" | "reject") {
    setBusyId(id)

    try {
      const response = await fetch(`/api/studio/drafts/${id}/${action}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(action === "approve" ? "发布失败" : "驳回失败")
      }

      if (action === "approve") {
        setDrafts((current) =>
          current.map((item) =>
            item.id === id ? { ...item, reviewStatus: "approved" } : item,
          ),
        )
        toast.success("已发布到 CityTaste")
      } else {
        setDrafts((current) =>
          current.map((item) =>
            item.id === id ? { ...item, reviewStatus: "rejected" } : item,
          ),
        )
        toast.success("草稿已标记为驳回")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "状态更新失败")
    } finally {
      setBusyId(null)
    }
  }

  function updateField(
    id: string,
    field: keyof SubmissionDraft["parsedPlace"],
    value: string,
  ) {
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === id
          ? {
              ...draft,
              parsedPlace: {
                ...draft.parsedPlace,
                [field]:
                  field === "tags" || field === "vibes" || field === "collectionIds"
                    ? value
                        .split(/[,，]/)
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : value,
              },
            }
          : draft,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {drafts.length ? (
        drafts.map((draft) => (
          <Card
            key={draft.id}
            className="editorial-card rounded-[1.85rem] border-none bg-card/90"
          >
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">草稿 {draft.id.slice(-6)}</p>
                  <CardTitle className="font-heading text-3xl">
                    {draft.parsedPlace.name ?? "未命名草稿"}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-7 text-muted-foreground">
                    来源平台：{getPlatformLabel(draft.sourcePlatform)} · 当前状态：{REVIEW_STATUS_LABEL[draft.reviewStatus]}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                  {REVIEW_STATUS_LABEL[draft.reviewStatus]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor={`name-${draft.id}`}>地点名称</FieldLabel>
                  <Input
                    id={`name-${draft.id}`}
                    value={draft.parsedPlace.name ?? ""}
                    onChange={(event) => updateField(draft.id, "name", event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`area-${draft.id}`}>区域</FieldLabel>
                  <Input
                    id={`area-${draft.id}`}
                    value={draft.parsedPlace.area ?? ""}
                    onChange={(event) => updateField(draft.id, "area", event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`summary-${draft.id}`}>摘要</FieldLabel>
                  <Textarea
                    id={`summary-${draft.id}`}
                    value={draft.parsedPlace.summary ?? ""}
                    onChange={(event) => updateField(draft.id, "summary", event.target.value)}
                    className="min-h-24 rounded-[1.2rem]"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`tags-${draft.id}`}>标签</FieldLabel>
                  <Input
                    id={`tags-${draft.id}`}
                    value={(draft.parsedPlace.tags ?? []).join(", ")}
                    onChange={(event) => updateField(draft.id, "tags", event.target.value)}
                  />
                  <FieldDescription>使用中文或英文逗号分隔多个标签。</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`description-${draft.id}`}>详细描述</FieldLabel>
                  <Textarea
                    id={`description-${draft.id}`}
                    value={draft.parsedPlace.description ?? ""}
                    onChange={(event) =>
                      updateField(draft.id, "description", event.target.value)
                    }
                    className="min-h-40 rounded-[1.2rem]"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                disabled={busyId === draft.id}
                onClick={() => saveDraft(draft)}
              >
                保存修改
              </Button>
              <Button
                className="rounded-full"
                disabled={busyId === draft.id}
                onClick={() => transitionDraft(draft.id, "approve")}
              >
                发布
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                disabled={busyId === draft.id}
                onClick={() => transitionDraft(draft.id, "reject")}
              >
                驳回
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card className="editorial-card rounded-[1.85rem] border-none bg-card/88">
          <CardHeader>
            <CardTitle className="font-heading text-3xl">还没有待审核草稿</CardTitle>
            <CardDescription>
              去导入工作台粘贴一段原始文本，系统会先生成待审核草稿。
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

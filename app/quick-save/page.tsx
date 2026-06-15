import { getCollections, getQuickSaves } from "@/lib/data"
import { normalizeCitySlug } from "@/lib/place-utils"
import { QuickSaveForm } from "@/components/quick-save-form"

export const dynamic = "force-dynamic"

export default async function QuickSavePage({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string
    url?: string
    text?: string
    title?: string
    shared?: string
  }>
}) {
  const params = await searchParams
  const selectedCity = normalizeCitySlug(params.city)
  const fromShare = Boolean(params.url || params.text || params.title || params.shared)
  const initialNote = params.text?.trim() || params.title?.trim() || ""
  const [collections, quickSaves] = await Promise.all([getCollections(), getQuickSaves()])

  return (
    <div className="page-shell py-10 sm:py-12">
      <section className="mb-8 max-w-4xl">
        <p className="eyebrow">{fromShare ? "从分享进入" : "轻量保存入口"}</p>
        <h1 className="mt-4 font-heading text-5xl leading-none sm:text-6xl">
          快速收藏
        </h1>
        <p className="mt-5 text-base leading-8 text-foreground/78 sm:text-lg">
          {fromShare
            ? "如果你是从小红书、抖音或 Google Maps 的分享动作跳进来的，这里会直接接住那条链接。你只需要补一句为什么想存它，再选城市或归入合集，就完成了最轻的一步。"
            : "这里不是维护者工作台，而是面向日常使用的快速入口。把一条小红书、抖音或 Google Maps 链接先收进来，顺手写一句备注、分到城市和合集里，之后再决定要不要进入更重的整理流程。"}
        </p>
      </section>

      <QuickSaveForm
        key={`${selectedCity}:${params.url ?? ""}:${params.text ?? ""}:${params.title ?? ""}:${params.shared ?? ""}`}
        selectedCity={selectedCity}
        collections={collections}
        initialQuickSaves={quickSaves}
        initialSourceUrl={params.url?.trim() ?? ""}
        initialNote={initialNote}
        fromShare={fromShare}
      />
    </div>
  )
}

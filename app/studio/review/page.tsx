import { getDrafts } from "@/lib/data"
import { ReviewDesk } from "@/components/studio/review-desk"

export const dynamic = "force-dynamic"

export default async function StudioReviewPage() {
  const drafts = await getDrafts()

  return (
    <div className="page-shell py-10">
      <section className="mb-8">
        <p className="eyebrow">维护者审核台</p>
        <h1 className="mt-4 font-heading text-5xl leading-none sm:text-6xl">
          审核台
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/78">
          维护者可以在这里微调解析结果，再决定发布或驳回。V1 不做公开投稿和社区审核，但这一步已经足够说明内容如何进入系统。
        </p>
      </section>
      <ReviewDesk initialDrafts={drafts} />
    </div>
  )
}

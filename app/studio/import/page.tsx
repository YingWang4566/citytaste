import { normalizeCitySlug } from "@/lib/place-utils"
import { ImportStudio } from "@/components/studio/import-studio"

export const dynamic = "force-dynamic"

export default async function StudioImportPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>
}) {
  const params = await searchParams
  const selectedCity = normalizeCitySlug(params.city)

  return (
    <div className="page-shell py-10">
      <section className="mb-8">
        <p className="eyebrow">维护者工作流</p>
        <h1 className="mt-4 font-heading text-5xl leading-none sm:text-6xl">
          Import Studio（导入工作台）
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/78">
          这一层让项目从“漂亮的静态站”变成“有真实内容流转的产品原型”。它模拟维护者把碎片化收藏导入系统、整理成结构化地点、再发布到公共地图的过程。
        </p>
      </section>
      <ImportStudio selectedCity={selectedCity} />
    </div>
  )
}

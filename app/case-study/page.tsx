export default function CaseStudyPage() {
  return (
    <div className="page-shell py-10">
      <section className="editorial-card rounded-[2.2rem] px-6 py-8 sm:px-10 sm:py-12">
        <p className="eyebrow">项目案例</p>
        <h1 className="mt-4 font-heading text-5xl leading-none sm:text-6xl">
          从“保存了很多”到“真的能探索”
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-foreground/78">
          CityTaste 的核心不只是地图或卡片，而是把碎片化生活收藏转成可继续使用的数据系统。它先以作品集优先的方式完成公共前台，再补上一个仅维护者可用的内容入口闭环。
        </p>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        <CaseCard
          title="问题"
          body="生活方式收藏高度分散：小红书、抖音、地图、聊天记录和备忘录都有价值，但几乎不能被统一搜索、对比、规划与沉淀。"
        />
        <CaseCard
          title="产品判断"
          body="V1 不做重社区，不先陷入评论、点赞、审核风控，而是做一个前台产品完整、后台导入闭环真实存在的混合形态。"
        />
        <CaseCard
          title="为什么值得做"
          body="这样既能展示产品思维、前端表达与信息架构，也能真实演示 AI 辅助导入，而不是只在文档里描述它。"
        />
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-2">
        <div className="editorial-card rounded-[1.95rem] p-6 sm:p-8">
          <p className="eyebrow">公开前台</p>
          <h2 className="mt-3 font-heading text-4xl">用户会看到什么</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground/78">
            <li>首页讲清楚：这不是普通美食站，而是个人城市探索系统。</li>
            <li>探索页提供地图、卡片、搜索与多维筛选。</li>
            <li>详情页保留来源链接，让原始上下文可以被重新访问。</li>
            <li>合集页承担“预设探索入口”的职责，而不是分类别名。</li>
          </ul>
        </div>

        <div className="editorial-card rounded-[1.95rem] p-6 sm:p-8">
          <p className="eyebrow">维护者工作流</p>
          <h2 className="mt-3 font-heading text-4xl">内容如何进入系统</h2>
          <ol className="mt-5 space-y-3 text-sm leading-7 text-foreground/78">
            <li>1. 在导入工作台粘贴原始文本与可选来源 URL。</li>
            <li>2. 解析器给出第一版结构化草稿：名称、区域、类别、标签、摘要、来源链接。</li>
            <li>3. 维护者在审核台校正字段并决定发布或驳回。</li>
            <li>4. 发布后地点立即进入公开地图与详情页面。</li>
          </ol>
        </div>
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-2">
        <div className="editorial-card rounded-[1.95rem] p-6 sm:p-8">
          <p className="eyebrow">数据模型</p>
          <h2 className="mt-3 font-heading text-4xl">核心实体</h2>
          <pre className="mt-5 overflow-x-auto rounded-[1.4rem] border border-border/70 bg-secondary/45 p-5 text-xs leading-6 text-foreground/80">
{`Place
- id / slug / name / category
- city / area / address / lat / lng
- tags / vibes / summary / description
- sourceLinks / collectionIds / publishedAt

SubmissionDraft
- rawText / sourcePlatform / sourceUrl
- parsedPlace
- reviewStatus / reviewNotes

LocalVisitState
- want_to_go / visited / favorite`}
          </pre>
        </div>

        <div className="editorial-card rounded-[1.95rem] p-6 sm:p-8">
          <p className="eyebrow">技术选择</p>
          <h2 className="mt-3 font-heading text-4xl">为什么这样选</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground/78">
            <li>Next.js App Router 负责页面结构、server rendering 和 route handlers。</li>
            <li>Tailwind + shadcn/ui 提供稳定的 UI 组合能力，但视觉上避免默认 SaaS 模板感。</li>
            <li>Leaflet 让地图集成轻量、无 token 负担，适合快速做作品集 MVP。</li>
            <li>Supabase 客户端已预留，但当前演示版本先优雅回退到内存存储。</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

function CaseCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="editorial-card rounded-[1.8rem] p-6">
      <p className="eyebrow">{title}</p>
      <p className="mt-3 text-sm leading-7 text-foreground/78">{body}</p>
    </div>
  )
}

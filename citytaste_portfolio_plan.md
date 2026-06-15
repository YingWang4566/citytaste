# CityTaste / 玩乐地图作品集项目方案

> 项目定位：一个面向个人收藏、城市探索和内容沉淀的「吃喝玩乐一条龙」互动地图平台。  
> 它不只是一个美食网站，而是一个可以把小红书、抖音、朋友推荐、旅行笔记、Google Maps 收藏等碎片化信息整合起来的个人城市探索系统。

---

## 1. 项目一句话介绍

**CityTaste 是一个 AI-assisted 的城市吃喝玩乐收藏与探索平台。**

用户可以把自己在小红书、抖音、Instagram、Google Maps、聊天记录、备忘录里收藏过的餐厅、咖啡馆、展览、商场、景点、酒吧、活动等内容统一整理到一个地图网站中，并通过搜索、筛选、标签、地图、跳转链接和互动功能进行管理和探索。

---

## 2. 为什么这个项目适合作品集？

这个项目适合作品集的原因是，它不是一个纯展示型页面，而是一个有真实需求、有产品逻辑、有技术深度的小型产品。

### 2.1 用户真实痛点

现在很多人的吃喝玩乐信息都非常分散：

- 小红书收藏了一堆探店笔记
- 抖音收藏了很多短视频推荐
- Google Maps 收藏了地点
- 微信聊天里有朋友推荐
- Apple Notes / Notion 里有自己整理的 list
- 旅行时临时保存了一堆链接，但之后很难找

这些内容的问题是：

1. **分散**：内容在不同 App 里，难以统一管理。
2. **不可搜索**：想找“涩谷附近适合拍照的咖啡馆”很麻烦。
3. **不可规划**：很难按区域、路线、预算、场景来筛选。
4. **难以沉淀**：看过、想去、已去、推荐理由都无法系统整理。
5. **缺乏个性化**：平台推荐是大众化的，但个人喜好没有被建模。

### 2.2 作品集亮点

这个项目可以展示以下能力：

| 能力 | 体现方式 |
|---|---|
| 产品思维 | 从真实生活痛点出发，设计收藏、筛选、地图、跳转、评论等功能 |
| 前端能力 | 响应式页面、卡片交互、地图联动、动效、移动端体验 |
| AI workflow | 用 LLM 把非结构化笔记整理成结构化地点数据 |
| 数据建模 | 设计 place、tag、source、review、collection 等数据结构 |
| 后端能力 | 点赞、评论、投稿、审核、限流、防刷 |
| UI/UX 能力 | shadcn/ui、Tailwind、移动端 App-like 设计、轻 3D 风格 |
| 工程能力 | Vercel 部署、Supabase 数据库、权限、API、性能优化 |

---

## 3. 项目定位升级：从 Foodie Site 到 City Guide

原始想法可能是一个「美食网站」，但更适合作品集的定位应该是：

> 从「Foodie Site」升级为「Personal City Guide / Lifestyle Map」。

也就是说，它不仅包含吃，还包含：

- 吃：餐厅、咖啡馆、甜品店、居酒屋、拉面店
- 喝：咖啡、酒吧、茶饮、brunch
- 玩：展览、livehouse、商场、游戏厅、公园、城市路线
- 乐：拍照点、约会地点、周末活动、旅行目的地
- 买：杂货店、设计店、买手店、伴手礼店
- 住/行扩展：酒店、车站、路线规划、旅行日程

推荐项目中文名可以是：

- 玩乐地图
- CityTaste
- TasteMap
- VibeMap
- 城市灵感地图
- Tokyo Vibe Map
- Eat Play Map

---

## 4. 核心产品故事

作品集里可以这样讲：

> 我发现自己的美食、旅行和城市探索收藏散落在小红书、抖音、Google Maps、备忘录和聊天记录里。虽然这些内容很有价值，但它们很难被搜索、分类、对比和规划。  
> 因此我设计并实现了一个 AI-assisted 的城市探索平台，把碎片化收藏统一整理成可搜索、可筛选、可地图浏览、可跳转原始内容的个人玩乐数据库。  
> 它既是我的个人生活地图，也是一套可以扩展为社区型推荐平台的产品原型。

---

## 5. 核心功能设计

### 5.1 地点卡片 Place Card

每个地点可以是一张卡片，包含：

- 名称
- 类型：餐厅 / 咖啡 / 展览 / 景点 / 商场 / 酒吧 / 活动
- 区域：涩谷、新宿、银座、表参道、京都、上海等
- 标签：适合约会、适合学习、适合拍照、性价比高、人少、夜景好
- 价格区间
- 推荐理由
- 封面图片 / 视频封面
- 地址
- 地图坐标
- 营业时间
- 状态：想去 / 已去 / 收藏 / 不推荐
- 来源链接：小红书 / 抖音 / Google Maps / Instagram / 官方网站
- 用户评论
- 点赞数 / 收藏数

---

## 6. 小红书 / 抖音链接跳转功能

这个功能非常值得加，而且可以成为项目的一个亮点。

### 6.1 为什么要加？

很多吃喝玩乐内容的原始信息来自小红书、抖音、Instagram 或 Google Maps。用户不是只想看一个地点名称，还想回到原始内容里查看：

- 照片
- 视频
- 评论区
- 博主推荐理由
- 最新营业信息
- 菜单
- 避雷信息
- 交通说明

所以每个地点卡片应该保留「source links」。

### 6.2 功能设计

每个地点卡片可以有一个「来源」区域：

```text
来源：
- 小红书笔记
- 抖音视频
- Google Maps
- Instagram
- 官方网站
```

点击按钮后可以跳转到原始页面。

例如：

```json
{
  "name": "Blue Bottle Coffee Shibuya",
  "category": "Cafe",
  "area": "Shibuya",
  "tags": ["coffee", "study", "minimal design"],
  "sourceLinks": [
    {
      "platform": "xiaohongshu",
      "label": "小红书探店笔记",
      "url": "https://www.xiaohongshu.com/..."
    },
    {
      "platform": "douyin",
      "label": "抖音视频推荐",
      "url": "https://www.douyin.com/..."
    },
    {
      "platform": "google_maps",
      "label": "Google Maps",
      "url": "https://maps.google.com/..."
    }
  ]
}
```

### 6.3 UI 设计

在卡片上可以放几个小按钮：

```text
[小红书] [抖音] [地图] [官网]
```

或者做成一个 dropdown：

```text
查看来源
├── 小红书笔记
├── 抖音视频
├── Google Maps
└── 官方网站
```

### 6.4 作品集表达方式

这个功能可以这样写进作品集：

> I designed a source-link system that preserves the original context of each recommendation. Instead of flattening all information into a static card, each place keeps links to its source posts from Xiaohongshu, Douyin, Google Maps, or official websites. This allows users to jump back to the original content for richer context such as videos, comments, menus, and real-time updates.

中文可以写成：

> 我设计了一个来源链接系统，让每个地点不仅是一个静态卡片，还能保留它来自哪里。用户可以从地点卡片直接跳转到小红书笔记、抖音视频、Google Maps 或官网，从而查看原始图片、视频、评论和最新信息。

---

## 7. 页面跳转与信息架构

这个项目不应该只有一个首页，建议至少设计 5 类页面。

### 7.1 首页 Home

首页负责讲清楚产品：

- Hero 区：一句话介绍
- 搜索框
- 推荐分类入口
- 热门地点卡片
- 地图预览
- 个人收藏统计

示例结构：

```text
Hero:
"Turn your saved posts into a personal city map."

Search:
搜索地点、区域、标签、场景

Sections:
- 今天想吃什么？
- 周末去哪玩？
- 适合约会的地方
- 我最近收藏的地点
```

### 7.2 探索页 Explore

这是核心页面。

功能：

- 地图
- 地点卡片列表
- 搜索
- 分类筛选
- 区域筛选
- 价格筛选
- 场景筛选
- 排序：最近收藏 / 最想去 / 距离最近 / 热门

布局可以是：

```text
左侧：地图
右侧：地点卡片列表
顶部：搜索和筛选
移动端：地图与列表切换
```

### 7.3 地点详情页 Place Detail

点击卡片进入详情页。

内容：

- 大图 / 视频封面
- 地点名称
- 简介
- 标签
- 地址
- 地图
- 来源链接
- 用户评论
- 相似推荐
- 想去 / 已去 / 收藏按钮

### 7.4 收藏来源页 Sources

这个页面专门展示用户从不同平台收藏的内容。

例如：

```text
我的来源
├── 小红书收藏
├── 抖音收藏
├── Google Maps
├── Instagram
├── 手动添加
└── 朋友推荐
```

这个页面的价值是让作品集更有产品感。

你可以展示：

- 每个平台导入了多少条
- 哪些已经被解析成地点
- 哪些还待整理
- 哪些链接失效
- 哪些需要补充图片或地址

### 7.5 Case Study 页面

这是作品集最重要的页面之一。

内容包括：

- 项目背景
- 用户痛点
- 目标用户
- 设计目标
- 功能架构
- 数据结构
- AI 辅助流程
- 技术栈
- Before / After
- 遇到的问题
- 后续计划

---

## 8. 数据结构设计

### 8.1 Place

```ts
type Place = {
  id: string
  name: string
  category: "food" | "cafe" | "bar" | "shopping" | "activity" | "travel" | "exhibition"
  area: string
  city: string
  address?: string
  latitude?: number
  longitude?: number
  priceRange?: "low" | "medium" | "high"
  tags: string[]
  description: string
  coverImage?: string
  images?: string[]
  status: "want_to_go" | "visited" | "favorite" | "archived"
  sourceLinks: SourceLink[]
  createdAt: string
  updatedAt: string
}
```

### 8.2 SourceLink

```ts
type SourceLink = {
  id: string
  platform: "xiaohongshu" | "douyin" | "instagram" | "google_maps" | "official" | "manual"
  label: string
  url: string
  thumbnail?: string
  author?: string
  note?: string
}
```

### 8.3 Review

```ts
type Review = {
  id: string
  placeId: string
  userId: string
  rating?: number
  content: string
  images?: string[]
  createdAt: string
}
```

### 8.4 Submission

```ts
type Submission = {
  id: string
  submittedBy: string
  rawText?: string
  sourceUrl?: string
  parsedPlace?: Partial<Place>
  status: "pending" | "approved" | "rejected"
  createdAt: string
}
```

---

## 9. AI-assisted Workflow

这个项目可以加入 AI 工作流，让它更符合你的背景。

### 9.1 输入

用户输入可以是：

- 一段小红书文案
- 一个抖音链接
- 一个 Google Maps 链接
- 一段聊天记录
- 一个 Notion / Apple Notes 文本
- 手动填写的地点信息

### 9.2 AI 解析

LLM 可以尝试提取：

- 地点名称
- 城市
- 区域
- 类型
- 推荐理由
- 标签
- 价格
- 适合场景
- 来源链接

### 9.3 输出

输出为结构化 JSON：

```json
{
  "name": "xxx",
  "category": "cafe",
  "area": "Shibuya",
  "tags": ["study", "quiet", "coffee"],
  "description": "A quiet cafe suitable for studying and working.",
  "sourceLinks": [
    {
      "platform": "xiaohongshu",
      "url": "https://www.xiaohongshu.com/..."
    }
  ]
}
```

### 9.4 作品集表述

> I used an AI-assisted data extraction workflow to transform messy lifestyle notes and social media links into structured place data. This makes the system scalable: instead of manually filling every field, users can paste a saved post or note, and the system generates an editable place card.

---

## 10. 前端设计建议

### 10.1 技术栈

推荐：

```text
Next.js + TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
Mapbox / Leaflet
Supabase
Vercel
```

### 10.2 UI 风格

建议风格：

```text
Clean + App-like + Light 3D + Map-centered
```

关键词：

- 移动端优先
- 卡片式布局
- 大图封面
- 圆角
- 柔和阴影
- 轻微 hover 动效
- 地图 pin 视觉突出
- 分类 icon 立体化
- 颜色不要太杂

### 10.3 可以参考的页面元素

- Apple Maps 的简洁地图体验
- 小红书的信息密度和图片吸引力
- Airbnb 的地点卡片
- Notion 的结构化信息管理
- Linear / Raycast 的干净 UI
- shadcn/ui 的现代组件风格

---

## 11. 3D 风格可以怎么做？

这里的 3D 不一定是复杂 Three.js，而是视觉上的空间感。

### 11.1 轻 3D

推荐使用轻 3D：

- 卡片 hover 时轻微倾斜
- 地图 pin 有立体阴影
- 分类 icon 使用 3D 风格
- 首页放一个 3D 城市小地图
- 食物、咖啡、相机、路线等图标做成立体风格

### 11.2 不建议一开始做重 3D

不建议一开始就做复杂的 Three.js 场景，因为：

- 开发成本高
- 加载慢
- 可能喧宾夺主
- 和产品核心关系不够强

### 11.3 推荐表达

> I used a light 3D visual language to make the interface feel playful and exploratory, without sacrificing usability or performance.

---

## 12. 评论、点赞、投稿和限流

### 12.1 为什么要加互动？

互动功能可以让网站从静态作品变成真实产品原型。

可以加：

- 点赞
- 收藏
- 评论
- 投稿
- 举报
- 管理员审核

### 12.2 限流设计

需要防止：

- 恶意刷点赞
- 恶意评论
- 频繁投稿
- 简单 DDoS
- 垃圾内容

基础策略：

```text
1. 评论接口限制：同一用户 30 秒内只能发一次
2. 点赞接口限制：同一用户或 IP 10 秒内只能操作一次
3. 投稿进入 pending 状态，需要管理员审核
4. 未登录用户只能浏览，不能大量提交
5. 后端记录 created_at、user_id、ip_hash
```

可以使用：

- Supabase Row Level Security
- Vercel Middleware
- Upstash Redis Rate Limit
- Turnstile / reCAPTCHA

---

## 13. 关于“点赞导致整个 DOM 重渲染”的优化

如果原始项目是静态 HTML + 原生 JS，点赞时可能会重新渲染整个列表，导致体验不好。

升级方案：

1. 使用 React / Next.js 组件化
2. 每张卡片维护自己的点赞状态
3. 使用 optimistic UI
4. 只更新被点击的卡片
5. 对列表组件使用 memo
6. 后端异步写入点赞记录

作品集里可以这样写：

> I optimized the like interaction from full-list re-rendering to component-level optimistic updates, improving perceived responsiveness and making the interaction feel native-app-like.

---

## 14. 是否要做 App / SwiftUI / 微信小程序？

建议：

**第一阶段不要直接做 App。**

原因：

- Web 更适合作品集展示
- 链接可以直接发给面试官
- 开发成本低
- 部署和迭代快
- 可以先验证产品逻辑

但是可以做成 **PWA / App-like mobile web**：

- 底部 Tab
- 全屏地图
- 卡片滑动
- 收藏按钮
- 手机端优先
- 可添加到主屏幕

后续扩展可以写：

```text
Future Work:
- SwiftUI iOS App
- 微信小程序
- Browser extension for saving links
- Auto import from social platforms
```

---

## 15. 推荐开发阶段

### Phase 1: Static MVP

目标：先做出能展示的版本。

功能：

- 首页
- 探索页
- 地点卡片
- 搜索
- 分类筛选
- 来源链接跳转
- 地图展示
- 响应式布局

### Phase 2: UI Upgrade

目标：让它看起来像作品集项目。

加入：

- shadcn/ui
- Tailwind theme
- Framer Motion
- 图片资源
- 轻 3D 风格
- 移动端优化
- Skeleton loading
- 空状态页面

### Phase 3: Dynamic Features

目标：从静态网站升级成产品原型。

加入：

- Supabase 数据库
- 用户登录
- 点赞
- 评论
- 投稿
- 管理员审核
- 限流

### Phase 4: AI Workflow

目标：强化 AI 背景。

加入：

- 粘贴小红书/抖音/笔记文本
- AI 自动解析地点
- 自动生成标签
- 自动生成推荐理由
- 用户确认后保存

### Phase 5: Portfolio Packaging

目标：让别人看懂你做了什么。

加入：

- `/case-study` 页面
- 架构图
- 数据流图
- before / after
- 技术难点
- future work
- GitHub README

---

## 16. 推荐页面结构

```text
/
├── 首页 Home
├── /explore
│   ├── 地图 + 卡片列表
│   ├── 搜索
│   └── 筛选
├── /place/[id]
│   ├── 地点详情
│   ├── 来源跳转
│   ├── 评论
│   └── 相似推荐
├── /sources
│   ├── 小红书
│   ├── 抖音
│   ├── Google Maps
│   └── 手动收藏
├── /submit
│   ├── 粘贴链接
│   ├── AI 解析
│   └── 提交审核
├── /profile
│   ├── 我的收藏
│   ├── 想去
│   └── 已去
└── /case-study
    ├── 项目背景
    ├── 设计过程
    ├── 技术架构
    └── 结果展示
```

---

## 17. MVP 优先级

### Must Have

- 地点卡片
- 分类筛选
- 搜索
- 地图
- 来源链接跳转
- 响应式设计
- 图片资源
- case-study 页面

### Should Have

- 想去 / 已去状态
- 点赞
- 评论
- 投稿
- 管理员审核
- 轻 3D 视觉

### Nice to Have

- AI 自动解析
- 语义搜索
- 个性化推荐
- PWA
- SwiftUI App
- 微信小程序
- 自动抓取平台内容

---

## 18. 给 Codex / Claude 的开发 Prompt

```text
I want to build a portfolio-quality city lifestyle map app, not just a food website.

Project concept:
A personal "eat, drink, play, explore" city guide that turns messy saved links and notes from Xiaohongshu, Douyin, Google Maps, Instagram, and personal notes into structured place cards.

Tech stack:
- Next.js + TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Mapbox or Leaflet
- Supabase later for dynamic features

MVP features:
1. Home page with strong product story
2. Explore page with map + searchable place cards
3. Category filters: food, cafe, bar, shopping, activity, travel, exhibition
4. Region and tag filters
5. Place detail page
6. Source links for each place: Xiaohongshu, Douyin, Google Maps, official site, etc.
7. Status: want to go / visited / favorite
8. Mobile-first app-like UI
9. Case study page for portfolio explanation

Please first inspect the project structure, then propose an implementation plan. Start with a polished static MVP. Keep the architecture scalable for later Supabase integration, likes, comments, submissions, and AI-assisted parsing.
```

---

## 19. 作品集 README 开头示例

```md
# CityTaste — AI-assisted Personal City Guide

CityTaste is a portfolio project that transforms scattered lifestyle recommendations from social media, maps, and personal notes into an interactive city exploration map.

Instead of saving restaurants, cafes, exhibitions, and activities across Xiaohongshu, Douyin, Google Maps, and chat messages, users can organize everything into structured place cards with tags, maps, source links, personal status, and comments.

This project explores how AI-assisted data extraction, map-based interfaces, and social interaction design can turn messy saved content into a personal city guide.
```

中文版本：

```md
# CityTaste — AI 辅助的个人城市探索地图

CityTaste 是一个作品集项目，目标是把分散在小红书、抖音、Google Maps、聊天记录和个人笔记中的吃喝玩乐收藏，整理成一个可搜索、可筛选、可地图浏览的个人城市探索平台。

用户可以把餐厅、咖啡馆、展览、景点、商场、酒吧和活动统一保存为结构化地点卡片，并保留原始来源链接，从而在需要时跳转回小红书、抖音或地图页面查看更完整的内容。
```

---

## 20. 最终建议

这个项目值得做，但建议不要只做成「美食网站」。

更好的方向是：

> 一个能整理小红书 / 抖音 / Google Maps 收藏的吃喝玩乐地图平台。

最重要的差异化功能是：

1. **来源链接跳转**：保留小红书、抖音、Google Maps 等原始内容。
2. **地图探索**：按区域和标签探索城市。
3. **AI 解析**：把乱七八糟的收藏文本转成结构化地点卡片。
4. **互动沉淀**：点赞、评论、想去、已去、投稿。
5. **作品集 case study**：清楚说明问题、设计、技术和结果。

如果做得好，它会比普通 CRUD 项目、普通美食网站、普通 landing page 更有故事，也更能体现你的产品和工程能力。

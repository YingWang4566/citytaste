# CityTaste 改版方案：中文主 UI 与轻 3D 交互重整版

> 目标：在保留当前「温柔、克制、杂志感、城市指南」气质的基础上，把 CityTaste 从静态展示页推进成更像真实产品的个人城市探索系统。  
> 本版文档采用中文主方案结构，正文只保留中文主叙述与必要专有名词，英文作品集表述与 agent prompt 统一放到附录。

---

## 1. 项目目标与当前问题

### 1.1 本次改版的核心目标

改版后的 CityTaste 应该让中文用户或国内面试官一眼看明白三件事：

1. 它不是一个只展示上海的演示版，而是一套可扩展的个人城市指南系统。
2. 它不是一张静态展示页，而是可以通过地图、卡片、场景和来源链接持续探索的产品原型。
3. 它不是纯视觉练习，而是有导入、整理、发布、回跳原始内容这条真实内容流的作品集项目。

### 1.2 当前版本值得保留的部分

当前版本已经有比较好的基础气质，不建议推翻重做：

- 米白 + 棕橘色调统一，审美稳定。
- 标题和留白有一定杂志感，适合作品集。
- 首屏已经讲清楚“把散落收藏整理成城市地图”这条故事线。
- 导入、复核、发布这条流程概念已经具备产品原型感。

### 1.3 当前最需要解决的问题

1. `Shanghai Guide` 写得太死，导致项目看起来像单城市演示版。
2. 地图存在感不够强，项目名叫 CityTaste，但地图还不是视觉和交互中心。
3. 卡片、地图、筛选、城市之间缺少联动，页面更像静态排版而不是可探索产品。
4. 局部英文文案偏概念稿，例如抽象产品词过多，不利于中文用户快速理解。
5. `想去 / 已去 / 偏爱` 的状态逻辑不清，既有互斥关系又有收藏行为，容易混乱。
6. 中英文混写缺乏规则，同一层级 UI 会出现标题英文、说明中文、按钮英文、状态中文的情况，影响整体完成度。
7. 吃喝玩乐类内容完全无图会显得单薄，但如果所有卡片都铺大图又会破坏当前克制风格，需要更稳的图片策略。

---

## 2. 改版原则

本次改版不追求一次性堆满所有亮点，而是优先把以下原则做稳。

### 2.1 先做可用，再做炫技

第一轮先把 `可用性 + 语言一致性 + 地图中心性` 做稳。  
轻 3D 和插画化地图可以增强记忆点，但不应该抢走真实功能的戏份。

### 2.2 保留当前审美，不推翻视觉基调

保留当前的温柔米白、焦糖棕橘、圆角留白和杂志化气质。  
改版重点不是换风格，而是在原有风格中加入更明确的交互反馈和层次感。

### 2.3 让地图成为真正的产品中心

CityTaste 的核心不是“地点卡片很多”，而是“地点卡片、地图、筛选、城市和合集会互相联动”。  
如果地图只是装饰，这个项目的产品感会明显变弱。

### 2.4 把内容流讲完整

用户应该能看懂这条链路：

```text
原始收藏 / 笔记
→ 导入工作台
→ 结构化草稿
→ 人工复核
→ 发布到地点卡片
→ 地图探索
→ 回跳原始来源
→ 记录个人状态
```

### 2.5 文案先服务理解，再追求腔调

中文用户和国内面试官首先需要快速理解功能。  
因此正文与 UI 文案优先清楚、自然、直接，减少“只在设计稿里成立”的概念表达。

---

## 3. 语言策略与文案规范

这一章是本次整理新增的执行规范，用来解决中英文夹杂问题。后续页面改版、组件命名与文案替换，都应以这里为基线。

### 3.1 默认语言规则

- 导航、按钮、筛选、状态、表单标题、区块标题、空状态、反馈文案统一使用中文。
- 品牌名保留 `CityTaste`。
- 平台名保留官方常见写法：`小红书 / 抖音 / Google Maps / Instagram`。
- 城市名默认使用中文展示，例如：`上海 / 广州 / 东京 / 首尔 / 新加坡 / 巴黎`。
- 英文城市名仅用于 URL、内部数据字段、附录 prompt，不出现在中文主 UI 的同层级文案中。
- 用户原始输入、来源标题、示例文本可保留中文原文，不做强行翻译。

### 3.2 不推荐的混写方式

以下写法会明显降低完成度，不建议继续使用：

- 同一层级标题英文、说明中文、按钮英文、状态中文。
- 同一组件内中英并列重复显示同一句话。
- 使用文学化中文状态词，同时搭配偏抽象的英文产品词。
- 在中文主页面正文中频繁插入英文 section title。

### 3.3 推荐的保留英文范围

以下内容可以保留英文，不视为“混乱”：

- 品牌名：`CityTaste`
- 平台名：`Google Maps`、`Instagram`
- 技术名词：`URL`、`hover`、`tooltip`、`drawer`、`skeleton`
- 英文作品集表述
- 给 AI agent 的 prompt

### 3.4 中文主 UI 的默认文案方向

推荐把产品界面文案统一到以下方向：

- `Explore Shanghai` → `探索上海`
- `Try Import Studio` → `导入一条收藏`
- `Scene-first entry points` → `按场景探索`
- `A public-facing exploration surface` → `在地图上探索地点`
- `Personal City Guide` → 优先改为 `个人城市指南`

### 3.5 品牌副标题推荐顺序

品牌副标题建议按以下优先级选择：

1. `个人城市指南`
2. `Personal City Guide`
3. 不推荐继续使用 `Shanghai Guide`

---

## 4. 功能优先级与执行顺序

本节保留原来的 `P0 / P1 / P2 / P3` 思路，但改成更明确的执行顺序。  
第一轮不追求把所有亮点都做完，先把 `可用性 + 语言一致性 + 地图中心性` 做稳。

### P0：必须先修

1. 修复原始文本输入框的中文输入，确保输入法 composition 不被打断。
2. 统一状态逻辑与术语，改成 `想去 / 去过 / 收藏`。
3. 去掉 `Shanghai Guide` 这种写死城市的品牌副标题。
4. 清理抽象英文文案，统一中文主 UI。

### P1：核心产品感

1. 加入城市切换。
2. 加强地图与卡片双向联动。
3. 让探索页成为真正的核心产品页。
4. 加入来源链接跳转，保留原始内容语境。

### P2：视觉增强

1. 首页加入小地图或城市快照区域。
2. 地点卡片加入轻微浮起、阴影变化等轻 3D hover。
3. 地图 pin 增加选中反馈与 hover 反馈。
4. 建立精选图 + 缩略图 + fallback 图策略。

### P3：作品集加分项

1. 路线型合集与地图连线。
2. 导入工作台的动画解析流程。
3. 案例页。
4. 等距视角首页插画或后续 Spline 方案。

---

## 5. 页面级改版方案

以下页面建议统一按照 `当前问题 / 改版目标 / 推荐结构 / 关键交互 / 推荐文案` 的格式执行，方便后续直接照着实现。

### 5.1 首页

#### 当前问题

- 首屏的故事线是清楚的，但右侧统计区偏空。
- 品牌仍然带有很强的上海限定感。
- 地图概念存在，但还不够中心。
- 首页文案存在中英文混写，不利于中文主 UI 建立一致性。

#### 改版目标

- 让首页一眼看明白：这是一个把散落收藏整理成城市地图的个人城市指南。
- 从视觉上突出“可切换城市 + 地图探索 + 导入工作流”。
- 保留当前的高级感，但提升真实产品感。

#### 推荐结构

```text
顶部导航：
品牌 + 城市切换 + 导航入口

首屏：
一句主标题
一句产品说明
两个主按钮

右侧信息区：
城市快照 / 小地图 / 核心统计 / 工作流概览

下方内容：
按场景探索
精选地点
如何使用
```

#### 关键交互

- 城市切换后，首屏按钮、统计数字、精选地点、地图预览同步变化。
- 点击“探索上海”进入探索页。
- 点击“导入一条收藏”进入导入工作台。
- 首页小地图可作为探索页的预热入口，但不承担复杂操作。

#### 推荐文案

品牌副标题：

```text
个人城市指南
```

首屏主标题可保留当前结构：

```text
把散落收藏整理成
一张真正可探索的城市地图
```

首屏说明：

```text
CityTaste 把散落在小红书、抖音、Google Maps、聊天记录和备忘录里的吃喝玩乐收藏，整理成可搜索、可筛选、可回跳原始内容的个人城市探索地图。
```

按钮：

```text
探索上海
导入一条收藏
```

区块标题：

```text
按场景探索
精选地点
如何运作
```

### 5.2 探索页

#### 当前问题

- 这是最适合做核心页的页面，但当前地图还没有真正成为产品中心。
- 卡片、地图、筛选之间的联动还不够强。
- 城市切换的作用没有完整体现在探索体验中。

#### 改版目标

- 让探索页成为整个项目最有产品感的页面。
- 让用户通过地图、列表、筛选和城市切换持续探索内容。
- 强化“不是地点列表，而是城市探索界面”的感觉。

#### 推荐结构

```text
顶部：
搜索 + 城市切换 + 分类筛选 + 场景筛选 + 区域筛选

桌面端主体：
左侧地图
右侧地点卡片列表

移动端：
地图 / 列表切换
底部地点抽屉
```

#### 关键交互

1. hover 地点卡片，对应地图 pin 高亮、放大或显示 tooltip。
2. 点击地图 pin，打开地点预览，并让对应卡片进入高亮状态。
3. 切换筛选条件时，地图 pin 和右侧列表同步更新。
4. 切换城市时，地图 fly-to 到对应城市，探索结果同步切换。
5. 点击来源链接可回到原始平台内容。

#### 推荐文案

页面标题：

```text
探索城市地图
```

辅助说明：

```text
按城市、区域、场景和分类浏览地点，并随时回到原始来源查看更完整的信息。
```

筛选：

```text
城市
分类
场景
区域
```

空状态：

```text
这个城市的地点还在整理中。
先看看其他城市，或从导入工作台补充一条收藏。
```

### 5.3 地点详情页

#### 当前问题

- 当前方案里详情页的重要性已经被提到，但结构还不够统一。
- 详情页如果没有主图、状态、来源链接和地图，会显得单薄。
- 详情页是沉淀“为什么推荐这家”的最好位置，需要比卡片更完整。

#### 改版目标

- 让地点详情页承担“深入了解一个地点”的职责。
- 把推荐理由、来源链接、地图位置和个人状态聚合到一起。
- 既能服务真实产品逻辑，也能作为作品集中的完整页面展示。

#### 推荐结构

```text
顶部：
主图 / 地点名称 / 分类 / 区域 / 基本标签

中部：
推荐理由
状态按钮
来源链接
地图位置
补充信息

底部：
相似地点
相关合集
用户评论或备注
```

#### 关键交互

- 点击来源链接，新标签页打开对应平台。
- 切换 `想去 / 去过 / 收藏` 时即时反馈。
- 点击所属合集可跳转到对应合集页或路线页。
- 在详情页地图中保持地点位置可见，强化地理感。

#### 推荐文案

状态区域：

```text
想去
去过
收藏
```

来源区标题：

```text
来源链接
```

推荐理由区标题：

```text
为什么值得去
```

合集区标题：

```text
你还可以继续逛
```

### 5.4 导入工作台

#### 当前问题

- 当前导入工作台的概念是好的，但整体更像展示，而不是一个真的可操作的内容流入口。
- 中文输入问题必须优先解决，否则整个工作流会显得很假。
- 表单与结果预览之间还可以增加更明确的阶段反馈。

#### 改版目标

- 让导入工作台成为作品集中最能体现“AI 辅助工作流”的页面。
- 让用户理解：系统会解析原始收藏，但最终仍然需要人工复核。
- 修复中文输入后，把交互反馈做得更像真实工具。

#### 推荐结构

```text
左侧：
来源 URL
原始文本
平台选择或自动识别
生成草稿按钮

右侧：
结构化草稿预览
城市
区域
分类
标签
摘要
来源链接
待复核字段

底部：
复核与发布操作
```

#### 关键交互

1. 修复中文输入法 composition 期间被打断的问题。
2. 点击“生成草稿”后，先进入解析中状态，再逐步展示结果。
3. 按字段展示解析结果，让“AI 辅助”而不是“一键神奇生成”的逻辑更可信。
4. 发布成功后给出明确反馈，并跳转到对应地点详情页。

#### 推荐文案

页面标题首次写法：

```text
Import Studio（导入工作台）
```

后续简称：

```text
导入工作台
```

表单区标题：

```text
导入原始收藏
```

按钮：

```text
生成草稿
再换一条示例
```

解析中状态：

```text
正在解析这条收藏...
```

解析过程提示：

```text
已识别地点名称
已识别城市
已提取标签
已补充来源链接
等待人工复核
```

### 5.5 案例页

#### 当前问题

- 作品集项目如果只有首页和功能页，叙事深度不够。
- 当前项目已经具备产品思考和工作流故事，缺少一个专门用于讲清楚的页面。

#### 改版目标

- 让案例页承担“向面试官解释这为什么是一个好项目”的任务。
- 用中文清楚讲出问题、目标、信息架构、工作流、交互设计和后续方向。

#### 推荐结构

```text
1. 问题背景
2. 产品目标
3. 用户路径
4. 数据结构
5. AI 辅助导入流程
6. 地图联动设计
7. 界面系统与视觉原则
8. 工程挑战
9. 改版前后对比
10. 后续规划
```

#### 关键交互

- 通过结构图、流程图、前后对比图帮助面试官快速抓住重点。
- 页面内容以说明为主，不需要塞太多互动组件。
- 可加入关键页面截图或小型演示片段。

#### 推荐文案

页面标题：

```text
项目案例
```

副标题：

```text
从碎片化收藏到个人城市地图：CityTaste 的产品与交互改版思路
```

---

## 6. 状态与术语统一

这一章用于给后续实现、文案替换和组件命名提供统一基线。

### 6.1 术语基线表

| 中文主称呼 | 说明 | 英文仅保留场景 |
| --- | --- | --- |
| 城市切换 | 顶部切换当前城市的入口 | 附录 prompt 中可写 `City Switcher` |
| 按场景探索 | 首页或合集入口的区块名 | 附录中可写 `Browse by Scene` |
| 来源链接 | 保留原始平台语境的跳转区 | 附录中可写 `Source Links` |
| 导入工作台 | 原始收藏导入与生成草稿页面 | 首次可写 `Import Studio（导入工作台）` |
| 探索页 | 核心地图 + 卡片页面 | URL 或代码可保留 `explore` |
| 地点详情页 | 单个地点的完整信息页 | URL 或代码可保留 `place detail` |
| 合集页 | 场景合集或路线合集页面 | 附录中可写 `collection page` |
| 案例页 | 作品集叙事页面 | 附录中可写 `case study` |

### 6.2 状态命名基线

统一使用：

```text
想去 / 去过 / 收藏
```

不再建议使用：

```text
已去 / 偏爱
```

### 6.3 状态逻辑基线

- `想去 / 去过` 属于同一维度，必须互斥。
- `收藏` 是独立开关，可以和前两者共存。
- 如果以后扩展“不推荐”或“去过很多次”等状态，应另开规则，不要混入第一版基础按钮里。

### 6.4 来源平台展示基线

推荐顺序：

```text
小红书 / 抖音 / Google Maps / Instagram / 官网
```

卡片上可显示为：

```text
小红书 ↗
抖音 ↗
地图 ↗
官网 ↗
```

---

## 7. 视觉与轻 3D 原则

本节保留原方案里关于轻 3D 的核心判断，但收束成更适合执行的版本。

### 7.1 推荐的 3D 方向

CityTaste 最适合的方向是：

```text
轻 3D 界面 + 等距视角小地图
```

不建议第一轮直接上重 Three.js 或大体量 3D 场景。  
原因很直接：

- 开发成本高
- 移动端性能压力大
- 容易喧宾夺主
- 与真实功能关系不够强

### 7.2 轻 3D 应该用在哪里

推荐把 3D 感控制在“增强交互反馈”的范围内：

- 地点卡片 hover 时轻微上浮、轻微倾斜、阴影加深。
- 地图 pin 在 hover 或选中时放大、发光、轻微弹跳。
- 来源链接按钮在 hover 时上浮一点点。
- 合集卡片像明信片一样有一点层次感。
- 首页右侧城市快照区可以加入等距视角小地图或插画化地图预览。

### 7.3 图片策略

图片需要，但应采用分层策略，而不是全有或全无。

推荐分层：

```text
首页：少量精选图或城市氛围图
探索页：小缩略图 + fallback 图形
详情页：主图 + 来源链接
合集页：路线封面 + 地图
```

### 7.4 如何避免图片破坏当前风格

- 统一图片比例，建议 `4:3` 或 `3:2`。
- 统一圆角，与卡片系统保持一致。
- 降低饱和度，必要时加轻微奶油色覆盖层。
- 没图时使用统一兜底图形，例如 category icon、渐变块、mini map pattern。
- 列表卡片只放一张小图，不要让整页被图片噪声占满。

### 7.5 视觉关键词

中文方向关键词：

```text
城市生活方式指南
米白背景
焦糖棕橘强调
轻 3D 卡片
地图联动
等距城市预览
柔和阴影
移动端优先
克制但有交互
```

---

## 8. 最终结论

CityTaste 这一轮改版最重要的不是“做更多功能”，而是把下面三件事做顺：

1. 让项目从“上海演示版”升级成“可扩展的个人城市指南”。
2. 让地图、卡片、筛选和来源链接形成真正的双向联动。
3. 让中文主 UI、状态逻辑和轻 3D 视觉一起服务于产品理解，而不是互相打架。

一句话总结：

> 保留现在的高级感，补上真实交互；保留克制感，加入轻 3D 层次；保留生活方式气质，让地图真正成为内容组织中心。

---

## 附录 A：作品集英文表述

### A.1 项目总述

> CityTaste is a portfolio-first personal city guide that turns saved posts, chats, maps, and raw notes into structured place cards and a map-based exploration experience.

### A.2 城市切换

> I reframed the project from a Shanghai-only demo into a scalable city guide system. Instead of hard-coding one city into the brand, I introduced a city-switching model that can update the hero, map center, featured places, and collections together.

### A.3 地图与卡片联动

> I made the map the center of the exploration experience. Hovering a place card highlights its map pin, clicking a pin opens a preview, and filters update both the map and the list in real time.

### A.4 场景化探索

> Instead of forcing users to browse only by category, I added scene-based entry points such as rainy-day cafes, weekend walks, and first-date routes. This better matches how people actually plan a day in the city.

### A.5 来源链接

> Each place preserves its original context through source links. Users can jump back to Xiaohongshu, Douyin, Google Maps, or official websites to view richer context such as videos, comments, menus, and real-time updates.

### A.6 AI 辅助导入流程

> The Import Studio demonstrates an AI-assisted workflow: users paste raw notes or saved post text, the system generates a structured draft, and the owner reviews the fields before publishing the place into the public guide.

---

## 附录 B：给 AI agent 的执行提示

### B.1 长版本 Prompt

```text
I want to improve the current CityTaste project into a more interactive, portfolio-quality personal city guide for Chinese-speaking users and domestic interview reviewers.

Core positioning:
CityTaste turns saved posts and raw notes from Xiaohongshu, Douyin, Google Maps, chats, and personal notes into structured place cards and an interactive city map.

Important language direction:
- The main UI language should be Chinese.
- Keep the brand name as "CityTaste".
- Keep platform names in their common forms, such as Xiaohongshu, Douyin, Google Maps, and Instagram.
- English should only appear in technical contexts, URLs, internal data fields, or portfolio appendix content.
- Avoid mixed same-level UI such as English titles with Chinese descriptions and English buttons next to Chinese states.

Main redesign goals:
1. Remove Shanghai-only branding.
   - Replace "Shanghai Guide" with either "个人城市指南" or "Personal City Guide".
   - Add a city switcher.
   - Start with Shanghai and Guangzhou, and leave room for more cities later.
   - When switching city, update hero copy, stats, featured places, collections, and map center.

2. Make the map feel central and interactive.
   - Make the Explore page the core product page.
   - Use a map + place card list layout.
   - Hovering a card should highlight its map pin.
   - Clicking a map pin should open a place preview and highlight the related card.
   - Filters should update both the map and the card list.
   - Changing city should fly the map to the new city center.

3. Fix Chinese input in the raw text textarea.
   - Ensure IME composition works correctly.
   - Do not submit or parse while composition is active.
   - Check onCompositionStart / onCompositionEnd.
   - Avoid interrupting normal textarea input behavior.

4. Improve state logic and naming.
   - Replace the old state labels with: 想去 / 去过 / 收藏.
   - 想去 and 去过 are mutually exclusive.
   - 收藏 is a separate toggle.
   - Do not use vague literary labels like 偏爱.

5. Rewrite the UI copy in Chinese.
   - Replace awkward conceptual phrases with natural Chinese product copy.
   - Use Chinese for navigation, buttons, section titles, states, filters, and feedback text.
   - Keep the tone warm, calm, and editorial, but easier to understand.

6. Add lightweight 3D interaction without overbuilding.
   - Add subtle card lift, shadow, and perspective on hover.
   - Add animated map pins with bounce or glow on hover/selection.
   - Add an isometric or stylized mini map preview to the home page if feasible.
   - Avoid heavy Three.js unless there is a strong reason.

7. Use a balanced image strategy.
   - Home and detail pages can use a limited number of images.
   - Explore list cards should use small thumbnails or elegant category fallbacks.
   - Keep image treatment consistent to avoid clutter.

Implementation priorities:
- P0: fix Chinese input, unify language, unify state naming, remove Shanghai-only branding.
- P1: add city switching, map-card interaction, source links, and make Explore the core page.
- P2: add lightweight 3D and image improvements.
- P3: add route-based collections, animated import workflow, case study page, and optional isometric hero.

Please inspect the current project first, identify the relevant components, and then implement the changes incrementally while preserving the warm cream and burnt orange editorial style.
```

### B.2 短版本 Prompt

```text
Improve CityTaste into a more interactive, portfolio-quality personal city guide with a Chinese-first UI.

Key changes:
- Remove Shanghai-only branding.
- Use Chinese as the main UI language.
- Keep the brand name as CityTaste.
- Add city switching and update hero, stats, places, collections, and map center together.
- Make the Explore page map-centered: map + place cards, card hover highlights pin, pin click opens preview.
- Fix Chinese IME input in the raw text textarea.
- Replace state labels with: 想去 / 去过 / 收藏.
- Rewrite awkward English UI copy into natural Chinese copy.
- Add light 3D UI: subtle card lift, soft shadows, animated pins, optional mini map preview.
- Use a balanced image strategy.
- Keep the warm cream + burnt orange editorial style.

Inspect the project first, then implement incrementally.
```

---

## 附录 C：视觉关键词

### C.1 英文关键词

```text
editorial city guide
warm cream background
burnt orange accent
soft 3D cards
isometric city map
subtle shadows
mobile-first
map-centered interaction
lifestyle magazine
calm but interactive
```

### C.2 中文关键词

```text
城市生活方式指南
米白背景
焦糖棕橘强调
轻 3D 卡片
等距城市地图
柔和阴影
移动端优先
地图联动
杂志感
克制但有交互
```

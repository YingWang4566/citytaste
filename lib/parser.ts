import { CITY_AREAS, DEFAULT_CITY } from "@/lib/constants"
import {
  buildSearchPlatformUrl,
  buildSourceLink,
  getAreaCoordinates,
  normalizeCitySlug,
  slugify,
} from "@/lib/place-utils"
import type {
  Category,
  CitySlug,
  ParsedPlaceDraft,
  SourcePlatform,
  SubmissionDraft,
} from "@/lib/types"

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  food: ["餐厅", "面", "饭", "brunch", "bistro", "restaurant", "小馆", "酒馆"],
  cafe: ["咖啡", "cafe", "latte", "espresso", "甜点", "手冲"],
  bar: ["bar", "酒吧", "cocktail", "鸡尾酒", "wine", "speakeasy"],
  shopping: ["买手", "书店", "shop", "store", "器物", "家居", "礼物"],
  activity: ["骑行", "散步", "跑步", "walk", "ride", "market", "活动", "路线"],
  exhibition: ["展", "画廊", "museum", "gallery", "摄影", "展览", "美术馆"],
}

const VIBE_KEYWORDS = [
  "安静",
  "约会",
  "夜景",
  "适合工作",
  "适合拍照",
  "雨天",
  "散步",
  "落日",
  "周末",
  "一个人",
]

function detectPlatform(rawText: string, sourceUrl?: string): SourcePlatform {
  const source = `${rawText} ${sourceUrl ?? ""}`.toLowerCase()

  if (source.includes("xiaohongshu") || source.includes("小红书")) {
    return "xiaohongshu"
  }

  if (source.includes("douyin") || source.includes("抖音")) {
    return "douyin"
  }

  if (source.includes("instagram") || source.includes("ig")) {
    return "instagram"
  }

  if (source.includes("google.com/maps") || source.includes("maps")) {
    return "google_maps"
  }

  return "manual"
}

function detectCategory(rawText: string): Category {
  const normalized = rawText.toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as Array<
    [Category, string[]]
  >) {
    if (keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) {
      return category
    }
  }

  return "cafe"
}

function detectCity(rawText: string, sourceUrl?: string): CitySlug {
  const source = `${rawText} ${sourceUrl ?? ""}`
  const guangzhouAreas = Object.keys(CITY_AREAS.guangzhou ?? {})
  const shanghaiAreas = Object.keys(CITY_AREAS.shanghai ?? {})

  if (
    source.includes("广州") ||
    source.toLowerCase().includes("guangzhou") ||
    guangzhouAreas.some((area) => source.includes(area))
  ) {
    return "guangzhou"
  }

  if (
    source.includes("上海") ||
    source.toLowerCase().includes("shanghai") ||
    shanghaiAreas.some((area) => source.includes(area))
  ) {
    return "shanghai"
  }

  return DEFAULT_CITY
}

function detectArea(rawText: string, city: CitySlug) {
  const cityAreas = Object.keys(CITY_AREAS[city] ?? {})

  return (
    cityAreas.find((area) => rawText.includes(area)) ??
    cityAreas[0] ??
    "待确认区域"
  )
}

function detectTags(rawText: string) {
  const hashtagMatches = [...rawText.matchAll(/#([^\s#]+)/g)].map((match) =>
    match[1].trim(),
  )
  const vibeMatches = VIBE_KEYWORDS.filter((keyword) => rawText.includes(keyword))

  return Array.from(new Set([...hashtagMatches, ...vibeMatches])).slice(0, 5)
}

function inferName(rawText: string) {
  const firstLine = rawText
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean)

  if (!firstLine) return "未命名地点"

  return firstLine
    .replace(/^[0-9]+[.)、]\s*/, "")
    .replace(/^[-*]\s*/, "")
    .split(/[，,:：\-|]/)[0]
    .trim()
}

function inferSummary(rawText: string) {
  const condensed = rawText
    .replace(/\s+/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .trim()

  if (!condensed) {
    return "从碎片收藏里整理出来的一处新地点。"
  }

  return condensed.slice(0, 72)
}

export function parseSubmissionDraft(rawText: string, sourceUrl?: string) {
  const name = inferName(rawText)
  const city = normalizeCitySlug(detectCity(rawText, sourceUrl))
  const category = detectCategory(rawText)
  const area = detectArea(rawText, city)
  const coordinates = getAreaCoordinates(area, city)
  const platform = detectPlatform(rawText, sourceUrl)
  const tags = detectTags(rawText)

  const parsedPlace: ParsedPlaceDraft = {
    name,
    slug: slugify(name),
    category,
    city,
    area,
    address: `${area} · 待补充详细地址`,
    lat: coordinates.lat,
    lng: coordinates.lng,
    priceLevel: "$$",
    tags,
    vibes: tags.map((tag) => tag.toLowerCase()),
    summary: inferSummary(rawText),
    description: rawText.trim(),
    statusDefault: "want_to_go",
    collectionIds: [],
    sourceLinks: [
      buildSourceLink(
        platform,
        `${platform === "manual" ? "手动导入" : "原始来源"}`,
        sourceUrl ?? buildSearchPlatformUrl(platform, name, city),
      ),
    ],
  }

  const draft: SubmissionDraft = {
    id: `draft-${crypto.randomUUID()}`,
    rawText,
    sourcePlatform: platform,
    sourceUrl,
    parsedPlace,
    reviewStatus: "pending",
    reviewNotes: "",
    createdAt: new Date().toISOString(),
  }

  return { draft, preview: parsedPlace }
}

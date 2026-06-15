import type {
  Category,
  CitySlug,
  Coordinates,
  LocalVisitState,
  SourcePlatform,
} from "@/lib/types"

export type CityGroupKey = "china" | "international"

export type CityMeta = {
  label: string
  center: Coordinates
  subtitle: string
  group: CityGroupKey
  available: boolean
  aliases: string[]
}

export const DEFAULT_CITY: CitySlug = "shanghai"

export const CITY_META: Record<CitySlug, CityMeta> = {
  shanghai: {
    label: "上海",
    center: { lat: 31.2304, lng: 121.4737 },
    subtitle: "梧桐树影、江边夜色和慢一点的周末路线",
    group: "china",
    available: true,
    aliases: ["shanghai", "上海"],
  },
  guangzhou: {
    label: "广州",
    center: { lat: 23.1291, lng: 113.2644 },
    subtitle: "骑楼、江风、糖水和夜生活一起组成的城市节奏",
    group: "china",
    available: true,
    aliases: ["guangzhou", "广州"],
  },
  beijing: {
    label: "北京",
    center: { lat: 39.9042, lng: 116.4074 },
    subtitle: "胡同、展览馆、公园与城市日常，内容仍在准备中",
    group: "china",
    available: false,
    aliases: ["beijing", "北京"],
  },
  hangzhou: {
    label: "杭州",
    center: { lat: 30.2741, lng: 120.1551 },
    subtitle: "西湖、街巷和更松弛的周末动线，内容仍在准备中",
    group: "china",
    available: false,
    aliases: ["hangzhou", "杭州"],
  },
  tokyo: {
    label: "东京",
    center: { lat: 35.6762, lng: 139.6503 },
    subtitle: "街区密度、审美细节和节奏分层，内容仍在准备中",
    group: "international",
    available: false,
    aliases: ["tokyo", "东京"],
  },
  seoul: {
    label: "首尔",
    center: { lat: 37.5665, lng: 126.978 },
    subtitle: "坡道、夜生活与视觉文化，内容仍在准备中",
    group: "international",
    available: false,
    aliases: ["seoul", "首尔"],
  },
  singapore: {
    label: "新加坡",
    center: { lat: 1.3521, lng: 103.8198 },
    subtitle: "热带城市、购物与公共空间体验，内容仍在准备中",
    group: "international",
    available: false,
    aliases: ["singapore", "新加坡"],
  },
  paris: {
    label: "巴黎",
    center: { lat: 48.8566, lng: 2.3522 },
    subtitle: "街角咖啡馆、博物馆和慢速步行，内容仍在准备中",
    group: "international",
    available: false,
    aliases: ["paris", "巴黎"],
  },
}

export const CITY_OPTIONS = Object.keys(CITY_META) as CitySlug[]

export const CITY_GROUPS: Array<{
  key: CityGroupKey
  label: string
  cities: CitySlug[]
}> = [
  {
    key: "china",
    label: "中国城市",
    cities: ["shanghai", "guangzhou", "beijing", "hangzhou"],
  },
  {
    key: "international",
    label: "国际城市",
    cities: ["tokyo", "seoul", "singapore", "paris"],
  },
]

export const READY_CITY_OPTIONS = CITY_OPTIONS.filter((city) => CITY_META[city]?.available)

export const CITY_AREAS: Partial<Record<CitySlug, Record<string, Coordinates>>> = {
  shanghai: {
    安福路: { lat: 31.2141, lng: 121.4468 },
    武康路: { lat: 31.2104, lng: 121.4378 },
    愚园路: { lat: 31.2245, lng: 121.4281 },
    静安寺: { lat: 31.2232, lng: 121.4456 },
    西岸: { lat: 31.1755, lng: 121.4499 },
    北外滩: { lat: 31.2512, lng: 121.5013 },
    新天地: { lat: 31.2183, lng: 121.4736 },
    苏河湾: { lat: 31.2442, lng: 121.4705 },
    衡山路: { lat: 31.2062, lng: 121.4402 },
    哥伦比亚圈: { lat: 31.2113, lng: 121.4158 },
  },
  guangzhou: {
    东山口: { lat: 23.1197, lng: 113.2956 },
    珠江新城: { lat: 23.1181, lng: 113.3276 },
    永庆坊: { lat: 23.1161, lng: 113.2384 },
    北京路: { lat: 23.1256, lng: 113.2707 },
    天河南: { lat: 23.1365, lng: 113.3278 },
    沙面: { lat: 23.1089, lng: 113.2437 },
    海珠广场: { lat: 23.1165, lng: 113.2683 },
    琶醍: { lat: 23.1009, lng: 113.3456 },
  },
}

export const CATEGORY_META: Record<
  Category,
  { label: string; emoji: string; tint: string; description: string }
> = {
  food: {
    label: "餐食",
    emoji: "🍽️",
    tint: "from-amber-200 via-orange-200 to-rose-200",
    description: "从热气腾腾的面馆到值得绕路的一顿饭",
  },
  cafe: {
    label: "咖啡",
    emoji: "☕",
    tint: "from-stone-200 via-zinc-100 to-amber-100",
    description: "适合下雨、写字、发呆与约见朋友的咖啡馆",
  },
  bar: {
    label: "酒吧",
    emoji: "🍷",
    tint: "from-rose-200 via-fuchsia-100 to-purple-100",
    description: "夜色、灯光、低语和一点点留白",
  },
  shopping: {
    label: "逛买",
    emoji: "👜",
    tint: "from-emerald-200 via-teal-100 to-cyan-100",
    description: "设计小店、书店、器物与风格样本",
  },
  activity: {
    label: "活动",
    emoji: "🚶",
    tint: "from-lime-200 via-green-100 to-emerald-100",
    description: "散步、骑行、周末集市与城市里的轻运动",
  },
  exhibition: {
    label: "展览",
    emoji: "🖼️",
    tint: "from-sky-200 via-blue-100 to-indigo-100",
    description: "值得专门留出半天的视觉和文化体验",
  },
}

export const PLATFORM_META: Record<
  SourcePlatform,
  { label: string; shortLabel: string; emoji: string }
> = {
  xiaohongshu: { label: "小红书", shortLabel: "小红书", emoji: "📕" },
  douyin: { label: "抖音", shortLabel: "抖音", emoji: "🎬" },
  google_maps: { label: "Google Maps", shortLabel: "地图", emoji: "🗺️" },
  instagram: { label: "Instagram", shortLabel: "IG", emoji: "📷" },
  official: { label: "官方网站", shortLabel: "官网", emoji: "↗" },
  manual: { label: "手动整理", shortLabel: "手记", emoji: "✍️" },
}

export const STATUS_META: Record<
  keyof LocalVisitState,
  { label: string; emoji: string }
> = {
  want_to_go: { label: "想去", emoji: "📍" },
  visited: { label: "去过", emoji: "✓" },
  favorite: { label: "收藏", emoji: "♥" },
}

export const DEFAULT_VISIT_STATE: LocalVisitState = {
  want_to_go: false,
  visited: false,
  favorite: false,
}

export const OWNER_COOKIE = "citytaste_owner"

export const OWNER_PASSWORD =
  process.env.CITYTASTE_OWNER_PASSWORD ?? "citytaste-owner"

import {
  CATEGORY_META,
  CITY_AREAS,
  CITY_META,
  CITY_OPTIONS,
  DEFAULT_CITY,
  PLATFORM_META,
  STATUS_META,
} from "@/lib/constants"
import type {
  Category,
  CitySlug,
  Collection,
  ExploreFilters,
  Place,
  SourceLink,
  SourcePlatform,
} from "@/lib/types"

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/["'’]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ")
}

export function normalizeCitySlug(city?: string | null): CitySlug {
  if (!city) return DEFAULT_CITY

  const normalized = city.trim().toLowerCase()

  for (const citySlug of CITY_OPTIONS) {
    const cityMeta = CITY_META[citySlug]
    if (!cityMeta) continue

    if (citySlug === normalized) {
      return citySlug
    }

    if (cityMeta.aliases.some((alias) => alias.toLowerCase() === normalized)) {
      return citySlug
    }
  }

  return DEFAULT_CITY
}

export function getCityMeta(city: CitySlug) {
  return CITY_META[city] ?? CITY_META[DEFAULT_CITY]
}

export function getCityLabel(city: CitySlug) {
  return getCityMeta(city).label
}

export function getCityCenter(city: CitySlug = DEFAULT_CITY) {
  return getCityMeta(city).center
}

export function getCityAreas(city: CitySlug) {
  return Object.keys(CITY_AREAS[city] ?? {})
}

export function isCityAvailable(city: CitySlug) {
  return Boolean(CITY_META[city]?.available)
}

export function inferSourcePlatformFromUrl(url?: string): SourcePlatform {
  if (!url) return "manual"

  const input = url.trim().toLowerCase()

  if (input.includes("xiaohongshu") || input.includes("xhslink")) {
    return "xiaohongshu"
  }

  if (input.includes("douyin")) {
    return "douyin"
  }

  if (input.includes("google.") || input.includes("goo.gl/maps") || input.includes("maps.app")) {
    return "google_maps"
  }

  if (input.includes("instagram")) {
    return "instagram"
  }

  return "official"
}

export function buildSourceLink(
  platform: SourcePlatform,
  label: string,
  url: string,
): SourceLink {
  return {
    id: `${platform}-${slugify(label)}-${Math.random().toString(36).slice(2, 7)}`,
    platform,
    label,
    url,
  }
}

export function buildSearchPlatformUrl(
  platform: SourcePlatform,
  term: string,
  city: CitySlug = DEFAULT_CITY,
) {
  const query = encodeURIComponent(`${term} ${getCityLabel(city)}`)

  switch (platform) {
    case "xiaohongshu":
      return `https://www.xiaohongshu.com/search_result?keyword=${query}`
    case "douyin":
      return `https://www.douyin.com/search/${query}`
    case "google_maps":
      return `https://www.google.com/maps/search/?api=1&query=${query}`
    case "instagram":
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(
        term.replace(/\s+/g, ""),
      )}/`
    case "official":
      return `https://www.google.com/search?q=${query}`
    case "manual":
      return "https://www.notion.so/"
  }
}

export function buildDefaultSourceLinks(
  name: string,
  city: CitySlug = DEFAULT_CITY,
) {
  return [
    buildSourceLink(
      "xiaohongshu",
      "小红书灵感",
      buildSearchPlatformUrl("xiaohongshu", name, city),
    ),
    buildSourceLink(
      "douyin",
      "抖音视频",
      buildSearchPlatformUrl("douyin", name, city),
    ),
    buildSourceLink(
      "google_maps",
      "Google Maps",
      buildSearchPlatformUrl("google_maps", name, city),
    ),
    buildSourceLink(
      "official",
      "官方网站",
      buildSearchPlatformUrl("official", name, city),
    ),
  ]
}

export function getAreaCoordinates(
  area?: string,
  city: CitySlug = DEFAULT_CITY,
) {
  const areaMap = CITY_AREAS[city] ?? {}

  if (!area) return getCityCenter(city)
  if (areaMap[area]) return areaMap[area]

  for (const cityKey of CITY_OPTIONS) {
    const fallbackAreaMap = CITY_AREAS[cityKey] ?? {}
    if (fallbackAreaMap[area]) return fallbackAreaMap[area]
  }

  return getCityCenter(city)
}

export function getCategoryLabel(category: Category) {
  return CATEGORY_META[category].label
}

export function getPlatformLabel(platform: SourcePlatform) {
  return PLATFORM_META[platform].label
}

export function localizeCityLabel(city: string) {
  return getCityLabel(normalizeCitySlug(city))
}

export function getPlaceGradient(place: Place) {
  const base = CATEGORY_META[place.category].tint
  const accent =
    place.category === "bar"
      ? "from-black/10 via-transparent to-white/30"
      : "from-white/50 via-transparent to-black/10"

  return `bg-gradient-to-br ${base} ${accent}`
}

export function humanizePrice(priceLevel: Place["priceLevel"]) {
  if (priceLevel === "$") return "轻松"
  if (priceLevel === "$$") return "适中"
  return "值得认真安排"
}

export function filterPlaces(
  places: Place[],
  filters: ExploreFilters,
  visitStateBySlug: Record<string, Record<string, boolean>>,
) {
  const query = filters.query.trim().toLowerCase()

  return places.filter((place) => {
    if (filters.category !== "all" && place.category !== filters.category) {
      return false
    }

    if (filters.area !== "all" && place.area !== filters.area) {
      return false
    }

    if (filters.status !== "all" && !visitStateBySlug[place.slug]?.[filters.status]) {
      return false
    }

    if (!query) return true

    const haystack = [
      place.name,
      getCityLabel(place.city),
      place.area,
      place.summary,
      place.description,
      place.tags.join(" "),
      place.vibes.join(" "),
      CATEGORY_META[place.category].label,
    ]
      .join(" ")
      .toLowerCase()

    return haystack.includes(query)
  })
}

export function getCollectionPlaces(places: Place[], collection: Collection) {
  return places.filter((place) => collection.placeIds.includes(place.id))
}

export function pickRelatedPlaces(places: Place[], place: Place) {
  return places
    .filter((candidate) => candidate.id !== place.id)
    .filter((candidate) => candidate.city === place.city)
    .filter(
      (candidate) =>
        candidate.category === place.category ||
        candidate.area === place.area ||
        candidate.collectionIds.some((collectionId) =>
          place.collectionIds.includes(collectionId),
        ),
    )
    .slice(0, 3)
}

export function formatPublishDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function getHostnameLabel(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function getStatusText(key: keyof typeof STATUS_META) {
  return `${STATUS_META[key].emoji} ${STATUS_META[key].label}`
}

export function dedupePlaces(places: Place[]) {
  return Array.from(new Map(places.map((place) => [place.slug, place])).values())
}

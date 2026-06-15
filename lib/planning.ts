import { CATEGORY_META } from "@/lib/constants"
import { getCityCenter, getCityLabel } from "@/lib/place-utils"
import type {
  Category,
  CitySlug,
  Collection,
  MoodChip,
  Place,
  ScenePlan,
  TimeOfDay,
} from "@/lib/types"

export const MOOD_CHIP_META: Record<
  MoodChip,
  {
    label: string
    hint: string
    keywords: string[]
    preferredCategories: Category[]
    preferredTags: string[]
    preferredVibes: string[]
  }
> = {
  relaxed: {
    label: "放松",
    hint: "慢一点、好停留、适合 citywalk",
    keywords: ["放松", "relaxed", "chill", "citywalk", "散步", "慢一点", "无聊"],
    preferredCategories: ["cafe", "activity", "food", "shopping"],
    preferredTags: ["街景位", "适合聊天", "适合看书", "城市路线", "散步"],
    preferredVibes: ["quiet", "weekend", "people-watching", "fresh-air", "curated"],
  },
  date: {
    label: "约会",
    hint: "更有节奏感，适合从傍晚排到夜里",
    keywords: ["约会", "date", "情侣", "两个人", "浪漫"],
    preferredCategories: ["exhibition", "food", "bar", "cafe"],
    preferredTags: ["约会", "露台", "夜景", "摄影"],
    preferredVibes: ["moody", "night-view", "dramatic", "minimal"],
  },
  rainy_day: {
    label: "雨天",
    hint: "适合有窗景、可停留、节奏更慢的点",
    keywords: ["雨", "下雨", "雨天", "rainy", "阴天"],
    preferredCategories: ["cafe", "exhibition", "food"],
    preferredTags: ["靠窗位", "适合工作", "书架"],
    preferredVibes: ["rainy-day", "quiet", "editorial"],
  },
  photo_friendly: {
    label: "出片",
    hint: "视觉感、空间感和拍照体验更强",
    keywords: ["出片", "拍照", "photo", "摄影", "好看", "ins 风"],
    preferredCategories: ["exhibition", "shopping", "cafe", "bar"],
    preferredTags: ["摄影", "器物", "建筑", "礼物灵感"],
    preferredVibes: ["design", "editorial", "minimal", "soft-color"],
  },
  solo: {
    label: "独处",
    hint: "低刺激、可独自停留、不会有压力",
    keywords: ["一个人", "独处", "solo", "alone", "自己逛"],
    preferredCategories: ["cafe", "activity", "food", "exhibition"],
    preferredTags: ["适合看书", "适合工作", "晨间"],
    preferredVibes: ["quiet", "study", "fresh-air", "comfort"],
  },
  friends: {
    label: "朋友局",
    hint: "适合一起吃、一起走、一起继续续摊",
    keywords: ["朋友", "friends", "聚会", "一起", "hangout"],
    preferredCategories: ["food", "activity", "bar", "shopping"],
    preferredTags: ["适合聊天", "深夜友好", "城市路线"],
    preferredVibes: ["community", "glam", "weekend", "active"],
  },
}

const TIME_KEYWORDS: Record<TimeOfDay, string[]> = {
  morning: ["早上", "上午", "morning", "brunch", "晨间"],
  afternoon: ["下午", "afternoon", "白天", "午后"],
  evening: ["傍晚", "晚餐", "dinner", "sunset", "evening"],
  night: ["晚上", "夜里", "深夜", "night", "late", "酒吧"],
}

function containsAny(haystack: string, keywords: string[]) {
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))
}

function getTimeBoost(place: Place, timeOfDay: TimeOfDay) {
  const categoryBoost: Record<TimeOfDay, Partial<Record<Category, number>>> = {
    morning: { cafe: 3, activity: 3, food: 1 },
    afternoon: { cafe: 3, exhibition: 3, shopping: 2, activity: 2 },
    evening: { exhibition: 2, food: 3, bar: 1, shopping: 1 },
    night: { bar: 4, food: 2, cafe: 1 },
  }

  let score = categoryBoost[timeOfDay][place.category] ?? 0

  const combined = `${place.tags.join(" ")} ${place.vibes.join(" ")}`.toLowerCase()

  if (timeOfDay === "night" && containsAny(combined, ["late-night", "night-view", "深夜", "夜景"])) {
    score += 2
  }

  if (timeOfDay === "morning" && containsAny(combined, ["晨间", "morning", "fresh-air"])) {
    score += 2
  }

  return score
}

function getRouteBucket(place: Place) {
  const vibeText = `${place.tags.join(" ")} ${place.vibes.join(" ")}`.toLowerCase()

  if (place.category === "bar" || containsAny(vibeText, ["late-night", "night-view", "深夜", "夜景"])) {
    return 2
  }

  if (place.category === "food") {
    return 1
  }

  return 0
}

function distanceBetween(a: Place, b: Place) {
  return Math.hypot(a.lat - b.lat, a.lng - b.lng)
}

function distanceToCityCenter(place: Place) {
  const center = getCityCenter(place.city)
  return Math.hypot(place.lat - center.lat, place.lng - center.lng)
}

function scorePlaceForMood(place: Place, mood: MoodChip) {
  const moodMeta = MOOD_CHIP_META[mood]
  const searchable = [
    place.name,
    place.area,
    place.summary,
    place.description,
    ...place.tags,
    ...place.vibes,
  ]
    .join(" ")
    .toLowerCase()

  let score = 0

  if (moodMeta.preferredCategories.includes(place.category)) {
    score += 4
  }

  if (containsAny(searchable, moodMeta.preferredTags.map((tag) => tag.toLowerCase()))) {
    score += 3
  }

  if (containsAny(searchable, moodMeta.preferredVibes.map((vibe) => vibe.toLowerCase()))) {
    score += 3
  }

  return score
}

function scorePromptMatch(place: Place, prompt: string) {
  if (!prompt.trim()) return 0

  const searchable = [
    place.name,
    place.area,
    place.address,
    CATEGORY_META[place.category].label,
    place.summary,
    place.description,
    ...place.tags,
    ...place.vibes,
  ]
    .join(" ")
    .toLowerCase()

  const tokens = prompt
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fa5]+/)
    .filter((token) => token.length >= 2)

  return tokens.reduce((total, token) => total + (searchable.includes(token) ? 2 : 0), 0)
}

export function inferSceneMoods(input: string, selectedMoods: MoodChip[]) {
  const normalizedInput = input.trim().toLowerCase()
  const inferredMoods = Object.entries(MOOD_CHIP_META)
    .filter(([, moodMeta]) => containsAny(normalizedInput, moodMeta.keywords))
    .map(([mood]) => mood as MoodChip)

  return Array.from(new Set([...selectedMoods, ...inferredMoods]))
}

export function inferTimeOfDay(input: string): TimeOfDay {
  const normalizedInput = input.trim().toLowerCase()

  for (const [timeOfDay, keywords] of Object.entries(TIME_KEYWORDS) as Array<
    [TimeOfDay, string[]]
  >) {
    if (containsAny(normalizedInput, keywords)) {
      return timeOfDay
    }
  }

  return "afternoon"
}

export function orderRoutePlaces(places: Place[]) {
  if (places.length <= 1) {
    return places
  }

  const buckets = new Map<number, Place[]>()

  for (const place of places) {
    const bucket = getRouteBucket(place)
    const current = buckets.get(bucket) ?? []
    current.push(place)
    buckets.set(bucket, current)
  }

  const orderedBuckets = Array.from(buckets.entries()).sort((a, b) => a[0] - b[0])
  const ordered: Place[] = []

  for (const [, bucketPlaces] of orderedBuckets) {
    const remaining = [...bucketPlaces].sort((a, b) => distanceToCityCenter(a) - distanceToCityCenter(b))
    let current = remaining.shift()

    while (current) {
      ordered.push(current)

      if (!remaining.length) {
        break
      }

      const anchor = current

      remaining.sort((a, b) => {
        const scoreA = (a.area === anchor.area ? -2.5 : 0) + distanceBetween(anchor, a) * 180
        const scoreB = (b.area === anchor.area ? -2.5 : 0) + distanceBetween(anchor, b) * 180
        return scoreA - scoreB
      })

      current = remaining.shift()
    }
  }

  return ordered
}

function getPreferredCategories(moods: MoodChip[]) {
  return Array.from(
    new Set(moods.flatMap((mood) => MOOD_CHIP_META[mood].preferredCategories)),
  )
}

function pickScenePlaces(scoredPlaces: Array<{ place: Place; score: number }>, moods: MoodChip[]) {
  const selected: Place[] = []
  const usedAreas = new Map<string, number>()
  const preferredCategories = getPreferredCategories(moods)

  const trySelect = (candidate?: Place) => {
    if (!candidate) return false
    if (selected.some((place) => place.id === candidate.id)) return false

    const areaCount = usedAreas.get(candidate.area) ?? 0
    if (areaCount >= 2 && selected.length >= 2) {
      return false
    }

    selected.push(candidate)
    usedAreas.set(candidate.area, areaCount + 1)
    return true
  }

  for (const category of preferredCategories) {
    const candidate = scoredPlaces.find(({ place }) => place.category === category)?.place
    trySelect(candidate)

    if (selected.length >= 4) {
      break
    }
  }

  for (const { place } of scoredPlaces) {
    if (selected.length >= 4) {
      break
    }

    trySelect(place)
  }

  return selected.length ? selected : scoredPlaces.slice(0, 4).map(({ place }) => place)
}

export function matchPlacesForScene(
  places: Place[],
  city: CitySlug,
  moods: MoodChip[],
  input: string,
  timeOfDay: TimeOfDay,
) {
  return places
    .filter((place) => place.city === city)
    .map((place) => {
      let score = 1

      for (const mood of moods) {
        score += scorePlaceForMood(place, mood)
      }

      score += scorePromptMatch(place, input)
      score += getTimeBoost(place, timeOfDay)

      return { place, score }
    })
    .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name))
}

function buildSceneTitle(city: CitySlug, moods: MoodChip[], timeOfDay: TimeOfDay) {
  const cityLabel = getCityLabel(city)

  if (moods.includes("date")) return `${cityLabel}约会路线`
  if (moods.includes("rainy_day")) return `${cityLabel}雨天计划`
  if (moods.includes("photo_friendly")) return `${cityLabel}出片路线`
  if (moods.includes("friends")) return `${cityLabel}朋友局半日安排`
  if (moods.includes("solo")) return `${cityLabel}一个人的慢逛路线`
  if (moods.includes("relaxed")) return `${cityLabel}轻松 citywalk`

  if (timeOfDay === "night") return `${cityLabel}今晚怎么逛`
  if (timeOfDay === "morning") return `${cityLabel}早晨轻计划`

  return `${cityLabel}今天怎么逛`
}

function buildSceneDescription(
  city: CitySlug,
  moods: MoodChip[],
  places: Place[],
  routeSummary: string,
) {
  const cityLabel = getCityLabel(city)
  const moodLabels = moods.map((mood) => MOOD_CHIP_META[mood].label).slice(0, 2).join(" / ")
  const opening = places[0]?.name
  const ending = places.at(-1)?.name

  if (opening && ending) {
    return `按照${moodLabels || "今天的状态"}，先从 ${opening} 开场，再一路走到 ${ending} 收尾。路线会优先把同一区域和更顺路的地点串在一起。`
  }

  return `这是为${cityLabel}生成的一条轻量路线，优先考虑同一区域、顺路移动和更自然的节奏。${routeSummary ? ` 推荐路径：${routeSummary}。` : ""}`
}

export function buildRouteSummary(places: Place[]) {
  return Array.from(new Set(places.map((place) => place.area))).join(" → ")
}

export function getRouteStepLabel(index: number) {
  return String.fromCharCode(65 + index)
}

export function getRouteMomentLabel(place: Place, index: number, total: number) {
  if (index === 0) return "开场"
  if (index === total - 1) return place.category === "bar" ? "夜晚收尾" : "收尾"
  if (place.category === "food") return "补给"
  if (place.category === "bar") return "夜场"
  if (place.category === "activity") return "走走"
  return "继续逛"
}

export function getCollectionKindLabel(kind?: Collection["kind"]) {
  return kind === "personal_plan" ? "个人路线" : "场景合集"
}

export function findClosestCollection(collections: Collection[], places: Place[], moods: MoodChip[]) {
  const selectedPlaceIds = new Set(places.map((place) => place.id))

  return collections
    .map((collection) => {
      const overlap = collection.placeIds.filter((placeId) => selectedPlaceIds.has(placeId)).length
      const moodOverlap = collection.moodTags?.filter((mood) => moods.includes(mood)).length ?? 0
      return {
        collection,
        score: overlap * 3 + moodOverlap * 2,
      }
    })
    .sort((a, b) => b.score - a.score)
    .find((item) => item.score > 0)?.collection
}

export function buildScenePlan({
  city,
  prompt,
  selectedMoods,
  places,
  collections,
}: {
  city: CitySlug
  prompt: string
  selectedMoods: MoodChip[]
  places: Place[]
  collections: Collection[]
}): ScenePlan {
  const moods = inferSceneMoods(prompt, selectedMoods)
  const effectiveMoods: MoodChip[] = moods.length ? moods : ["relaxed"]
  const timeOfDay = inferTimeOfDay(prompt)
  const scored = matchPlacesForScene(places, city, effectiveMoods, prompt, timeOfDay)
  const pickedPlaces = pickScenePlaces(scored, effectiveMoods)
  const orderedPlaces = orderRoutePlaces(pickedPlaces)
  const routeOrder = orderedPlaces.map((place) => place.id)
  const routeSummary = buildRouteSummary(orderedPlaces)
  const matchedCollection = findClosestCollection(collections, orderedPlaces, effectiveMoods)

  return {
    city,
    prompt,
    moods: effectiveMoods,
    timeOfDay,
    title: buildSceneTitle(city, effectiveMoods, timeOfDay),
    description: buildSceneDescription(city, effectiveMoods, orderedPlaces, routeSummary),
    places: orderedPlaces,
    routeOrder,
    matchedCollectionId: matchedCollection?.id,
  }
}

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import {
  dedupePlaces,
  getAreaCoordinates,
  inferSourcePlatformFromUrl,
  normalizeCitySlug,
  slugify,
} from "@/lib/place-utils"
import { SEED_COLLECTIONS, SEED_PLACES } from "@/lib/sample-data"
import type {
  Collection,
  ParsedPlaceDraft,
  Place,
  QuickSave,
  SubmissionDraft,
} from "@/lib/types"

type DemoStore = {
  drafts: SubmissionDraft[]
  published: Place[]
  collections: Collection[]
  quickSaves: QuickSave[]
}

const STORE_PATH = path.join(process.cwd(), ".data", "citytaste-demo-store.json")

function normalizeCollection(collection: Collection): Collection {
  return {
    ...collection,
    city: normalizeCitySlug(collection.city),
    kind: collection.kind ?? "editorial",
    routeOrder: collection.routeOrder ?? collection.placeIds,
    moodTags: collection.moodTags ?? [],
    sourceQuickSaveIds: collection.sourceQuickSaveIds ?? [],
  }
}

function normalizeQuickSave(quickSave: QuickSave): QuickSave {
  return {
    ...quickSave,
    city: normalizeCitySlug(quickSave.city),
  }
}

async function readStore(): Promise<DemoStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8")
    const parsed = JSON.parse(raw) as Partial<DemoStore>

    return {
      drafts: (parsed.drafts ?? []).map((draft) => ({
        ...draft,
        parsedPlace: {
          ...draft.parsedPlace,
          city: normalizeCitySlug(draft.parsedPlace.city),
        },
      })),
      published: (parsed.published ?? []).map((place) => ({
        ...place,
        city: normalizeCitySlug(place.city),
      })),
      collections: (parsed.collections ?? []).map(normalizeCollection),
      quickSaves: (parsed.quickSaves ?? []).map(normalizeQuickSave),
    }
  } catch {
    return {
      drafts: [],
      published: [],
      collections: [],
      quickSaves: [],
    }
  }
}

async function persistStore(store: DemoStore) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true })
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8")
}

function materializePlace(parsedPlace: ParsedPlaceDraft) {
  const name = parsedPlace.name?.trim() || "未命名地点"
  const city = normalizeCitySlug(parsedPlace.city)
  const area = parsedPlace.area?.trim() || "静安寺"
  const coordinates = getAreaCoordinates(area, city)

  return {
    id: parsedPlace.id || `live-${crypto.randomUUID()}`,
    slug: slugify(parsedPlace.slug || name),
    name,
    category: parsedPlace.category || "cafe",
    city,
    area,
    address: parsedPlace.address?.trim() || `${area} · 待补充详细地址`,
    lat: parsedPlace.lat ?? coordinates.lat,
    lng: parsedPlace.lng ?? coordinates.lng,
    priceLevel: parsedPlace.priceLevel || "$$",
    tags: parsedPlace.tags?.length ? parsedPlace.tags : ["待补充标签"],
    vibes: parsedPlace.vibes?.length ? parsedPlace.vibes : ["城市整理"],
    summary:
      parsedPlace.summary?.trim() || "从导入工作流里整理出来的一处新地点。",
    description:
      parsedPlace.description?.trim() ||
      "这是一条刚刚通过 CityTaste 工作台审核发布的地点。",
    coverImage: parsedPlace.coverImage,
    gallery: parsedPlace.gallery ?? [],
    statusDefault: parsedPlace.statusDefault || "want_to_go",
    sourceLinks: parsedPlace.sourceLinks ?? [],
    collectionIds: parsedPlace.collectionIds ?? [],
    publishedAt: new Date().toISOString(),
  } satisfies Place
}

function buildQuickSaveTitle(note: string, sourceUrl: string) {
  const firstLine = note
    .trim()
    .split(/[。！？!?\n]/)
    .find(Boolean)
    ?.trim()

  if (firstLine) {
    return firstLine.slice(0, 30)
  }

  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, "")
  } catch {
    return "快速收藏"
  }
}

async function getAllCollections() {
  const store = await readStore()
  const customCollections = [...store.collections].sort((a, b) =>
    (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  )

  return [...customCollections, ...SEED_COLLECTIONS.map(normalizeCollection)]
}

function ensureUniqueCollectionSlug(title: string, collections: Collection[]) {
  const baseSlug = slugify(title) || `plan-${Math.random().toString(36).slice(2, 6)}`
  const existingSlugs = new Set(collections.map((collection) => collection.slug))

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug
  }

  let suffix = 2
  let candidate = `${baseSlug}-${suffix}`

  while (existingSlugs.has(candidate)) {
    suffix += 1
    candidate = `${baseSlug}-${suffix}`
  }

  return candidate
}

export async function listPublicPlaces() {
  const store = await readStore()
  return dedupePlaces([...SEED_PLACES, ...store.published]).sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

export async function getPlaceBySlug(slug: string) {
  const normalizedSlug = (() => {
    try {
      return decodeURIComponent(slug)
    } catch {
      return slug
    }
  })()
  const places = await listPublicPlaces()
  return places.find((place) => place.slug === normalizedSlug) ?? null
}

export async function listCollections() {
  return getAllCollections()
}

export async function getCollectionBySlug(slug: string) {
  const normalizedSlug = (() => {
    try {
      return decodeURIComponent(slug)
    } catch {
      return slug
    }
  })()
  const collections = await getAllCollections()
  return collections.find((collection) => collection.slug === normalizedSlug) ?? null
}

export async function createCollection(
  input: Omit<Collection, "id" | "slug" | "createdAt"> & { slug?: string },
) {
  const store = await readStore()
  const existingCollections = [...store.collections, ...SEED_COLLECTIONS.map(normalizeCollection)]
  const slug = input.slug?.trim() || ensureUniqueCollectionSlug(input.title, existingCollections)

  const collection: Collection = normalizeCollection({
    ...input,
    id: `collection-${crypto.randomUUID()}`,
    slug,
    createdAt: new Date().toISOString(),
    kind: input.kind ?? "personal_plan",
  })

  store.collections = [collection, ...store.collections]
  await persistStore(store)
  return collection
}

export async function createDraft(draft: SubmissionDraft) {
  const store = await readStore()
  store.drafts = [draft, ...store.drafts]
  await persistStore(store)
  return draft
}

export async function listDrafts() {
  const store = await readStore()
  return [...store.drafts].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getDraftById(id: string) {
  const store = await readStore()
  return store.drafts.find((draft) => draft.id === id) ?? null
}

export async function updateDraft(
  id: string,
  updates: Partial<SubmissionDraft>,
) {
  const store = await readStore()
  const current = store.drafts.find((draft) => draft.id === id)

  if (!current) return null

  const nextDraft: SubmissionDraft = {
    ...current,
    ...updates,
    parsedPlace: {
      ...current.parsedPlace,
      ...updates.parsedPlace,
    },
  }

  store.drafts = store.drafts.map((draft) => (draft.id === id ? nextDraft : draft))
  await persistStore(store)
  return nextDraft
}

export async function approveDraft(id: string) {
  const store = await readStore()
  const draft = store.drafts.find((item) => item.id === id)

  if (!draft) return null

  const publishedPlace = materializePlace(draft.parsedPlace)
  store.published = dedupePlaces([publishedPlace, ...store.published])
  store.drafts = store.drafts.map((item) =>
    item.id === id ? { ...item, reviewStatus: "approved" } : item,
  )

  await persistStore(store)
  return publishedPlace
}

export async function rejectDraft(id: string, reviewNotes = "") {
  const store = await readStore()
  const draft = store.drafts.find((item) => item.id === id)

  if (!draft) return null

  const nextDraft = {
    ...draft,
    reviewStatus: "rejected" as const,
    reviewNotes,
  }

  store.drafts = store.drafts.map((item) => (item.id === id ? nextDraft : item))
  await persistStore(store)
  return nextDraft
}

export async function createQuickSave(input: {
  city: string
  sourceUrl: string
  note: string
  collectionId?: string
}) {
  const store = await readStore()
  const city = normalizeCitySlug(input.city)
  const sourceUrl = input.sourceUrl.trim()
  const note = input.note.trim()
  const sourcePlatform = inferSourcePlatformFromUrl(sourceUrl)

  const quickSave: QuickSave = {
    id: `quick-save-${crypto.randomUUID()}`,
    city,
    sourceUrl,
    sourcePlatform,
    title: buildQuickSaveTitle(note, sourceUrl),
    note,
    collectionId: input.collectionId?.trim() || undefined,
    createdAt: new Date().toISOString(),
  }

  store.quickSaves = [quickSave, ...store.quickSaves]
  await persistStore(store)
  return quickSave
}

export async function listQuickSaves(city?: string) {
  const store = await readStore()
  const normalizedCity = city ? normalizeCitySlug(city) : undefined

  return [...store.quickSaves]
    .filter((quickSave) => (normalizedCity ? quickSave.city === normalizedCity : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

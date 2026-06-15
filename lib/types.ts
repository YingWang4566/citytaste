export type CitySlug = string

export type Category =
  | "food"
  | "cafe"
  | "bar"
  | "shopping"
  | "activity"
  | "exhibition"

export type PriceLevel = "$" | "$$" | "$$$"

export type StatusDefault = "want_to_go" | "visited" | "favorite"

export type SourcePlatform =
  | "xiaohongshu"
  | "douyin"
  | "google_maps"
  | "instagram"
  | "official"
  | "manual"

export type ReviewStatus = "pending" | "approved" | "rejected"

export type MoodChip =
  | "relaxed"
  | "date"
  | "rainy_day"
  | "photo_friendly"
  | "solo"
  | "friends"

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night"

export type CollectionKind = "editorial" | "personal_plan"

export type Coordinates = {
  lat: number
  lng: number
}

export type SourceLink = {
  id: string
  platform: SourcePlatform
  label: string
  url: string
}

export type Place = {
  id: string
  slug: string
  name: string
  category: Category
  city: CitySlug
  area: string
  address: string
  lat: number
  lng: number
  priceLevel: PriceLevel
  tags: string[]
  vibes: string[]
  summary: string
  description: string
  coverImage?: string
  gallery: string[]
  statusDefault: StatusDefault
  sourceLinks: SourceLink[]
  collectionIds: string[]
  publishedAt: string
}

export type Collection = {
  id: string
  slug: string
  city: CitySlug
  title: string
  description: string
  theme: string
  placeIds: string[]
  kind?: CollectionKind
  routeOrder?: string[]
  moodTags?: MoodChip[]
  note?: string
  coverImage?: string
  createdAt?: string
  sourceQuickSaveIds?: string[]
}

export type QuickSave = {
  id: string
  city: CitySlug
  sourceUrl: string
  sourcePlatform: SourcePlatform
  title: string
  note: string
  collectionId?: string
  createdAt: string
}

export type ScenePlan = {
  city: CitySlug
  prompt: string
  moods: MoodChip[]
  timeOfDay: TimeOfDay
  title: string
  description: string
  places: Place[]
  routeOrder: string[]
  matchedCollectionId?: string
}

export type ParsedPlaceDraft = Partial<Place> & {
  sourceLinks?: SourceLink[]
}

export type SubmissionDraft = {
  id: string
  rawText: string
  sourcePlatform: SourcePlatform
  sourceUrl?: string
  parsedPlace: ParsedPlaceDraft
  reviewStatus: ReviewStatus
  reviewNotes: string
  createdAt: string
}

export type LocalVisitState = {
  want_to_go: boolean
  visited: boolean
  favorite: boolean
}

export type ExploreFilters = {
  query: string
  category: Category | "all"
  area: string | "all"
  status: keyof LocalVisitState | "all"
}

export type ApiEnvelope<T> = {
  data: T
}

export type ImportedDraftResponse = {
  draft: SubmissionDraft
  preview: ParsedPlaceDraft
}

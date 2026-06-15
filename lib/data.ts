import {
  approveDraft,
  createCollection,
  createDraft,
  createQuickSave,
  getCollectionBySlug,
  getDraftById,
  getPlaceBySlug,
  listCollections,
  listDrafts,
  listPublicPlaces,
  listQuickSaves,
  rejectDraft,
  updateDraft,
} from "@/lib/mock-db"
import type { CitySlug, Collection, QuickSave, SubmissionDraft } from "@/lib/types"

export async function getPublicPlaces(city?: CitySlug) {
  const places = await listPublicPlaces()
  return city ? places.filter((place) => place.city === city) : places
}

export async function getFeaturedPlaces(city?: CitySlug) {
  const places = await getPublicPlaces(city)
  return places.slice(0, 6)
}

export async function getCollections(city?: CitySlug) {
  const collections = await listCollections()
  return city ? collections.filter((collection) => collection.city === city) : collections
}

export async function getCollection(slug: string) {
  return getCollectionBySlug(slug)
}

export async function createPlanCollection(
  input: Omit<Collection, "id" | "slug" | "createdAt"> & { slug?: string },
) {
  return createCollection(input)
}

export async function getPlace(slug: string) {
  return getPlaceBySlug(slug)
}

export async function getDrafts() {
  return listDrafts()
}

export async function getDraft(id: string) {
  return getDraftById(id)
}

export async function saveDraft(draft: SubmissionDraft) {
  return createDraft(draft)
}

export async function patchDraft(
  id: string,
  updates: Partial<SubmissionDraft>,
) {
  return updateDraft(id, updates)
}

export async function publishDraft(id: string) {
  return approveDraft(id)
}

export async function declineDraft(id: string, reviewNotes?: string) {
  return rejectDraft(id, reviewNotes)
}

export async function getQuickSaves(city?: CitySlug) {
  return listQuickSaves(city)
}

export async function saveQuickSave(input: {
  city: string
  sourceUrl: string
  note: string
  collectionId?: string
}): Promise<QuickSave> {
  return createQuickSave(input)
}

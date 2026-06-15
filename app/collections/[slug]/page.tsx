import { notFound } from "next/navigation"
import { getCollection, getPublicPlaces } from "@/lib/data"
import { orderRoutePlaces } from "@/lib/planning"
import { CollectionRouteView } from "@/components/collection-route-view"

export const dynamic = "force-dynamic"

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const collection = await getCollection(slug)

  if (!collection) {
    notFound()
  }

  const allPlaces = await getPublicPlaces(collection.city)
  const rawPlaces = collection.placeIds
    .map((id) => allPlaces.find((place) => place.id === id))
    .filter((place): place is NonNullable<typeof place> => Boolean(place))

  const orderedPlaces = (collection.routeOrder?.length
    ? [
        ...collection.routeOrder
          .map((id) => rawPlaces.find((place) => place.id === id))
          .filter((place): place is NonNullable<typeof place> => Boolean(place)),
        ...rawPlaces.filter((place) => !collection.routeOrder?.includes(place.id)),
      ]
    : orderRoutePlaces(rawPlaces)
  ).filter((place, index, array) => array.findIndex((item) => item.id === place.id) === index)

  return <CollectionRouteView collection={collection} orderedPlaces={orderedPlaces} />
}

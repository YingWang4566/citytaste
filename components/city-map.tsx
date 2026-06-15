"use client"

import { useEffect, useMemo, useRef } from "react"
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"
import L, { type Marker as LeafletMarker } from "leaflet"
import Link from "next/link"
import type { CitySlug, Place } from "@/lib/types"
import { CATEGORY_META, DEFAULT_CITY } from "@/lib/constants"
import { getCityCenter } from "@/lib/place-utils"

function iconFor(place: Place, active: boolean, routeIndex?: number) {
  const meta = CATEGORY_META[place.category]
  const size = active ? 42 : 30
  const fontSize = active ? 18 : 15
  const shadow = active
    ? "0 0 0 8px rgba(196,138,88,0.2), 0 16px 36px rgba(61,40,23,0.24)"
    : "0 10px 30px rgba(61,40,23,0.18)"
  const background = active
    ? "linear-gradient(135deg, rgba(255,252,246,0.98), rgba(255,232,206,0.96))"
    : "rgba(255,255,255,0.86)"
  const border = active
    ? "1px solid rgba(186,140,97,0.52)"
    : "1px solid rgba(186,140,97,0.35)"
  const routeBadge =
    typeof routeIndex === "number"
      ? `<span style="position:absolute;top:-6px;right:-6px;display:flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:rgba(124,72,27,0.95);color:white;font-size:11px;font-weight:700;letter-spacing:0.04em;box-shadow:0 8px 18px rgba(61,40,23,0.18);">${String.fromCharCode(65 + routeIndex)}</span>`
      : ""

  return L.divIcon({
    className: "",
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:999px;background:${background};box-shadow:${shadow};border:${border};font-size:${fontSize}px;transform:${active ? "translateY(-2px)" : "none"};">${meta.emoji}${routeBadge}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function FitToPlaces({
  places,
  city = DEFAULT_CITY,
  focusedSlug,
}: {
  places: Place[]
  city?: CitySlug
  focusedSlug?: string
}) {
  const map = useMap()

  useEffect(() => {
    const center = getCityCenter(city)

    if (!places.length) {
      map.setView([center.lat, center.lng], 12)
      return
    }

    const focused = places.find((place) => place.slug === focusedSlug)

    if (focused) {
      map.flyTo([focused.lat, focused.lng], 14, { duration: 0.8 })
      return
    }

    const bounds = L.latLngBounds(places.map((place) => [place.lat, place.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 13 })
  }, [city, focusedSlug, map, places])

  return null
}

export default function CityMap({
  places,
  city = DEFAULT_CITY,
  selectedSlug,
  activeSlug,
  focusedSlug,
  onSelect,
  className = "",
  routeOrder,
  showRoute = false,
}: {
  places: Place[]
  city?: CitySlug
  selectedSlug?: string
  activeSlug?: string
  focusedSlug?: string
  onSelect?: (slug: string) => void
  className?: string
  routeOrder?: string[]
  showRoute?: boolean
}) {
  const center = getCityCenter(city)
  const markerActiveSlug = activeSlug ?? selectedSlug
  const mapFocusedSlug = focusedSlug ?? selectedSlug
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({})

  const routeSlugOrder = useMemo(
    () => (showRoute ? routeOrder ?? places.map((place) => place.slug) : []),
    [places, routeOrder, showRoute],
  )
  const routeIndexBySlug = useMemo(
    () => new Map(routeSlugOrder.map((slug, index) => [slug, index])),
    [routeSlugOrder],
  )
  const routeCoordinates = useMemo(
    () =>
      routeSlugOrder
        .map((slug) => places.find((place) => place.slug === slug))
        .filter((place): place is NonNullable<typeof place> => Boolean(place))
        .map((place) => [place.lat, place.lng] as [number, number]),
    [places, routeSlugOrder],
  )

  useEffect(() => {
    if (!mapFocusedSlug) {
      return
    }

    markerRefs.current[mapFocusedSlug]?.openPopup()
  }, [mapFocusedSlug])

  return (
    <div className={`overflow-hidden rounded-[1.75rem] border border-border/70 ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        scrollWheelZoom
        className="h-full min-h-[320px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FitToPlaces places={places} city={city} focusedSlug={mapFocusedSlug} />
        {showRoute && routeCoordinates.length >= 2 ? (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#a05c26",
              weight: 4,
              opacity: 0.78,
              dashArray: "8 10",
              lineCap: "round",
            }}
          />
        ) : null}
        {places.map((place) => (
          <Marker
            key={place.id}
            ref={(node) => {
              markerRefs.current[place.slug] = node
            }}
            position={[place.lat, place.lng]}
            icon={iconFor(place, place.slug === markerActiveSlug, routeIndexBySlug.get(place.slug))}
            eventHandlers={
              onSelect
                ? {
                    click: () => onSelect(place.slug),
                  }
                : undefined
            }
          >
            <Popup>
              <div className="space-y-2">
                {showRoute && typeof routeIndexBySlug.get(place.slug) === "number" ? (
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                    第 {routeIndexBySlug.get(place.slug)! + 1} 站
                  </div>
                ) : null}
                <div className="font-heading text-lg">{place.name}</div>
                <div className="text-sm text-neutral-700">{place.summary}</div>
                <Link
                  href={`/place/${place.slug}?city=${place.city}`}
                  className="text-sm font-medium text-amber-700"
                >
                  查看详情
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

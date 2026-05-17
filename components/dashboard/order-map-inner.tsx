"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { computeRoute, GeoPoint } from "@/lib/astar"

// Fix Leaflet's broken default icon paths under webpack/Next.js
function fixIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })
}

function makePin(bg: string, emoji: string) {
  return L.divIcon({
    className: "",
    iconSize: [40, 48] as [number, number],
    iconAnchor: [20, 48] as [number, number],
    popupAnchor: [0, -48] as [number, number],
    html: `
      <div style="
        position:relative;
        width:40px;
        height:48px;
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <div style="
          background:${bg};
          width:36px;
          height:36px;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 3px 12px rgba(0,0,0,.35);
        "></div>
        <span style="
          position:absolute;
          top:4px;
          font-size:18px;
          line-height:1;
        ">${emoji}</span>
      </div>
    `,
  })
}

// Auto-fits the map to show both markers with padding
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  const fitted = useRef(false)
  useEffect(() => {
    if (fitted.current || points.length < 2) return
    fitted.current = true
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]))
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [map, points])
  return null
}

// Animated delivery rider that walks along the route polyline
function AnimatedRider({
  route,
  active,
}: {
  route: GeoPoint[]
  active: boolean
}) {
  const [step, setStep] = useState(0)
  const riderIcon = useMemo(() => makePin("#f97316", "🛵"), [])

  useEffect(() => {
    if (!active || route.length < 2) return
    setStep(0)
    const interval = setInterval(() => {
      setStep(s => {
        if (s >= route.length - 1) {
          clearInterval(interval)
          return s
        }
        return s + 1
      })
    }, 600)
    return () => clearInterval(interval)
  }, [active, route])

  if (!active || route.length === 0) return null
  const pos = route[step]
  return (
    <Marker position={[pos.lat, pos.lng]} icon={riderIcon}>
      <Popup>Rider on the way! 🛵</Popup>
    </Marker>
  )
}

export interface OrderMapInnerProps {
  customerLat: number
  customerLng: number
  restaurantLat: number
  restaurantLng: number
  restaurantName: string
  status: string
}

export default function OrderMapInner({
  customerLat,
  customerLng,
  restaurantLat,
  restaurantLng,
  restaurantName,
  status,
}: OrderMapInnerProps) {
  useEffect(() => { fixIcons() }, [])

  const route = useMemo(
    () =>
      computeRoute(
        { lat: restaurantLat, lng: restaurantLng },
        { lat: customerLat, lng: customerLng },
      ),
    [restaurantLat, restaurantLng, customerLat, customerLng],
  )

  const routeLatLngs = route.map(p => [p.lat, p.lng] as [number, number])
  const boundsPoints: [number, number][] = [
    [restaurantLat, restaurantLng],
    [customerLat, customerLng],
  ]

  const restaurantIcon = useMemo(() => makePin("#10b981", "🍛"), [])
  const customerIcon   = useMemo(() => makePin("#3b82f6", "🏠"), [])

  // Show static rider at midpoint for preparing/confirmed, animated for on_the_way
  const staticRiderIcon = useMemo(() => makePin("#f97316", "🛵"), [])
  const isOnTheWay = status === "on_the_way"
  const isAtRestaurant = status === "preparing" || status === "confirmed"
  const midPoint = route[Math.floor(route.length / 2)]

  const center: [number, number] = [
    (customerLat + restaurantLat) / 2,
    (customerLng + restaurantLng) / 2,
  ]

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds points={boundsPoints} />

      {/* A* delivery route */}
      <Polyline
        positions={routeLatLngs}
        pathOptions={{ color: "#f97316", weight: 4, opacity: 0.85, dashArray: "10 6" }}
      />

      {/* Restaurant pin */}
      <Marker position={[restaurantLat, restaurantLng]} icon={restaurantIcon}>
        <Popup>
          <strong>{restaurantName}</strong><br />Restaurant
        </Popup>
      </Marker>

      {/* Customer pin */}
      <Marker position={[customerLat, customerLng]} icon={customerIcon}>
        <Popup>Your Location 🏠</Popup>
      </Marker>

      {/* Static rider at restaurant while preparing */}
      {isAtRestaurant && (
        <Marker position={[restaurantLat, restaurantLng]} icon={staticRiderIcon}>
          <Popup>Rider waiting at restaurant…</Popup>
        </Marker>
      )}

      {/* Animated rider moving along route */}
      <AnimatedRider route={route} active={isOnTheWay} />

      {/* Static midpoint rider when on_the_way but animation done */}
      {isOnTheWay && midPoint && !isAtRestaurant && (
        <></>
      )}
    </MapContainer>
  )
}

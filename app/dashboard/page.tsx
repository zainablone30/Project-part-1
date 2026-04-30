"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { supabase } from "@/lib/supabase"
import { SearchHeader } from "@/components/dashboard/search-header"
import { MoodSelector } from "@/components/dashboard/mood-selector"
import { QuickCategories } from "@/components/dashboard/quick-categories"
import { PromoBanner } from "@/components/dashboard/promo-banner"
import { AISuggestions } from "@/components/dashboard/ai-suggestions"
import { FoodCard } from "@/components/dashboard/food-card"
import { OrderTracker } from "@/components/dashboard/order-tracker"
import { PinguChef } from "@/components/pingu-chef"
import { useLanguage } from "@/components/language-provider"

type FoodItem = {
  id: string
  name: string
  nameUrdu?: string
  restaurant: string
  image: string
  price: number
  rating: number
  deliveryTime: string
  isSpicy?: boolean
  isVeg?: boolean
  isHomemade?: boolean
  aiRecommended?: boolean
  discount?: number
}

type LocationStatus = "idle" | "locating" | "ready" | "blocked" | "unsupported" | "error"

const LOCATION_FALLBACK = "Gulberg III, Lahore"

function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}

async function getReadableLocation(latitude: number, longitude: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
  )

  if (!response.ok) {
    throw new Error("Could not resolve address")
  }

  const data = await response.json()
  const address = data.address || {}
  const area = address.suburb || address.neighbourhood || address.quarter || address.road
  const city = address.city || address.town || address.village || address.county

  return [area, city].filter(Boolean).join(", ") || data.display_name || formatCoordinates(latitude, longitude)
}

function mapFood(f: any): FoodItem {
  return {
    id: f.id,
    name: f.name,
    nameUrdu: f.name_urdu || undefined,
    restaurant: f.restaurants?.name || "DastarKhan",
    image: f.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500",
    price: f.price,
    rating: Number(f.rating),
    deliveryTime: f.delivery_time || "30-35 min",
    isSpicy: f.is_spicy,
    isVeg: f.is_veg,
    isHomemade: f.is_homemade,
    aiRecommended: f.is_ai_recommended,
    discount: f.discount || undefined,
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [hasActiveOrder, setHasActiveOrder] = useState(true)
  const [cartCount, setCartCount] = useState(2)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Foodie")
  const [currentLocation, setCurrentLocation] = useState(LOCATION_FALLBACK)
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle")
  const [trendingFoods, setTrendingFoods] = useState<FoodItem[]>([])
  const [nearbyFoods, setNearbyFoods] = useState<FoodItem[]>([])
  const locationWatchId = useRef<number | null>(null)

  const detectCurrentLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("unsupported")
      setCurrentLocation("Location not supported")
      return
    }

    setLocationStatus("locating")

    if (locationWatchId.current !== null) {
      navigator.geolocation.clearWatch(locationWatchId.current)
    }

    const watchId = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const coordinateLabel = formatCoordinates(coords.latitude, coords.longitude)
        setCurrentLocation(coordinateLabel)

        try {
          const readableLocation = await getReadableLocation(coords.latitude, coords.longitude)
          setCurrentLocation(readableLocation)
          setLocationStatus("ready")
        } catch {
          setLocationStatus("ready")
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("blocked")
          setCurrentLocation("Allow location access")
          return
        }

        setLocationStatus("error")
        setCurrentLocation(LOCATION_FALLBACK)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30_000,
        timeout: 15_000,
      },
    )
    locationWatchId.current = watchId

    return () => {
      navigator.geolocation.clearWatch(watchId)
      if (locationWatchId.current === watchId) {
        locationWatchId.current = null
      }
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login")
        return
      }
      // Get user name from profile
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data?.full_name) setUserName(data.full_name.split(" ")[0])
        })
    })
  }, [router])

  useEffect(() => {
    const stopWatchingLocation = detectCurrentLocation()
    return () => stopWatchingLocation?.()
  }, [detectCurrentLocation])

  useEffect(() => {
    async function fetchFoods() {
      setLoading(true)
      // Trending: AI recommended + high rating
      const { data: trending } = await supabase
        .from("foods")
        .select("*, restaurants(name, area)")
        .order("is_ai_recommended", { ascending: false })
        .order("rating", { ascending: false })
        .limit(6)

      // Nearby: high rating, fast delivery
      const { data: nearby } = await supabase
        .from("foods")
        .select("*, restaurants(name, area)")
        .order("rating", { ascending: false })
        .limit(6)

      if (trending) setTrendingFoods(trending.map(mapFood))
      if (nearby) setNearbyFoods(nearby.filter((f: any) => !f.is_ai_recommended).map(mapFood).slice(0, 3))
      setLoading(false)
    }
    fetchFoods()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen">
        <SearchHeader
          userName={userName}
          location={currentLocation}
          locationStatus={locationStatus}
          onLocationClick={detectCurrentLocation}
          cartCount={cartCount}
          notificationCount={3}
        />

        <div className="p-6 pt-4 lg:pt-6 space-y-6">
          {/* Welcome Pingu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 p-4 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <PinguChef size="sm" showQuote={false} mood="happy" />
            <div>
              <p className="font-bold text-foreground">
                {t("dashboard_greeting")}, {userName}! 👋
              </p>
              <p className="text-sm text-muted-foreground">
                {t("dashboard_subtitle")}
              </p>
            </div>
          </motion.div>

          <PromoBanner />
          <MoodSelector />
          <QuickCategories />
          <AISuggestions />

          {/* Trending Foods */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{t("dashboard_trending_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("dashboard_trending_desc")}</p>
              </div>
              <a href="/dashboard/explore" className="text-sm text-primary font-medium hover:underline">
                {t("dashboard_view_all")}
              </a>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 rounded-3xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingFoods.map((food, index) => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FoodCard {...food} onAddToCart={() => setCartCount((c) => c + 1)} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Nearby Section */}
          {nearbyFoods.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{t("dashboard_nearby_title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("dashboard_nearby_desc")}</p>
                </div>
                <a href="/dashboard/explore" className="text-sm text-primary font-medium hover:underline">
                  {t("dashboard_view_all")}
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyFoods.map((food, index) => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FoodCard {...food} onAddToCart={() => setCartCount((c) => c + 1)} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Pingu Floating Widget - mobile only */}
          <motion.div
            className="fixed bottom-6 right-6 z-40 lg:hidden"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <PinguChef size="sm" showQuote={true} mood="happy" />
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

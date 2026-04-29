"use client"

import { useState, useEffect } from "react"
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
  const [hasActiveOrder, setHasActiveOrder] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [trendingFoods, setTrendingFoods] = useState<FoodItem[]>([])
  const [nearbyFoods, setNearbyFoods] = useState<FoodItem[]>([])
  const [userName, setUserName] = useState("Ahmed")
  const [loading, setLoading] = useState(true)

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
          location="Gulberg III, Lahore"
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
                Assalam o Alaikum, {userName}! 👋
              </p>
              <p className="text-sm text-muted-foreground">
                Main Pingu hoon, tumhara food buddy! Aaj kya khana hai?
              </p>
            </div>
          </motion.div>

          {/* Active Order Tracker */}
          {hasActiveOrder && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <OrderTracker
                orderId="DK-2847"
                currentStage={2}
                estimatedTime="25-30 min"
                items={[
                  { name: "Chicken Biryani", quantity: 2 },
                  { name: "Raita", quantity: 1 },
                  { name: "Pepsi 1.5L", quantity: 1 },
                ]}
              />
            </motion.div>
          )}

          <PromoBanner />
          <MoodSelector />
          <QuickCategories />
          <AISuggestions />

          {/* Trending Foods */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">Trending Abhi 🔥</h3>
                <p className="text-sm text-muted-foreground">Sab yahi order kar rahe hain!</p>
              </div>
              <button className="text-sm text-primary font-medium hover:underline">Sab dekho →</button>
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
                  <h3 className="text-xl font-bold text-foreground">Paas Mein 📍</h3>
                  <p className="text-sm text-muted-foreground">Jaldi delivery, paas se!</p>
                </div>
                <button className="text-sm text-primary font-medium hover:underline">Sab dekho →</button>
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

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SearchHeader } from "@/components/dashboard/search-header"
import { MoodSelector } from "@/components/dashboard/mood-selector"
import { QuickCategories } from "@/components/dashboard/quick-categories"
import { PromoBanner } from "@/components/dashboard/promo-banner"
import { AISuggestions } from "@/components/dashboard/ai-suggestions"
import { FoodCard } from "@/components/dashboard/food-card"
import { OrderTracker } from "@/components/dashboard/order-tracker"
import { PinguChef } from "@/components/pingu-chef"

// Sample food data
const trendingFoods = [
  {
    id: "1",
    name: "Chicken Biryani",
    nameUrdu: "چکن بریانی",
    restaurant: "Karachi Biryani House",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500",
    price: 450,
    rating: 4.8,
    deliveryTime: "25-30 min",
    isSpicy: true,
    aiRecommended: true,
    discount: 20,
  },
  {
    id: "2",
    name: "Seekh Kebab",
    nameUrdu: "سیخ کباب",
    restaurant: "BBQ Tonight",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500",
    price: 380,
    rating: 4.6,
    deliveryTime: "20-25 min",
    isSpicy: true,
  },
  {
    id: "3",
    name: "Butter Chicken",
    nameUrdu: "بٹر چکن",
    restaurant: "Lahore Tikka",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500",
    price: 520,
    rating: 4.7,
    deliveryTime: "30-35 min",
    isHomemade: true,
  },
  {
    id: "4",
    name: "Aloo Paratha",
    nameUrdu: "آلو پراٹھا",
    restaurant: "Desi Nashta Corner",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
    price: 150,
    rating: 4.5,
    deliveryTime: "15-20 min",
    isVeg: true,
  },
  {
    id: "5",
    name: "Nihari",
    nameUrdu: "نہاری",
    restaurant: "Old Lahore",
    image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=500",
    price: 550,
    rating: 4.9,
    deliveryTime: "35-40 min",
    isSpicy: true,
    aiRecommended: true,
  },
  {
    id: "6",
    name: "Karahi Gosht",
    nameUrdu: "کڑاہی گوشت",
    restaurant: "Namak Mandi",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500",
    price: 850,
    rating: 4.8,
    deliveryTime: "40-45 min",
    isSpicy: true,
  },
]

const nearbyRestaurants = [
  {
    id: "1",
    name: "Cheese Burger",
    nameUrdu: "چیز برگر",
    restaurant: "Burger Lab",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    price: 650,
    rating: 4.7,
    deliveryTime: "20-25 min",
    discount: 15,
  },
  {
    id: "2",
    name: "Pepperoni Pizza",
    nameUrdu: "پیپرونی پیزا",
    restaurant: "Pizza Hut",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    price: 1200,
    rating: 4.5,
    deliveryTime: "30-35 min",
  },
  {
    id: "3",
    name: "Chicken Shawarma",
    nameUrdu: "چکن شوارما",
    restaurant: "Arabian Nights",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500",
    price: 350,
    rating: 4.6,
    deliveryTime: "15-20 min",
    aiRecommended: true,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [hasActiveOrder, setHasActiveOrder] = useState(true)
  const [cartCount, setCartCount] = useState(2)

  useEffect(() => {
    try {
      const logged = localStorage.getItem("isLoggedIn")
      if (logged !== "true") {
        router.replace("/login")
      }
    } catch (e) {
      router.replace("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <SearchHeader
          userName="Ahmed"
          location="Gulberg III, Lahore"
          cartCount={cartCount}
          notificationCount={3}
        />

        <div className="p-6 pt-4 lg:pt-6 space-y-6">
          {/* Welcome Pingu - Shows on first visit or randomly */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 p-4 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <PinguChef size="sm" showQuote={false} mood="happy" />
            <div>
              <p className="font-bold text-foreground">
                Assalam o Alaikum, Ahmed! 👋
              </p>
              <p className="text-sm text-muted-foreground">
                Main Pingu hoon, tumhara food buddy! Aaj kya khana hai?
              </p>
            </div>
          </motion.div>

          {/* Active Order Tracker */}
          {hasActiveOrder && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
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

          {/* Promo Banner */}
          <PromoBanner />

          {/* Mood Selector */}
          <MoodSelector />

          {/* Quick Categories */}
          <QuickCategories />

          {/* AI Suggestions */}
          <AISuggestions />

          {/* Trending Foods */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Trending Abhi 🔥
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sab yahi order kar rahe hain!
                </p>
              </div>
              <button className="text-sm text-primary font-medium hover:underline">
                Sab dekho →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingFoods.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FoodCard
                    {...food}
                    onAddToCart={() => setCartCount((c) => c + 1)}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Nearby Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Paas Mein 📍
                </h3>
                <p className="text-sm text-muted-foreground">
                  Jaldi delivery, paas se!
                </p>
              </div>
              <button className="text-sm text-primary font-medium hover:underline">
                Sab dekho →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyRestaurants.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FoodCard
                    {...food}
                    onAddToCart={() => setCartCount((c) => c + 1)}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Pingu Chef Floating Widget */}
          <motion.div
            className="fixed bottom-6 right-6 z-40 lg:hidden"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <PinguChef size="sm" showQuote={true} mood="happy" />
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

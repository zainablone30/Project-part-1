"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { FoodCard } from "@/components/dashboard/food-card"
import { PinguChef } from "@/components/pingu-chef"
import { Heart, Trash2 } from "lucide-react"

const favoriteFoods = [
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
    isFavorite: true,
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
    isFavorite: true,
  },
  {
    id: "3",
    name: "Cheese Burger",
    nameUrdu: "چیز برگر",
    restaurant: "Burger Lab",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    price: 650,
    rating: 4.7,
    deliveryTime: "20-25 min",
    isFavorite: true,
  },
]

const favoriteRestaurants = [
  {
    id: "1",
    name: "Karachi Biryani House",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    cuisine: "Biryani, Pakistani",
    rating: 4.8,
    deliveryTime: "25-30 min",
    orders: 12,
  },
  {
    id: "2",
    name: "BBQ Tonight",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
    cuisine: "BBQ, Grill",
    rating: 4.6,
    deliveryTime: "20-25 min",
    orders: 8,
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(favoriteFoods)
  const [activeTab, setActiveTab] = useState<"food" | "restaurants">("food")

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((f) => f.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              Mere Favorites
            </h1>
            <p className="text-muted-foreground">
              Jo dil ko bhaye, woh yahan milaye
            </p>
          </div>
          <PinguChef size="sm" showQuote={false} mood="happy" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("food")}
            className={`px-6 py-3 rounded-2xl font-medium transition-colors ${
              activeTab === "food"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Khana ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab("restaurants")}
            className={`px-6 py-3 rounded-2xl font-medium transition-colors ${
              activeTab === "restaurants"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Restaurants ({favoriteRestaurants.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === "food" ? (
          favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FoodCard
                    {...food}
                    onFavorite={() => removeFavorite(food.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <PinguChef size="lg" showQuote={false} mood="waiting" />
              <p className="mt-4 text-lg font-medium text-foreground">
                Abhi koi favorite nahi hai! 💔
              </p>
              <p className="text-muted-foreground mb-4">
                Kuch dhundo aur dil lagao
              </p>
              <a
                href="/dashboard/explore"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Khana Dhundo
              </a>
            </motion.div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all"
              >
                <div className="relative h-40">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {restaurant.cuisine}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        ⭐ {restaurant.rating}
                      </span>
                      <span className="text-muted-foreground">
                        🕐 {restaurant.deliveryTime}
                      </span>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {restaurant.orders} orders
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

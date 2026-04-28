"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { FoodCard } from "@/components/dashboard/food-card"
import { PinguChef } from "@/components/pingu-chef"
import { Search, SlidersHorizontal, X } from "lucide-react"

const allFoods = [
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
    category: "Biryani",
    aiRecommended: true,
  },
  {
    id: "2",
    name: "Mutton Biryani",
    nameUrdu: "مٹن بریانی",
    restaurant: "Student Biryani",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500",
    price: 550,
    rating: 4.7,
    deliveryTime: "30-35 min",
    isSpicy: true,
    category: "Biryani",
    discount: 15,
  },
  {
    id: "3",
    name: "Seekh Kebab",
    nameUrdu: "سیخ کباب",
    restaurant: "BBQ Tonight",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500",
    price: 380,
    rating: 4.6,
    deliveryTime: "20-25 min",
    isSpicy: true,
    category: "BBQ",
  },
  {
    id: "4",
    name: "Malai Boti",
    nameUrdu: "ملائی بوٹی",
    restaurant: "Bundu Khan",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500",
    price: 420,
    rating: 4.8,
    deliveryTime: "25-30 min",
    category: "BBQ",
    isHomemade: true,
  },
  {
    id: "5",
    name: "Butter Chicken",
    nameUrdu: "بٹر چکن",
    restaurant: "Lahore Tikka",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500",
    price: 520,
    rating: 4.7,
    deliveryTime: "30-35 min",
    category: "Karahi",
  },
  {
    id: "6",
    name: "Aloo Paratha",
    nameUrdu: "آلو پراٹھا",
    restaurant: "Desi Nashta Corner",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
    price: 150,
    rating: 4.5,
    deliveryTime: "15-20 min",
    isVeg: true,
    category: "Paratha",
  },
  {
    id: "7",
    name: "Nihari",
    nameUrdu: "نہاری",
    restaurant: "Old Lahore",
    image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=500",
    price: 550,
    rating: 4.9,
    deliveryTime: "35-40 min",
    isSpicy: true,
    category: "Nihari",
    aiRecommended: true,
  },
  {
    id: "8",
    name: "Karahi Gosht",
    nameUrdu: "کڑاہی گوشت",
    restaurant: "Namak Mandi",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500",
    price: 850,
    rating: 4.8,
    deliveryTime: "40-45 min",
    isSpicy: true,
    category: "Karahi",
  },
  {
    id: "9",
    name: "Cheese Burger",
    nameUrdu: "چیز برگر",
    restaurant: "Burger Lab",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    price: 650,
    rating: 4.7,
    deliveryTime: "20-25 min",
    category: "Burger",
    discount: 20,
  },
  {
    id: "10",
    name: "Zinger Burger",
    nameUrdu: "زنگر برگر",
    restaurant: "KFC",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500",
    price: 580,
    rating: 4.5,
    deliveryTime: "20-25 min",
    isSpicy: true,
    category: "Burger",
  },
  {
    id: "11",
    name: "Pepperoni Pizza",
    nameUrdu: "پیپرونی پیزا",
    restaurant: "Pizza Hut",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    price: 1200,
    rating: 4.5,
    deliveryTime: "30-35 min",
    category: "Pizza",
  },
  {
    id: "12",
    name: "Fajita Pizza",
    nameUrdu: "فاہیتا پیزا",
    restaurant: "Domino's",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    price: 1100,
    rating: 4.6,
    deliveryTime: "25-30 min",
    isSpicy: true,
    category: "Pizza",
    aiRecommended: true,
  },
]

const categories = [
  { name: "All", emoji: "🍽️" },
  { name: "Biryani", emoji: "🍛" },
  { name: "BBQ", emoji: "🍖" },
  { name: "Karahi", emoji: "🍜" },
  { name: "Nihari", emoji: "🥘" },
  { name: "Paratha", emoji: "🫓" },
  { name: "Burger", emoji: "🍔" },
  { name: "Pizza", emoji: "🍕" },
]

const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Rating", value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Delivery Time", value: "delivery" },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recommended")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [filters, setFilters] = useState({
    veg: false,
    spicy: false,
    homemade: false,
    discount: false,
  })

  const filteredFoods = allFoods
    .filter((food) => {
      const matchesSearch =
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || food.category === selectedCategory
      const matchesPrice = food.price >= priceRange[0] && food.price <= priceRange[1]
      const matchesFilters =
        (!filters.veg || food.isVeg) &&
        (!filters.spicy || food.isSpicy) &&
        (!filters.homemade || food.isHomemade) &&
        (!filters.discount || food.discount)

      return matchesSearch && matchesCategory && matchesPrice && matchesFilters
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price_asc":
          return a.price - b.price
        case "price_desc":
          return b.price - a.price
        case "delivery":
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
        default:
          return (b.aiRecommended ? 1 : 0) - (a.aiRecommended ? 1 : 0)
      }
    })

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Explore Khana</h1>
            <p className="text-muted-foreground">Dhundo apna favorite khana</p>
          </div>
          <div className="flex items-center gap-3">
            <PinguChef size="sm" showQuote={false} mood="happy" />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search biryani, burger, restaurant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-muted border-2 border-transparent focus:border-primary outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-background"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-colors ${
              showFilters ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-card rounded-2xl border border-border/50"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.veg}
                  onChange={(e) => setFilters({ ...filters, veg: e.target.checked })}
                  className="w-5 h-5 rounded accent-primary"
                />
                <span className="text-sm font-medium">🥬 Veg Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.spicy}
                  onChange={(e) => setFilters({ ...filters, spicy: e.target.checked })}
                  className="w-5 h-5 rounded accent-primary"
                />
                <span className="text-sm font-medium">🌶️ Spicy</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.homemade}
                  onChange={(e) => setFilters({ ...filters, homemade: e.target.checked })}
                  className="w-5 h-5 rounded accent-primary"
                />
                <span className="text-sm font-medium">🏠 Homemade</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.discount}
                  onChange={(e) => setFilters({ ...filters, discount: e.target.checked })}
                  className="w-5 h-5 rounded accent-primary"
                />
                <span className="text-sm font-medium">🏷️ Discounts</span>
              </label>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Sort By
              </label>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      sortBy === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === category.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <span>{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredFoods.length} items mili{filteredFoods.length !== 1 ? "n" : ""}
        </p>

        {/* Food Grid */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFoods.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FoodCard {...food} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <PinguChef size="lg" showQuote={false} mood="waiting" />
            <p className="mt-4 text-lg font-medium text-foreground">Kuch nahi mila! 😔</p>
            <p className="text-muted-foreground">Filters change karke dekho</p>
          </div>
        )}
      </main>
    </div>
  )
}

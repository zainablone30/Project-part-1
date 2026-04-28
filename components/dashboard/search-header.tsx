"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Search, MapPin, Bell, ShoppingBag, Mic, X } from "lucide-react"

interface SearchHeaderProps {
  userName?: string
  location?: string
  cartCount?: number
  notificationCount?: number
}

export function SearchHeader({
  userName = "Foodie",
  location = "Gulberg, Lahore",
  cartCount = 0,
  notificationCount = 2,
}: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const greetings = [
    `Kya khana hai aaj, ${userName}?`,
    `Bhook lagi hai, ${userName}?`,
    `Aaj kuch special, ${userName}?`,
    `Mood kya hai, ${userName}?`,
  ]

  const greetingIndex =
    userName
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % greetings.length
  const greeting = greetings[greetingIndex]

  const quickSearches = [
    "Biryani",
    "Burger",
    "Pizza",
    "Nihari",
    "Chai",
    "Paratha",
  ]

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Location & Greeting */}
        <div>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{location}</span>
            <span className="text-xs">▼</span>
          </button>
          <h2 className="text-xl font-bold text-foreground mt-1">{greeting}</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="relative p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          <button className="relative p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: isSearchFocused
              ? "0 10px 40px -10px rgba(255, 107, 53, 0.3)"
              : "none",
          }}
          className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-colors ${
            isSearchFocused
              ? "border-primary bg-card"
              : "border-transparent bg-muted"
          }`}
        >
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for biryani, burger, restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Quick Searches Dropdown */}
        <AnimatePresence>
          {isSearchFocused && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 p-4 bg-card rounded-2xl border border-border/50 shadow-xl z-50"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {quickSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSearchQuery(item)}
                    className="px-4 py-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm font-medium transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

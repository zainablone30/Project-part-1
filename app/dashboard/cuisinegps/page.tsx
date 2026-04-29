"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

const cuisines = [
  { name: "Italian", emoji: "🍝" },
  { name: "Chinese", emoji: "🥢" },
  { name: "Japanese", emoji: "🍱" },
  { name: "Turkish", emoji: "🥙" },
  { name: "Lebanese", emoji: "🧆" },
  { name: "Korean", emoji: "🍜" },
  { name: "Thai", emoji: "🍛" },
  { name: "Mexican", emoji: "🌮" },
]

type Restaurant = {
  name: string
  area: string
  rating: number
  specialty: string
  tip: string
}

export default function CuisineGPSPage() {
  const [cuisine, setCuisine] = useState("")
  const [results, setResults] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!cuisine) return
    setLoading(true)
    try {
      const res = await fetch("/api/cuisinegps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuisine, city: "Lahore" }),
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    }
    setLoading(false)
  }

  const selectedCuisine = cuisines.find((c) => c.name === cuisine)

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">🗺️ CuisineGPS</h1>
            <p className="text-muted-foreground">
              Lahore mein international cuisine dhundo — AI ki madad se
            </p>
          </div>

          {/* Cuisine Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {cuisines.map((c) => (
              <button
                key={c.name}
                onClick={() => setCuisine(c.name)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  cuisine === c.name
                    ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
                    : "border-border hover:border-orange-300 text-foreground"
                }`}
              >
                <span className="block text-xl mb-1">{c.emoji}</span>
                {c.name}
              </button>
            ))}
          </div>

          {/* Search Button */}
          <button
            onClick={search}
            disabled={!cuisine || loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 mb-6 hover:bg-orange-600 transition-colors"
          >
            {loading
              ? "Restaurants dhoondh raha hoon..."
              : cuisine
              ? `${selectedCuisine?.emoji} ${cuisine} restaurants Lahore mein dhundo`
              : "Pehle cuisine select karo"}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Lahore mein {cuisine} restaurants
              </p>
              {results.map((r, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-foreground text-lg">{r.name}</h3>
                    <span className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
                      ★ {r.rating}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">📍 {r.area}</p>
                  <p className="text-sm text-foreground mb-2">🍽️ Best: {r.specialty}</p>
                  <p className="text-xs text-orange-600 font-medium">💡 {r.tip}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

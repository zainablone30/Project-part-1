"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

const conditions = ["Fever", "Diabetes", "Hypertension", "Gastro", "Post-Surgery", "Pregnancy"]

const conditionEmojis: Record<string, string> = {
  Fever: "🤒",
  Diabetes: "🩸",
  Hypertension: "💊",
  Gastro: "🤢",
  "Post-Surgery": "🏥",
  Pregnancy: "🤰",
}

type DishResult = {
  id: number
  name: string
  status: "safe" | "caution" | "avoid"
  reason: string
}

const statusConfig = {
  safe: {
    bg: "bg-green-50",
    border: "border-green-400",
    text: "text-green-800",
    badge: "bg-green-100 text-green-700",
    icon: "✅",
    label: "Safe",
  },
  caution: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    text: "text-yellow-800",
    badge: "bg-yellow-100 text-yellow-700",
    icon: "⚠️",
    label: "Caution",
  },
  avoid: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: "text-red-800",
    badge: "bg-red-100 text-red-700",
    icon: "❌",
    label: "Avoid",
  },
}

export default function MediMenuPage() {
  const [selected, setSelected] = useState("")
  const [results, setResults] = useState<DishResult[]>([])
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch("/api/medimenu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition: selected }),
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">🩺 MediMenu AI</h1>
            <p className="text-muted-foreground">
              Apni condition batao, Pingu har dish rate karega
            </p>
          </div>

          {/* Condition Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {conditions.map((c) => (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  selected === c
                    ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
                    : "border-border hover:border-orange-300 text-foreground"
                }`}
              >
                <span className="block text-lg mb-1">{conditionEmojis[c]}</span>
                {c}
              </button>
            ))}
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyze}
            disabled={!selected || loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 mb-6 hover:bg-orange-600 transition-colors"
          >
            {loading ? "AI dishes analyze kar raha hai..." : "Mere liye Menu Analyze Karo 🐧"}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {selected} ke liye dish ratings
              </p>
              {results.map((item) => {
                const cfg = statusConfig[item.status] || statusConfig.caution
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border-2 ${cfg.bg} ${cfg.border}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${cfg.text}`}>
                        {cfg.icon} {item.name}
                      </span>
                      <span
                        className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 opacity-80 ${cfg.text}`}>{item.reason}</p>
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function AISuggestPage() {
  const [mood, setMood] = useState("")
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)

  const getSuggestion = async () => {
    if (!mood) return
    setLoading(true)
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: `My mood is: ${mood}. Suggest 3 Pakistani dishes I should order right now and why. Keep it fun!` }]
      })
    })
    const data = await res.json()
    setReply(data.reply)
    setLoading(false)
  }

  const moods = ["😋 Hungry", "🤒 Sick", "💪 Gym Mode", "🥳 Celebrating", "😴 Lazy", "🌙 Late Night"]

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">✨ AI Suggest</h1>
            <p className="text-muted-foreground">Pingu ko apna mood batao, woh tumhare liye khana suggest karega</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {moods.map(m => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  mood === m
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-border text-foreground hover:border-orange-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={getSuggestion}
            disabled={!mood || loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 mb-6 hover:bg-orange-600 transition-colors"
          >
            {loading ? "Pingu soch raha hai..." : "AI Suggestion Lo 🐧"}
          </button>

          {reply && (
            <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              🐧 {reply}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
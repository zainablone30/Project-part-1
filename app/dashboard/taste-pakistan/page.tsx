"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

const cities = ["Lahore", "Karachi", "Peshawar", "Islamabad", "Quetta"]

const specialties: Record<string, { dish: string; story: string; emoji: string }[]> = {
  Lahore: [
    { dish: "Lahori Chargha", story: "Marinated whole chicken, deep fried to perfection. A Lahori wedding staple.", emoji: "🍗" },
    { dish: "Paye", story: "Slow-cooked trotters since the Mughal era. Best eaten at dawn.", emoji: "🥘" },
  ],
  Karachi: [
    { dish: "Burns Road Nihari", story: "The original nihari that came with Partition in 1947. 250 years of legacy.", emoji: "🍲" },
    { dish: "Bun Kebab", story: "Karachi's answer to the burger. A working-class icon since the 1960s.", emoji: "🥙" },
  ],
  Peshawar: [
    { dish: "Chapli Kebab", story: "Flat, spiced minced meat cooked on huge tawaas. A Pakhtun identity.", emoji: "🥩" },
    { dish: "Peshawari Ice Cream", story: "Thick, rich, and served with naan. A Qissa Khwani Bazaar tradition.", emoji: "🍦" },
  ],
  Islamabad: [
    { dish: "Sajji", story: "Whole lamb roasted on open wood fire. Brought by Balochi workers.", emoji: "🍖" },
  ],
  Quetta: [
    { dish: "Quetta Saji", story: "The original Balochi saji. Slow-roasted lamb over coals for 4 hours.", emoji: "🔥" },
  ],
}

export default function TasteOfPakistanPage() {
  const [city, setCity] = useState("Lahore")

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">🇵🇰 Taste of Pakistan</h1>
            <p className="text-muted-foreground">Pakistan ka culinary heritage, city by city</p>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {cities.map(c => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  city === c
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-border text-foreground hover:border-orange-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {(specialties[city] || []).map((item, i) => (
              <div key={i} className="p-5 rounded-2xl border bg-orange-50 border-orange-200">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <h3 className="font-bold text-lg text-foreground">{item.dish}</h3>
                <p className="text-muted-foreground text-sm mt-1 italic">"{item.story}"</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
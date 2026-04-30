import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

type FoodRow = {
  id: string
  name: string
  category?: string | null
  price?: number | null
  rating?: number | null
  delivery_time?: string | null
  discount?: number | null
  is_spicy?: boolean | null
  is_veg?: boolean | null
  is_homemade?: boolean | null
  is_ai_recommended?: boolean | null
  description?: string | null
  restaurants?: { name?: string | null; area?: string | null } | { name?: string | null; area?: string | null }[] | null
}

function getRestaurant(food: FoodRow) {
  return Array.isArray(food.restaurants) ? food.restaurants[0] : food.restaurants
}

function foodLine(food: FoodRow) {
  const restaurant = getRestaurant(food)
  const tags = [
    food.is_ai_recommended ? "AI pick" : null,
    food.is_homemade ? "homemade" : null,
    food.is_spicy ? "spicy" : "mild",
    food.is_veg ? "veg" : "non-veg",
    food.discount ? `${food.discount}% off` : null,
  ].filter(Boolean).join(", ")

  return [
    `ID: ${food.id}`,
    `Dish: ${food.name}`,
    `Category: ${food.category || "general"}`,
    `Price: Rs.${food.price ?? "N/A"}`,
    `Rating: ${food.rating ?? "N/A"}`,
    `Delivery: ${food.delivery_time || "30-35 min"}`,
    `Restaurant: ${restaurant?.name || "DastarKhan"}`,
    `Area: ${restaurant?.area || "Lahore"}`,
    `Tags: ${tags}`,
    `Description: ${food.description || "No description"}`,
  ].join(" | ")
}

function fallbackReply(moodLabel: string, foods: FoodRow[]) {
  const picks = foods.slice(0, 4)

  if (picks.length === 0) {
    return "Yaar, Supabase menu abhi empty lag raha hai. Pehle foods add karo, phir Pingu mood ke hisaab se real picks dega."
  }

  const lines = picks.map((food, index) => {
    const restaurant = getRestaurant(food)
    const reason = food.is_ai_recommended
      ? "AI pick hai aur mood ke liye strong match lag raha hai."
      : food.is_spicy
        ? "Teekha, filling aur mood ko lift karega."
        : "Balanced option hai jo is mood ke saath fit hai."

    return [
      `**${index + 1}. ${food.name}** - Rs.${food.price ?? "N/A"}`,
      `Restaurant: ${restaurant?.name || "DastarKhan"}, ${restaurant?.area || "Lahore"}`,
      `Why: ${reason}`,
      `Tags: ${food.rating ?? "N/A"} rating, ${food.is_spicy ? "spicy" : "mild"}, ${food.delivery_time || "30-35 min"}`,
    ].join("\n")
  }).join("\n\n")

  return `Mood samajh gaya: ${moodLabel}. Ye real menu se best picks hain.\n\n### Mood Picks\n${lines}\n\nWant budget, spicy, healthy, ya quick delivery options?`
}

export async function POST(req: NextRequest) {
  const { mood, tip, intent } = await req.json()
  const moodLabel = typeof mood === "string" && mood.trim() ? mood.trim() : "Food mood"
  const moodTip = typeof tip === "string" ? tip.trim() : ""
  const moodIntent = typeof intent === "string" ? intent.trim() : ""

  const db = createServerSupabase()
  const { data: foods, error } = await db
    .from("foods")
    .select(`
      id,
      name,
      category,
      price,
      rating,
      delivery_time,
      discount,
      is_spicy,
      is_veg,
      is_homemade,
      is_ai_recommended,
      description,
      restaurants(name, area)
    `)
    .order("is_ai_recommended", { ascending: false })
    .order("rating", { ascending: false })
    .limit(80)

  if (error) {
    console.error("Mood foods error:", error.message)
    return NextResponse.json({ reply: "Pingu ko Supabase menu read karne mein masla aa gaya. Thori dair baad try karo." }, { status: 500 })
  }

  const menu = (foods || []) as FoodRow[]
  const menuContext = menu.length > 0 ? menu.map(foodLine).join("\n") : "No live menu rows were returned from Supabase."

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ reply: fallbackReply(moodLabel, menu) })
  }

  const prompt = `You are Pingu Chef for DastarKhan AI.

Task: recommend real Supabase menu items for the selected mood.

Selected mood: ${moodLabel}
Mood tip shown in app: ${moodTip}
Mood intent: ${moodIntent}

Rules:
- Recommend only dishes from the live Supabase menu below.
- Do not invent restaurant names, prices, ratings, or dishes.
- Match the mood strongly:
  - Celebration: premium, popular, shareable, high rating.
  - Bhookh Lagi: filling, satisfying, good value.
  - Thaka Hua: comfort food, warm, easy choice.
  - Tabiyat Kharab: light, mild, non-spicy where possible.
  - Gym Mode: protein-forward, grilled, chicken, eggs, lentils where possible.
  - Late Night: quick delivery, satisfying but not too heavy.
  - Chai Time: chai, snacks, paratha, rolls, bakery, breakfast.
  - Spicy Mood: spicy dishes only when possible.
- Reply like Pingu: warm English plus Roman Urdu.
- Keep it focused and useful.

Format exactly:
Start with one short friendly sentence.

### Mood Picks
**1. Dish Name** - Rs.price
Restaurant: Restaurant Name, Area
Why: one intelligent mood-specific reason
Tags: rating, spice/veg/home/discount/delivery if useful

End with one short follow-up question.

LIVE SUPABASE MENU:
${menuContext}`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.55,
          topP: 0.9,
          maxOutputTokens: 800,
        },
      }),
    },
  )

  const data = await response.json()

  if (!response.ok || data.error) {
    console.error("Mood Gemini error:", JSON.stringify(data))
    return NextResponse.json({ reply: fallbackReply(moodLabel, menu) })
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || fallbackReply(moodLabel, menu)
  return NextResponse.json({ reply })
}

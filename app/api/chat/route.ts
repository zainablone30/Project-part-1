import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const safeMessages = Array.isArray(messages) ? messages : []

  // Fetch the real menu from Supabase so Pingu only recommends available items.
  const db = createServerSupabase()
  const { data: foods, error: foodsError } = await db
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
    .order("rating", { ascending: false })
    .limit(40)

  if (foodsError) {
    console.error("Supabase foods error:", foodsError.message)
  }

  const menuContext = foods && foods.length > 0
    ? foods.map((f: any) => {
        const restaurant = Array.isArray(f.restaurants) ? f.restaurants[0] : f.restaurants
        const tags = [
          f.is_ai_recommended ? "AI recommended" : null,
          f.is_homemade ? "homemade" : null,
          f.is_spicy ? "spicy" : "mild",
          f.is_veg ? "veg" : "non-veg",
          f.discount ? `${f.discount}% off` : null,
        ].filter(Boolean).join(", ")

        return [
          `ID: ${f.id}`,
          `Dish: ${f.name}`,
          `Category: ${f.category || "general"}`,
          `Price: Rs.${f.price}`,
          `Rating: ${f.rating || "N/A"}`,
          `Delivery: ${f.delivery_time || "30-35 min"}`,
          `Restaurant: ${restaurant?.name || "DastarKhan"}`,
          `Area: ${restaurant?.area || "Lahore"}`,
          `Tags: ${tags}`,
          `Description: ${f.description || "No description"}`,
        ].join(" | ")
      }).join("\n")
    : "No live menu rows were returned from Supabase."

  const systemPrompt = `You are Pingu, the friendly AI food assistant for DastarKhan AI, Pakistan's smart food delivery app in Lahore.

You have live menu data from Supabase. Treat it as the only source of truth.

RULES:
- Always answer directly. Never ask multiple clarifying questions.
- Recommend only dishes that exist in the Supabase menu below.
- If the user asks for food suggestions, pick the best 3-5 matches from the menu based on mood, budget, health words, spice preference, category, rating, and restaurant area.
- If the user asks for cheap/budget food, prioritize lower prices and mention value.
- If the user asks for healthy/sick/diabetes/heart/stomach, avoid very spicy/heavy dishes when possible and explain safety simply.
- Reply in a warm mix of English and Roman Urdu, for example: "Yaar, ye try karo".
- Use food emojis naturally, but do not overdo it.
- Keep replies useful, confident, and easy to scan.
- Never say "I need more info". Give your best answer from the menu.
- Always mention dish name, price, restaurant, and one smart reason.

FORMAT:
Start with one short friendly sentence.
Then use this Markdown format exactly:

### Top Picks
**1. Dish Name** - Rs.price
Restaurant: Restaurant Name, Area
Why: one intelligent reason connected to the user's request
Tags: rating, spice/veg/home/discount/delivery if useful

End with one short follow-up like: "Want budget, spicy, healthy, ya family-size options?"

LIVE SUPABASE MENU:
${menuContext}`

  const contents = safeMessages.map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.65,
          topP: 0.9,
          maxOutputTokens: 900,
        },
      }),
    }
  )

  const data = await response.json()

  if (!response.ok || data.error) {
    console.error("Gemini API error:", JSON.stringify(data))
    return NextResponse.json({ reply: `API Error: ${data.error?.message || response.status}` })
  }

  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Maafi yaar, Pingu ko abhi response banane mein masla aa gaya. Dobara try karo."

  return NextResponse.json({ reply })
}

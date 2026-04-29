import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  // Fetch real menu from Supabase for AI context
  const db = createServerSupabase()
  const { data: foods } = await db
    .from("foods")
    .select("name, category, price, rating, is_spicy, is_veg, description, restaurants(name, area)")
    .order("rating", { ascending: false })

  const menuContext = foods && foods.length > 0
    ? `\n\nDastarKhan ka REAL MENU (yahi suggest karo):\n` +
      foods.map((f: any) =>
        `- ${f.name} | ${f.category} | Rs.${f.price} | Rating: ${f.rating}★ | ${f.is_spicy ? "Spicy🌶️" : ""} ${f.is_veg ? "Veg🥬" : ""} | ${(f.restaurants as any)?.name}, ${(f.restaurants as any)?.area} | ${f.description || ""}`
      ).join("\n")
    : ""

  const systemPrompt = `You are Pingu 🐧, the friendly AI food assistant for DastarKhan AI — Pakistan's smartest food delivery app in Lahore.

RULES:
- Always answer DIRECTLY. Never ask multiple clarifying questions.
- When asked to suggest food, immediately give 3 specific dishes from the menu below with name, price, and a one-line reason.
- Reply in a warm mix of English and Roman Urdu (e.g. "Yaar, try karo Biryani!").
- Use food emojis 🍛🔥😋 generously.
- Keep replies SHORT — max 5-6 lines.
- Never say "I need more info" — give your best answer.
- Always mention the restaurant name and price when suggesting food.${menuContext}`

  const contents = messages.map((m: { role: string; content: string }) => ({
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
    "Maafi chahta hoon, kuch masla ho gaya! 😅"

  return NextResponse.json({ reply })
}

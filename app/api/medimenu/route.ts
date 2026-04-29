import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const { condition } = await req.json()

  // Fetch real foods from Supabase
  const db = createServerSupabase()
  const { data: foods } = await db
    .from("foods")
    .select("id, name, is_spicy, is_veg, description, restaurants(name)")
    .order("name")

  const foodList = foods && foods.length > 0
    ? foods
    : [
        { id: 1, name: "Chicken Khichdi", is_spicy: false, is_veg: false, description: "rice, lentils, chicken, ginger" },
        { id: 2, name: "Biryani", is_spicy: true, is_veg: false, description: "rice, beef, spices, oil" },
        { id: 3, name: "Daal Soup", is_spicy: false, is_veg: true, description: "lentils, turmeric, salt" },
        { id: 4, name: "Nihari", is_spicy: true, is_veg: false, description: "beef, wheat, heavy spices, ghee" },
        { id: 5, name: "Fruit Chaat", is_spicy: false, is_veg: true, description: "fruits, chat masala, lemon" },
        { id: 6, name: "Grilled Chicken", is_spicy: false, is_veg: false, description: "chicken, lemon, herbs" },
      ]

  const prompt = `You are a medical nutrition AI for a Pakistani food app.
The user has: ${condition}

Here are available foods:
${foodList.map((f: any) => `- ${f.name}: ${f.is_spicy ? "spicy" : "not spicy"}, ${f.is_veg ? "vegetarian" : "non-veg"}, ${f.description || ""}`).join("\n")}

For each food, respond ONLY in this exact JSON format, nothing else:
[
  {"id": "${(foodList[0] as any).id}", "name": "Food Name", "status": "safe", "reason": "one short reason"},
  ...
]
Status must be exactly: "safe", "caution", or "avoid".
Reason must be under 10 words. Consider Pakistani medical dietary guidelines.`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    }
  )

  const data = await response.json()
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
  text = text.replace(/```json|```/g, "").trim()

  try {
    const results = JSON.parse(text)
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}

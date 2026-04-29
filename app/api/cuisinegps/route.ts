import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { cuisine, city } = await req.json()

  const prompt = `You are CuisineGPS, an AI for finding international food restaurants in Pakistan.
User wants: ${cuisine} food in ${city}, Pakistan.

Give 3 realistic restaurant suggestions. Respond ONLY in this JSON format:
[
  {
    "name": "Restaurant Name",
    "area": "area in ${city}",
    "rating": 4.2,
    "specialty": "their best dish",
    "tip": "one insider tip under 10 words"
  }
]
Make names sound realistic for Pakistan. No extra text.`

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

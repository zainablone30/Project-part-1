export type FoodHealthData = {
  name: string
  category?: string
  description?: string
  isSpicy?: boolean
  isVeg?: boolean
  allergens?: string[]   // DB-stored tags, e.g. ["Dairy","Gluten"]
}

export type ProfileHealthData = {
  health_conditions: string[]
  allergies: string[]
}

export function computeFoodWarnings(
  food: FoodHealthData,
  profile: ProfileHealthData,
): string[] {
  const { health_conditions = [], allergies = [] } = profile
  if (!health_conditions.length && !allergies.length) return []

  const warnings: string[] = []

  // ── Health condition checks (spicy / category flags) ──────────────────────
  if (health_conditions.includes("Gastro Issues") && food.isSpicy)
    warnings.push("Spicy — Gastro Issues mein mushkil ho sakti hai")

  if (health_conditions.includes("Hypertension") && food.isSpicy)
    warnings.push("Spicy — BP patients احتیاط کریں")

  if (health_conditions.includes("Post-Surgery") && food.isSpicy)
    warnings.push("Teekha — Post-Surgery mein avoid karo")

  if (health_conditions.includes("Pregnancy") && food.isSpicy)
    warnings.push("Spicy — Pregnancy mein احتیاط کریں")

  if (health_conditions.includes("Diabetes") && food.category === "Dessert")
    warnings.push("High sugar — Diabetes mein احتیاط کریں")

  if (
    health_conditions.includes("Heart Condition") &&
    !food.isVeg &&
    /bbq|fried|karahi|seekh|kebab|nihari/i.test(
      [food.name, food.category].filter(Boolean).join(" ")
    )
  )
    warnings.push("High fat — Heart patients doctor se consult karein")

  // ── Allergy checks: prefer DB allergen tags, fall back to keyword match ──
  for (const allergen of allergies) {
    // Exact match from DB (most reliable)
    if (food.allergens?.includes(allergen)) {
      warnings.push(`Contains ${allergen} — ${allergen} allergy alert!`)
      continue
    }
    // Keyword fallback for foods without allergen tags yet
    const combined = [food.name, food.category, food.description]
      .filter(Boolean)
      .join(" ")
    const fallbackPatterns: Record<string, RegExp> = {
      Nuts:    /badam|kaju|pista|almond|cashew|pistachio|peanut/i,
      Dairy:   /kheer|halwa|lassi|dahi|raita|paneer|malai|khoya|rabri|firni/i,
      Gluten:  /paratha|naan|roti|bread|roll|puri|kulcha/i,
      Eggs:    /\begg\b|\banda\b|omelet|anday/i,
      Seafood: /\bfish\b|mahi|jhinga|prawn|shrimp|machli/i,
      Sesame:  /\btil\b|sesame|tahini/i,
    }
    if (fallbackPatterns[allergen]?.test(combined)) {
      warnings.push(`May contain ${allergen} — ${allergen} allergy alert!`)
    }
  }

  return warnings
}

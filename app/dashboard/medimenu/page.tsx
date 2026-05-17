"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { Plus, ShoppingCart, Check, Star, Clock, Flame, AlertTriangle } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { useCart } from "@/lib/cart-context"

const moodOptions = [
  { id: "hungry",    label: "Hungry",      emoji: "😋", hint: "Filling and satisfying" },
  { id: "tired",     label: "Tired",       emoji: "😴", hint: "Comfort and warm" },
  { id: "celebrate", label: "Celebration", emoji: "🥳", hint: "Special and shareable" },
  { id: "sick",      label: "Feeling sick",emoji: "🤒", hint: "Light and mild" },
  { id: "gym",       label: "Gym mode",    emoji: "💪", hint: "Protein-focused" },
  { id: "late",      label: "Late night",  emoji: "🌙", hint: "Quick cravings" },
  { id: "chai",      label: "Chai time",   emoji: "☕", hint: "Snacks and nashta" },
  { id: "spicy",     label: "Spicy mood",  emoji: "🔥", hint: "Bold, spicy picks" },
]

const healthOptions = [
  { label: "Fever",        emoji: "🤒" },
  { label: "Diabetes",     emoji: "🩸" },
  { label: "Hypertension", emoji: "💊" },
  { label: "Gastro",       emoji: "🤢" },
  { label: "Post-Surgery", emoji: "🏥" },
  { label: "Pregnancy",    emoji: "🤰" },
]

const dietOptions = [
  { label: "Vegetarian",  emoji: "🥗" },
  { label: "High Protein",emoji: "🏋️" },
  { label: "Low Carb",    emoji: "🥦" },
  { label: "Low Spice",   emoji: "🧂" },
  { label: "Dairy-Free",  emoji: "🥛" },
  { label: "Gluten-Free", emoji: "🌾" },
]

type MediMenuItem = {
  id: string
  name: string
  image: string
  restaurant: string
  area: string
  description: string
  calories_kcal: number | null
  benefits: string
  ingredients: string[]
  allergens: string[]
  reason: string
  tags: string[]
  price: number | null
  rating: number | null
  delivery_time: string | null
}

function toggle(arr: string[], v: string) {
  return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]
}

function fmtList(arr: string[]) {
  return arr.length ? arr.join(", ") : "None"
}

// Per-card add-to-cart button with brief "Added!" feedback
function AddToCartBtn({ item }: { item: MediMenuItem }) {
  const { addItem, items } = useCart()
  const [flash, setFlash] = useState(false)
  const inCart = items.some(i => i.foodId === item.id)

  function handle() {
    if (!item.price) return
    addItem({
      foodId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantName: item.restaurant,
      restaurantArea: item.area,
    })
    setFlash(true)
    setTimeout(() => setFlash(false), 1500)
  }

  if (!item.price) return null

  return (
    <button
      onClick={handle}
      className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold shadow-sm transition-all active:scale-95 ${
        flash
          ? "bg-emerald-500 text-white"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      {flash ? (
        <>
          <Check className="w-4 h-4" />
          Added!
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Add to Cart
          {inCart && (
            <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs">
              {items.filter(i => i.foodId === item.id).reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </>
      )}
    </button>
  )
}

export default function MediMenuPage() {
  const [selectedMood, setSelectedMood] = useState<(typeof moodOptions)[number] | null>(null)
  const [health, setHealth] = useState<string[]>([])
  const [diet, setDiet]     = useState<string[]>([])
  const [notes, setNotes]   = useState("")
  const [results, setResults] = useState<MediMenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { openCart, items } = useCart()

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)
  const hasSelection = Boolean(selectedMood || health.length || diet.length || notes.trim())

  async function analyze() {
    if (!hasSelection) {
      setMessage("Select mood, health, diet, ya notes add karo.")
      return
    }
    setLoading(true)
    setMessage("")
    setResults([])
    try {
      const res = await fetch("/api/medimenu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood?.label || "",
          health,
          diet,
          notes: notes.trim(),
        }),
      })
      const data = await res.json()
      setResults(data.items || [])
      if (data.message) setMessage(data.message)
      if (!data.items?.length) {
        setMessage(data.message || "No picks returned. Try another selection.")
      }
    } catch (err) {
      console.error(err)
      setMessage("Network masla lag raha hai. Thori dair baad try karo.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-background to-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="rounded-[28px] border border-border/60 bg-gradient-to-br from-white via-white to-orange-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm text-xl">
                  🩺
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">MediMenu AI</h1>
                  <p className="text-muted-foreground">
                    Mood, health, ya diet select karo. Personalized menu picks milen.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">Mood-aware</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Health-aware</span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">Diet-aware</span>
                {cartCount > 0 && (
                  <button
                    onClick={openCart}
                    className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    {cartCount} in cart
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Selectors */}
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              {/* Mood */}
              <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-1">Mood</h2>
                <p className="text-sm text-muted-foreground mb-4">Pick one mood for smarter picks.</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {moodOptions.map(mood => {
                    const active = selectedMood?.id === mood.id
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setSelectedMood(active ? null : mood)}
                        className={`rounded-2xl border-2 p-3 text-left transition-all ${
                          active
                            ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
                            : "border-transparent bg-muted/60 hover:border-orange-200"
                        }`}
                      >
                        <div className="text-2xl">{mood.emoji}</div>
                        <p className="mt-2 text-sm font-semibold">{mood.label}</p>
                        <p className="text-xs text-muted-foreground">{mood.hint}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Health */}
              <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-1">Health</h2>
                <p className="text-sm text-muted-foreground mb-4">Select health conditions (multi).</p>
                <div className="flex flex-wrap gap-2">
                  {healthOptions.map(o => {
                    const active = health.includes(o.label)
                    return (
                      <button
                        key={o.label}
                        onClick={() => setHealth(toggle(health, o.label))}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          active
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-border bg-background hover:border-emerald-200"
                        }`}
                      >
                        {o.emoji} {o.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Diet */}
              <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-1">Diet</h2>
                <p className="text-sm text-muted-foreground mb-4">Select diet preferences (multi).</p>
                <div className="flex flex-wrap gap-2">
                  {dietOptions.map(o => {
                    const active = diet.includes(o.label)
                    return (
                      <button
                        key={o.label}
                        onClick={() => setDiet(toggle(diet, o.label))}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          active
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-border bg-background hover:border-indigo-200"
                        }`}
                      >
                        {o.emoji} {o.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Notes */}
              <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-1">Extra Notes</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Example: lactose intolerant, low spice, gym cut, heart friendly.
                </p>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add notes for AI..."
                  className="min-h-[110px] w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>

              {/* Analyze */}
              <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-1">Your Selection</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Mood: {selectedMood?.label || "None"} · Health: {fmtList(health)} · Diet: {fmtList(diet)}
                </p>
                <button
                  onClick={analyze}
                  disabled={!hasSelection || loading}
                  className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-white font-semibold shadow-sm transition-colors hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? "AI menu analyze kar raha hai…" : "Mere liye MediMenu banao 🐧"}
                </button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Calories and ingredients are AI estimates. Allergens come from Supabase tags.
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {message}
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">AI Picks</h2>
                  <p className="text-xs text-muted-foreground">{results.length} dishes matched</p>
                </div>

                {results.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-border/60 bg-card shadow-sm overflow-hidden"
                  >
                    {/* Food image */}
                    <div className="relative aspect-[16/7] w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Overlay badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        {item.allergens.length > 0 && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                            <AlertTriangle className="w-3 h-3" />
                            {item.allergens.length} allergen{item.allergens.length > 1 ? "s" : ""}
                          </span>
                        )}
                        {item.rating && (
                          <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {item.rating}
                          </span>
                        )}
                        {item.delivery_time && (
                          <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {item.delivery_time}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <div className="absolute bottom-3 left-4 z-10">
                        <h3 className="text-xl font-bold text-white drop-shadow">{item.name}</h3>
                        <p className="text-sm text-white/80">{item.restaurant} · {item.area}</p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      {/* Tags + price + Add to Cart */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {item.tags.map(tag => (
                            <span key={tag} className="rounded-full bg-muted px-3 py-1 text-foreground">
                              {tag}
                            </span>
                          ))}
                          {item.price !== null && (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700 font-semibold">
                              Rs. {item.price}
                            </span>
                          )}
                        </div>

                        <AddToCartBtn item={item} />
                      </div>

                      <p className="mt-3 text-sm text-foreground font-medium">{item.reason}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>

                      {/* Stats */}
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-muted/50 p-3">
                          <p className="text-xs font-semibold text-muted-foreground">Calories (est.)</p>
                          <p className="text-sm font-semibold text-foreground">
                            {item.calories_kcal ? `${item.calories_kcal} kcal` : "N/A"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-muted/50 p-3 sm:col-span-2">
                          <p className="text-xs font-semibold text-muted-foreground">Benefits</p>
                          <p className="text-sm text-foreground">{item.benefits}</p>
                        </div>
                      </div>

                      {/* Ingredients + Allergens */}
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-muted/50 p-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Ingredients (est.)</p>
                          {item.ingredients.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {item.ingredients.map(ing => (
                                <span key={ing} className="rounded-full bg-background px-2.5 py-1 text-xs text-foreground border border-border/50">
                                  {ing}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">Not available</p>
                          )}
                        </div>
                        <div className="rounded-2xl bg-muted/50 p-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Allergens</p>
                          {item.allergens.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {item.allergens.map(a => (
                                <span key={a} className="rounded-full bg-rose-100 px-2.5 py-1 text-xs text-rose-700 font-medium">
                                  {a}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">No allergen tags</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Sticky cart summary */}
                {cartCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky bottom-4 rounded-3xl bg-orange-500 px-5 py-4 shadow-2xl flex items-center justify-between"
                  >
                    <div className="text-white">
                      <p className="font-bold text-lg">{cartCount} item{cartCount > 1 ? "s" : ""} in cart</p>
                      <p className="text-white/80 text-sm">
                        Rs. {items.reduce((s, i) => s + i.price * i.quantity, 0)}
                      </p>
                    </div>
                    <button
                      onClick={openCart}
                      className="flex items-center gap-2 rounded-2xl bg-white text-orange-600 font-bold px-5 py-2.5 hover:bg-orange-50 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      View Cart
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

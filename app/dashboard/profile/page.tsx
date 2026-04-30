"use client"

import { useState, useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { supabase } from "@/lib/supabase"
import { User, MapPin, Phone, Mail, Heart, Edit2, Check, Loader2, AlertTriangle } from "lucide-react"

const healthConditions = [
  "Diabetes", "Hypertension", "Gastro Issues", "Post-Surgery",
  "Pregnancy", "Heart Condition", "None",
]

const allergenOptions = [
  { label: "Nuts", emoji: "🥜" },
  { label: "Dairy", emoji: "🥛" },
  { label: "Gluten", emoji: "🌾" },
  { label: "Eggs", emoji: "🥚" },
  { label: "Seafood", emoji: "🦐" },
  { label: "Sesame", emoji: "🌿" },
]

function normalizeStringArray(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string")
  }

  return fallback
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    location: "Gulberg III, Lahore",
    health_conditions: ["None"] as string[],
    allergies: [] as string[],
    email: "",
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      setProfile((prev) => ({ ...prev, email: session.user.email || "" }))

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          location: data.location || "Gulberg III, Lahore",
          health_conditions: normalizeStringArray(data.health_conditions, ["None"]).length
            ? normalizeStringArray(data.health_conditions, ["None"])
            : ["None"],
          allergies: normalizeStringArray(data.allergies),
          email: session.user.email || "",
        })
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const toggleCondition = (condition: string) => {
    if (!editing) return
    if (condition === "None") {
      setProfile((prev) => ({ ...prev, health_conditions: ["None"] }))
      return
    }
    setProfile((prev) => {
      const without = normalizeStringArray(prev.health_conditions, ["None"]).filter((c) => c !== "None")
      if (without.includes(condition)) {
        const updated = without.filter((c) => c !== condition)
        return { ...prev, health_conditions: updated.length === 0 ? ["None"] : updated }
      }
      return { ...prev, health_conditions: [...without, condition] }
    })
  }

  const toggleAllergen = (allergen: string) => {
    if (!editing) return
    setProfile((prev) => ({
      ...prev,
      allergies: normalizeStringArray(prev.allergies).includes(allergen)
        ? normalizeStringArray(prev.allergies).filter((a) => a !== allergen)
        : [...normalizeStringArray(prev.allergies), allergen],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          health_conditions: normalizeStringArray(profile.health_conditions, ["None"]),
          allergies: normalizeStringArray(profile.allergies),
          profile_completed: true,
        })
        .eq("id", session.user.id)
    }
    setSaving(false)
    setEditing(false)
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"
  const selectedHealthConditions = normalizeStringArray(profile.health_conditions, ["None"])
  const selectedAllergies = normalizeStringArray(profile.allergies)

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Mera Profile</h1>
              <p className="text-muted-foreground">Apni info aur health preferences manage karo</p>
            </div>
            <button
              onClick={editing ? handleSave : () => setEditing(true)}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${editing ? "bg-orange-500 text-white" : "bg-muted text-foreground hover:bg-muted/80"}`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editing ? (
                <><Check className="w-4 h-4" /> Save</>
              ) : (
                <><Edit2 className="w-4 h-4" /> Edit</>
              )}
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* Avatar + Name */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl text-white font-bold shadow-lg">
                    {initials}
                  </div>
                  <div className="flex-1">
                    {editing ? (
                      <input
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="text-xl font-bold bg-white border-2 border-orange-300 rounded-lg px-3 py-1 w-full mb-1 focus:outline-none focus:border-orange-500"
                        placeholder="Full Name"
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-foreground">{profile.full_name || "Set your name"}</h2>
                    )}
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <span className="inline-block mt-1 text-xs px-3 py-1 bg-orange-500 text-white rounded-full font-medium">
                      🐧 Pingu Food Lover
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Location</p>
                    {editing ? (
                      <input
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="font-semibold text-foreground bg-muted rounded-lg px-2 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    ) : (
                      <p className="font-semibold text-foreground">{profile.location}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Phone</p>
                    {editing ? (
                      <input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+92 300 0000000"
                        className="font-semibold text-foreground bg-muted rounded-lg px-2 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                      />
                    ) : (
                      <p className="font-semibold text-foreground">{profile.phone || "Add phone number"}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Email</p>
                    <p className="font-semibold text-foreground">{profile.email}</p>
                  </div>
                </div>
              </div>

              {/* Health Conditions */}
              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-foreground">Health Conditions</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  MediMenu AI in conditions ko use karega tumhare liye safe dishes suggest karne ke liye
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {healthConditions.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => toggleCondition(condition)}
                      className={`p-2.5 rounded-xl border text-sm font-medium transition-all ${
                        selectedHealthConditions.includes(condition)
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-border text-muted-foreground"
                      } ${editing ? "hover:border-orange-300 cursor-pointer" : "cursor-default"}`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Allergies */}
              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-foreground">Food Allergies</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Pingu har dish pe warning banner dikhayega jab allergy match ho
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {allergenOptions.map(({ label, emoji }) => (
                    <button
                      key={label}
                      onClick={() => toggleAllergen(label)}
                      className={`p-2.5 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                        selectedAllergies.includes(label)
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-border text-muted-foreground"
                      } ${editing ? "hover:border-amber-300 cursor-pointer" : "cursor-default"}`}
                    >
                      <span className="text-lg">{emoji}</span>
                      {label}
                    </button>
                  ))}
                </div>
                {selectedAllergies.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-3">
                    {editing ? "Koi allergen select nahi hua" : "Koi allergy set nahi hai"}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

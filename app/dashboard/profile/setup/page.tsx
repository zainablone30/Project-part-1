"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Heart, AlertTriangle, Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PinguChef } from "@/components/pingu-chef"

const healthConditions = [
  { label: "Diabetes", emoji: "🩸" },
  { label: "Hypertension", emoji: "💊" },
  { label: "Gastro Issues", emoji: "🤢" },
  { label: "Post-Surgery", emoji: "🏥" },
  { label: "Pregnancy", emoji: "🤰" },
  { label: "Heart Condition", emoji: "❤️" },
]

const allergenOptions = [
  { label: "Nuts", emoji: "🥜" },
  { label: "Dairy", emoji: "🥛" },
  { label: "Gluten", emoji: "🌾" },
  { label: "Eggs", emoji: "🥚" },
  { label: "Seafood", emoji: "🦐" },
  { label: "Sesame", emoji: "🌿" },
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [noneConditions, setNoneConditions] = useState(false)
  const [noAllergies, setNoAllergies] = useState(false)

  useEffect(() => {
    async function checkComplete() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace("/login"); return }

      const { data } = await supabase
        .from("profiles")
        .select("profile_completed")
        .eq("id", session.user.id)
        .single()

      if (data?.profile_completed) router.replace("/dashboard")
    }
    checkComplete()
  }, [router])

  function toggleCondition(label: string) {
    setNoneConditions(false)
    setSelectedConditions((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    )
  }

  function toggleAllergen(label: string) {
    setNoAllergies(false)
    setSelectedAllergies((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    )
  }

  async function handleFinish() {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const conditions =
        noneConditions || selectedConditions.length === 0 ? ["None"] : selectedConditions

      await supabase
        .from("profiles")
        .update({
          health_conditions: conditions,
          allergies: noAllergies ? [] : selectedAllergies,
          profile_completed: true,
        })
        .eq("id", session.user.id)
    }
    setSaving(false)
    router.replace("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Step dots */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              s <= step ? "bg-primary w-12" : "bg-muted w-8"
            }`}
          />
        ))}
        <span className="ml-2 text-xs text-muted-foreground font-medium">
          Step {step} of 2
        </span>
      </div>

      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="bg-card rounded-3xl p-8 border border-border shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Health Conditions</h2>
                  <p className="text-sm text-muted-foreground">Apni health conditions batao</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6 p-3 bg-muted rounded-xl">
                Pingu AI in conditions ke hisaab se tumhare liye safe dishes suggest karega aur warnings dikhayega.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {healthConditions.map(({ label, emoji }) => (
                  <button
                    key={label}
                    onClick={() => toggleCondition(label)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      selectedConditions.includes(label)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <span className="text-xl">{emoji}</span>
                    <p className="text-sm font-medium mt-1">{label}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => { setNoneConditions(true); setSelectedConditions([]) }}
                className={`w-full p-3 rounded-2xl border-2 text-sm font-medium transition-all mb-6 ${
                  noneConditions
                    ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                    : "border-border text-muted-foreground hover:border-green-400"
                }`}
              >
                ✅ None — Main bilkul healthy hun!
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="bg-card rounded-3xl p-8 border border-border shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Food Allergies</h2>
                  <p className="text-sm text-muted-foreground">Apni food allergies batao</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6 p-3 bg-muted rounded-xl">
                Jis cheez se allergy ho woh select karo. Pingu har dish pe warning banner dikhayega.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {allergenOptions.map(({ label, emoji }) => (
                  <button
                    key={label}
                    onClick={() => toggleAllergen(label)}
                    className={`p-3.5 rounded-2xl border-2 text-center transition-all ${
                      selectedAllergies.includes(label)
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                        : "border-border text-muted-foreground hover:border-amber-400"
                    }`}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <p className="text-xs font-medium mt-1.5">{label}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => { setNoAllergies(true); setSelectedAllergies([]) }}
                className={`w-full p-3 rounded-2xl border-2 text-sm font-medium transition-all mb-6 ${
                  noAllergies
                    ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                    : "border-border text-muted-foreground hover:border-green-400"
                }`}
              >
                ✅ Koi allergy nahi hai
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-4 border-2 border-border rounded-2xl font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70 hover:opacity-90 transition-opacity"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <><Check className="w-5 h-5" /> Done!</>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3 mt-6">
          <PinguChef size="sm" showQuote={false} mood="happy" />
          <p className="text-sm text-muted-foreground">
            {step === 1
              ? "Teri health care meri responsibility! 🐧"
              : "Almost done! Pingu ready hai tumhare liye! 🐧"}
          </p>
        </div>
      </div>
    </div>
  )
}

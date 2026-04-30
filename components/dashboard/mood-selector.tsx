"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sparkles } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Spinner } from "@/components/ui/spinner"

const moodMeta = [
  { emoji: "😋", color: "from-orange-400 to-red-500", intent: "hungry filling food" },
  { emoji: "😴", color: "from-blue-400 to-purple-500", intent: "comfort food for tired mood" },
  { emoji: "🥳", color: "from-pink-400 to-yellow-500", intent: "celebration party food" },
  { emoji: "🤒", color: "from-green-400 to-teal-500", intent: "light mild food for feeling sick" },
  { emoji: "💪", color: "from-red-400 to-orange-500", intent: "protein gym food" },
  { emoji: "🌙", color: "from-indigo-400 to-purple-600", intent: "late night cravings" },
  { emoji: "☕", color: "from-amber-400 to-orange-500", intent: "chai snacks breakfast" },
  { emoji: "🔥", color: "from-red-500 to-orange-600", intent: "spicy food" },
]

type MoodOption = (typeof moodMeta)[number] & {
  label: string
  tip: string
}

interface MoodSelectorProps {
  onMoodSelect?: (mood: MoodOption) => void
}

function renderInline(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }

    return <span key={index}>{part}</span>
  })
}

function FormattedMoodReply({ content }: { content: string }) {
  return (
    <div className="space-y-1.5 leading-relaxed">
      {content.split("\n").map((line, index) => {
        const trimmed = line.trim()

        if (!trimmed) {
          return <div key={index} className="h-1" />
        }

        if (trimmed.startsWith("### ")) {
          return (
            <p key={index} className="pt-1 text-[13px] font-bold uppercase tracking-wide text-primary">
              {trimmed.replace(/^###\s+/, "")}
            </p>
          )
        }

        if (/^\*\*\d+\./.test(trimmed)) {
          return (
            <p key={index} className="mt-2 rounded-xl bg-white/70 px-3 py-2 font-semibold text-foreground shadow-sm">
              {renderInline(trimmed)}
            </p>
          )
        }

        const labelMatch = trimmed.match(/^(Restaurant|Why|Tags|Price|Area):\s*(.*)$/i)
        if (labelMatch) {
          return (
            <p key={index} className="text-muted-foreground">
              <span className="font-semibold text-foreground">{labelMatch[1]}:</span> {labelMatch[2]}
            </p>
          )
        }

        return <p key={index}>{renderInline(trimmed)}</p>
      })}
    </div>
  )
}

export function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  const { t } = useLanguage()
  const moods = moodMeta.map((meta, index) => ({
    ...meta,
    label: t(`mood_label_${index + 1}`),
    tip: t(`mood_tip_${index + 1}`),
  }))
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null)
  const [recommendation, setRecommendation] = useState("")
  const [isRecommending, setIsRecommending] = useState(false)

  const handleMoodSelect = async (mood: MoodOption) => {
    setSelectedMood(mood)
    onMoodSelect?.(mood)
    setRecommendation("")
    setIsRecommending(true)

    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: mood.label,
          tip: mood.tip,
          intent: mood.intent,
        }),
      })
      const data = await res.json()
      setRecommendation(data.reply || "Pingu ko mood picks nahi milay. Dobara try karo.")
    } catch {
      setRecommendation("Network masla lag raha hai yaar. Thori dair baad mood picks try karo.")
    } finally {
      setIsRecommending(false)
    }
  }

  return (
    <div className="rounded-3xl border border-border/50 bg-card p-4 shadow-lg sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {t("dashboard_mood_title")}
          </h3>
          <p className="text-sm text-muted-foreground">{t("dashboard_mood_subtitle")}</p>
        </div>
        {selectedMood && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`px-4 py-2 rounded-full bg-gradient-to-r ${selectedMood.color} text-white font-medium text-sm`}
          >
            {selectedMood.emoji} {selectedMood.label}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleMoodSelect(mood)}
            disabled={isRecommending && selectedMood?.label === mood.label}
            className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 disabled:cursor-wait disabled:opacity-80 ${
              selectedMood?.label === mood.label
                ? `bg-gradient-to-br ${mood.color} border-transparent text-white`
                : "bg-muted/50 border-transparent hover:border-primary/30 hover:bg-muted"
            }`}
          >
            <motion.span
              className="text-3xl block mb-2"
              whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3 }}
            >
              {mood.emoji}
            </motion.span>
            <p className={`text-xs font-medium ${selectedMood?.label === mood.label ? "text-white" : "text-foreground"}`}>
              {mood.label}
            </p>

            <AnimatePresence>
              {selectedMood?.label !== mood.label && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {mood.tip}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
        >
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <span className="font-semibold text-foreground">{t("pingu_chef_label")}:</span>{" "}
              {isRecommending ? `"${selectedMood.tip}" - ${t("pingu_searching")}` : `"${selectedMood.tip}"`}
            </p>
            {isRecommending ? (
              <div className="flex items-center gap-2 rounded-xl bg-background/70 px-3 py-2 text-foreground">
                <Spinner className="h-4 w-4 text-primary" />
                <span>Pingu tumhare mood ke liye best picks tayyar kar raha hai...</span>
              </div>
            ) : recommendation ? (
              <FormattedMoodReply content={recommendation} />
            ) : null}
          </div>
        </motion.div>
      )}
    </div>
  )
}

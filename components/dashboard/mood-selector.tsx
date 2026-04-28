"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sparkles } from "lucide-react"

const moods = [
  { emoji: "😋", label: "Bhookh Lagi", color: "from-orange-400 to-red-500", urdu: "Kuch mazedaar khana hai!" },
  { emoji: "😴", label: "Thaka Hua", color: "from-blue-400 to-purple-500", urdu: "Comfort food chahiye..." },
  { emoji: "🥳", label: "Celebration", color: "from-pink-400 to-yellow-500", urdu: "Party time! Biryani lao!" },
  { emoji: "🤒", label: "Tabiyat Kharab", color: "from-green-400 to-teal-500", urdu: "Halka khana suggest karo" },
  { emoji: "💪", label: "Gym Mode", color: "from-red-400 to-orange-500", urdu: "Protein wala khana do!" },
  { emoji: "🌙", label: "Late Night", color: "from-indigo-400 to-purple-600", urdu: "Raat ki bhook hai..." },
  { emoji: "☕", label: "Chai Time", color: "from-amber-400 to-orange-500", urdu: "Chai aur nashta!" },
  { emoji: "🔥", label: "Spicy Mood", color: "from-red-500 to-orange-600", urdu: "Teekha khana chahiye!" },
]

interface MoodSelectorProps {
  onMoodSelect?: (mood: typeof moods[0]) => void
}

export function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMoodSelect = (mood: typeof moods[0]) => {
    setSelectedMood(mood)
    onMoodSelect?.(mood)
    setIsExpanded(false)
  }

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Aaj ka Mood Kya Hai?
          </h3>
          <p className="text-sm text-muted-foreground">AI tumhare mood ke hisaab se khana dhundega</p>
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

      <div className="grid grid-cols-4 gap-3">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleMoodSelect(mood)}
            className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 ${
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
            
            {/* Tooltip */}
            <AnimatePresence>
              {selectedMood?.label !== mood.label && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {mood.urdu}
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
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Pingu Chef:</span>{" "}
            {`"${selectedMood.urdu}" - Main dhund raha hoon perfect khana! 🐧`}
          </p>
        </motion.div>
      )}
    </div>
  )
}

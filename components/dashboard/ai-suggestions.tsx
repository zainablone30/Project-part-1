"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sparkles, Heart, Stethoscope, Globe, ChefHat, ArrowRight } from "lucide-react"
import { PinguChef } from "@/components/pingu-chef"

const aiModes = [
  {
    id: "medimenu",
    name: "MediMenu AI",
    nameUrdu: "صحت کا ساتھی",
    description: "Health conditions ke hisaab se khana",
    icon: Stethoscope,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    features: ["Diabetes Friendly", "Heart Healthy", "Low Sodium"],
    quote: "Sehat bhi, mazaa bhi! 💪",
  },
  {
    id: "cuisinegps",
    name: "CuisineGPS",
    nameUrdu: "کھانے کی رہنمائی",
    description: "Foreign food ko local taste mein dhundo",
    icon: Globe,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    features: ["Similar Taste", "Local Options", "Price Match"],
    quote: "Duniya ka khana, apni mitti ka swad! 🌍",
  },
  {
    id: "tasteofpakistan",
    name: "Taste of Pakistan",
    nameUrdu: "پاکستان کا ذائقہ",
    description: "Authentic desi khana for tourists",
    icon: Heart,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-500/10",
    features: ["Must Try", "Regional Special", "Street Food"],
    quote: "Pakistan ke zaike se milao! 🇵🇰",
  },
  {
    id: "smartkitchen",
    name: "Smart Kitchen",
    nameUrdu: "ذہین باورچی خانہ",
    description: "Ghar ke ingredients se recipes",
    icon: ChefHat,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500/10",
    features: ["Waste Less", "Budget Friendly", "Quick Recipes"],
    quote: "Jo hai ghar mein, wohi hai khaane mein! 🏠",
  },
]

export function AISuggestions() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const currentMode = aiModes.find((m) => m.id === selectedMode)

  return (
    <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">AI Food Assistant</h3>
          <p className="text-sm text-muted-foreground">Apna mode choose karo</p>
        </div>
      </div>

      {/* AI Mode Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {aiModes.map((mode, index) => {
          const Icon = mode.icon
          const isSelected = selectedMode === mode.id

          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedMode(isSelected ? null : mode.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? `bg-gradient-to-br ${mode.color} border-transparent text-white`
                  : `${mode.bgColor} border-transparent hover:border-primary/30`
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
                  isSelected ? "bg-white/20" : `bg-gradient-to-br ${mode.color}`
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-white"}`} />
              </div>
              <h4 className={`font-bold text-sm mb-1 ${isSelected ? "text-white" : "text-foreground"}`}>
                {mode.name}
              </h4>
              <p className={`text-xs ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                {mode.description}
              </p>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Selected Mode Details */}
      <AnimatePresence>
        {currentMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentMode.color} text-white`}>
              <div className="flex items-start gap-4">
                <PinguChef size="sm" showQuote={false} mood="happy" />
                <div className="flex-1">
                  <p className="font-medium mb-2">{`Pingu: "${currentMode.quote}"`}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {currentMode.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 rounded-full bg-white/20 text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-foreground font-semibold text-sm hover:bg-white/90 transition-colors">
                    Shuru Karo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

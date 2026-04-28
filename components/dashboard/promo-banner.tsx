"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PinguChef } from "@/components/pingu-chef"

const promos = [
  {
    id: 1,
    title: "Biryani Festival!",
    subtitle: "50% OFF on all biryanis",
    description: "Eid ki khushiyan, biryani ke saath!",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    emoji: "🍛",
    code: "BIRYANI50",
  },
  {
    id: 2,
    title: "Free Delivery Week",
    subtitle: "Rs. 0 delivery on orders above Rs. 500",
    description: "Delivery free, khushi double!",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    emoji: "🚀",
    code: "FREEDEL",
  },
  {
    id: 3,
    title: "Chai & Paratha Deal",
    subtitle: "Rs. 199 only",
    description: "Subah ki nashta, din ki shuruwat!",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    emoji: "☕",
    code: "NASHTA199",
  },
  {
    id: 4,
    title: "Late Night Cravings",
    subtitle: "20% OFF after 10 PM",
    description: "Raat ki bhook, Pingu ka saath!",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    emoji: "🌙",
    code: "NIGHT20",
  },
]

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % promos.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length)
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % promos.length)
  }

  const currentPromo = promos[currentIndex]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentPromo.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`relative p-6 bg-gradient-to-r ${currentPromo.gradient} text-white min-h-[200px]`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-4xl mb-2 block">{currentPromo.emoji}</span>
                <h3 className="text-2xl font-bold mb-1">{currentPromo.title}</h3>
                <p className="text-lg font-medium opacity-90 mb-2">{currentPromo.subtitle}</p>
                <p className="text-sm opacity-80 mb-4">{currentPromo.description}</p>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm font-mono font-bold text-sm">
                    {currentPromo.code}
                  </span>
                  <button className="px-4 py-2 rounded-full bg-white text-foreground font-semibold text-sm hover:bg-white/90 transition-colors">
                    Use Karo
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Pingu Chef */}
            <div className="hidden md:block">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <PinguChef size="lg" showQuote={false} mood="celebrating" />
              </motion.div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "w-6 bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

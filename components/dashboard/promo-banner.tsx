"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PinguChef } from "@/components/pingu-chef"
import { useLanguage } from "@/components/language-provider"

const promoMeta = [
  {
    id: 1,
    gradient: "from-orange-500 via-red-500 to-pink-500",
    emoji: "🍛",
    code: "BIRYANI50",
  },
  {
    id: 2,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    emoji: "🚀",
    code: "FREEDEL",
  },
  {
    id: 3,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    emoji: "☕",
    code: "NASHTA199",
  },
  {
    id: 4,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    emoji: "🌙",
    code: "NIGHT20",
  },
]

export function PromoBanner() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % promos.length)
    }, 3000)

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

  const promos = promoMeta.map((promo) => ({
    ...promo,
    title: t(`promo_${promo.id}_title`),
    subtitle: t(`promo_${promo.id}_subtitle`),
    description: t(`promo_${promo.id}_desc`),
  }))
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
          className={`relative min-h-[220px] bg-gradient-to-r ${currentPromo.gradient} p-4 text-white sm:min-h-[200px] sm:p-6`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="mb-2 block text-3xl sm:text-4xl">{currentPromo.emoji}</span>
                <h3 className="mb-1 text-xl font-bold leading-tight sm:text-2xl">{currentPromo.title}</h3>
                <p className="mb-2 text-base font-medium opacity-90 sm:text-lg">{currentPromo.subtitle}</p>
                <p className="mb-4 text-sm opacity-80">{currentPromo.description}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="rounded-full bg-white/20 px-3 py-2 font-mono text-xs font-bold backdrop-blur-sm sm:px-4 sm:text-sm">
                    {currentPromo.code}
                  </span>
                  <button className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-white/90 sm:px-4 sm:text-sm">
                    {t("promo_use")}
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
      {/* Side buttons removed by request */}

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

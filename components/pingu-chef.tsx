"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { TargetAndTransition } from "motion/react"

const desiQuotes = [
  "Bhook lagi hai? Main hoon na! 🍛",
  "Biryani ke bina zindagi adhoori hai, yaar!",
  "Paratha khao, duniya bhool jao! 🫓",
  "Chai ke bina kaam? Impossible!",
  "Nihari slow hai, but worth the wait!",
  "Halwa puri ka time ho gaya! 🤤",
  "Seekh kebab ready ho raha hai...",
  "Ghar ka khana, jannat ka khazana!",
  "Lassi pee lo, garmi bhool jao! 🥛",
  "Samosa garam hai, jaldi karo!",
  "Karahi mein magic ho raha hai! ✨",
  "Pet pooja ka time hai, boss!",
  "Daal chawal = sukoon ki recipe",
  "Kheer bana raha hoon, ruko zara!",
  "Anda paratha > everything else",
  "Paye ready hain, aa jao mehman!",
  "Rabri khao, zindagi muskurao! 😋",
  "Chaat masala lagao, mood banao!",
  "Naan fresh hai, butter extra! 🧈",
  "Korma slow cook ho raha hai...",
]

const waitingAnimations = [
  "cooking", // stirring pot
  "tasting", // tasting with spoon
  "dancing", // happy dance
  "sleeping", // zzz
  "excited", // jumping
]

interface PinguChefProps {
  isWaiting?: boolean
  mood?: "happy" | "cooking" | "waiting" | "celebrating"
  showQuote?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PinguChef({
  isWaiting = false,
  mood = "happy",
  showQuote = true,
  size = "md",
  className = "",
}: PinguChefProps) {
  const [currentQuote, setCurrentQuote] = useState(desiQuotes[0])
  const [isQuoteVisible, setIsQuoteVisible] = useState(false)
  const [animationState, setAnimationState] = useState(waitingAnimations[0])

  useEffect(() => {
    if (showQuote) {
      const quoteInterval = setInterval(() => {
        setIsQuoteVisible(false)
        setTimeout(() => {
          setCurrentQuote(desiQuotes[Math.floor(Math.random() * desiQuotes.length)])
          setIsQuoteVisible(true)
        }, 300)
      }, 4000)

      // Show first quote
      setTimeout(() => setIsQuoteVisible(true), 500)

      return () => clearInterval(quoteInterval)
    }
  }, [showQuote])

  useEffect(() => {
    if (isWaiting) {
      const animInterval = setInterval(() => {
        setAnimationState(waitingAnimations[Math.floor(Math.random() * waitingAnimations.length)])
      }, 3000)
      return () => clearInterval(animInterval)
    }
  }, [isWaiting])

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  }

  const getAnimation = (): TargetAndTransition => {
    if (isWaiting) {
      switch (animationState) {
        case "cooking":
          return {
            rotate: [-5, 5, -5],
            transition: { repeat: Infinity, duration: 0.5 },
          }
        case "tasting":
          return {
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 1 },
          }
        case "dancing":
          return {
            y: [0, -10, 0],
            rotate: [-10, 10, -10],
            transition: { repeat: Infinity, duration: 0.6 },
          }
        case "sleeping":
          return {
            scale: [1, 1.02, 1],
            transition: { repeat: Infinity, duration: 2 },
          }
        case "excited":
          return {
            y: [0, -15, 0],
            transition: { repeat: Infinity, duration: 0.4 },
          }
        default:
          return {}
      }
    }

    switch (mood) {
      case "celebrating":
        return {
          y: [0, -20, 0],
          rotate: [-10, 10, -10],
          transition: { repeat: Infinity, duration: 0.5 },
        }
      case "cooking":
        return {
          rotate: [-3, 3, -3],
          transition: { repeat: Infinity, duration: 0.8 },
        }
      default:
        return {
          y: [0, -5, 0],
          transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        }
    }
  }

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {showQuote && isQuoteVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="relative bg-white rounded-2xl px-4 py-2 shadow-lg border-2 border-primary/20 max-w-[200px]">
              <p className="text-sm font-medium text-foreground text-center whitespace-nowrap">
                {currentQuote}
              </p>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-primary/20 rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pingu Chef Character */}
      <motion.div
        className={`relative ${sizeClasses[size]}`}
        animate={getAnimation()}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
          {/* Body */}
          <ellipse cx="100" cy="130" rx="55" ry="60" fill="#1a1a2e" />
          
          {/* White belly */}
          <ellipse cx="100" cy="135" rx="40" ry="45" fill="#f5f5f5" />
          
          {/* Head */}
          <circle cx="100" cy="65" r="45" fill="#1a1a2e" />
          
          {/* White face */}
          <ellipse cx="100" cy="70" rx="35" ry="30" fill="#f5f5f5" />
          
          {/* Chef Hat */}
          <ellipse cx="100" cy="25" rx="35" ry="20" fill="#fff" stroke="#e0e0e0" strokeWidth="2" />
          <rect x="70" y="25" width="60" height="25" fill="#fff" />
          <ellipse cx="100" cy="15" rx="25" ry="15" fill="#fff" />
          
          {/* Eyes */}
          <ellipse cx="85" cy="65" rx="8" ry="10" fill="#1a1a2e" />
          <ellipse cx="115" cy="65" rx="8" ry="10" fill="#1a1a2e" />
          
          {/* Eye shine */}
          <circle cx="87" cy="62" r="3" fill="#fff" />
          <circle cx="117" cy="62" r="3" fill="#fff" />
          
          {/* Beak */}
          <ellipse cx="100" cy="82" rx="12" ry="8" fill="#ff9500" />
          
          {/* Blush */}
          <ellipse cx="70" cy="75" rx="8" ry="5" fill="#ffb4b4" opacity="0.6" />
          <ellipse cx="130" cy="75" rx="8" ry="5" fill="#ffb4b4" opacity="0.6" />
          
          {/* Wings/Flippers */}
          <ellipse cx="45" cy="120" rx="15" ry="35" fill="#1a1a2e" transform="rotate(-20 45 120)" />
          <ellipse cx="155" cy="120" rx="15" ry="35" fill="#1a1a2e" transform="rotate(20 155 120)" />
          
          {/* Feet */}
          <ellipse cx="75" cy="185" rx="18" ry="10" fill="#ff9500" />
          <ellipse cx="125" cy="185" rx="18" ry="10" fill="#ff9500" />
          
          {/* Chef's spoon */}
          {(mood === "cooking" || animationState === "cooking" || animationState === "tasting") && (
            <g transform="rotate(-30 160 100)">
              <rect x="155" y="80" width="8" height="50" rx="4" fill="#8B4513" />
              <ellipse cx="159" cy="75" rx="15" ry="10" fill="#c0c0c0" />
            </g>
          )}
          
          {/* Apron */}
          <path
            d="M 70 110 Q 100 100 130 110 L 125 160 Q 100 165 75 160 Z"
            fill="#fff"
            stroke="#e0e0e0"
            strokeWidth="2"
          />
          
          {/* Apron pocket */}
          <rect x="85" y="130" width="30" height="20" rx="3" fill="#f0f0f0" stroke="#e0e0e0" />
        </svg>

        {/* Waiting indicators */}
        {isWaiting && animationState === "sleeping" && (
          <motion.div
            className="absolute -top-2 -right-2 text-2xl"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            💤
          </motion.div>
        )}

        {isWaiting && animationState === "excited" && (
          <motion.div
            className="absolute -top-2 right-0"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <span className="text-xl">✨</span>
          </motion.div>
        )}
      </motion.div>

      {/* Status text for waiting */}
      {isWaiting && (
        <motion.p
          className="mt-2 text-sm font-medium text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {animationState === "sleeping" && "Thoda aaram kar raha hoon..."}
          {animationState === "cooking" && "Khana ban raha hai..."}
          {animationState === "tasting" && "Taste check ho raha hai!"}
          {animationState === "dancing" && "Khushi ke maare naach raha hoon!"}
          {animationState === "excited" && "Order aa gaya!"}
        </motion.p>
      )}
    </div>
  )
}

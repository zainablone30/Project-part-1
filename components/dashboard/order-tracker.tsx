"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Check, ChefHat, Bike, MapPin, Package } from "lucide-react"
import { PinguChef } from "@/components/pingu-chef"

const orderStages = [
  { id: 1, label: "Order Received", labelUrdu: "Order mil gaya!", icon: Package },
  { id: 2, label: "Preparing", labelUrdu: "Khana ban raha hai...", icon: ChefHat },
  { id: 3, label: "On the Way", labelUrdu: "Raaste mein hai!", icon: Bike },
  { id: 4, label: "Delivered", labelUrdu: "Aa gaya! Khao aur maza karo!", icon: MapPin },
]

const waitingQuotes = [
  "Sabr ka phal meetha hota hai... aur biryani bhi! 🍚",
  "Thoda wait karo, magic ho raha hai kitchen mein! ✨",
  "Chef bhai mehnat kar rahe hain, relax karo! 👨‍🍳",
  "Acha khana time leta hai, yaar! ⏰",
  "Tumhara order VIP hai, special care ho rahi hai! 👑",
  "Pingu ne quality check kar liya, sab perfect hai! 🐧",
  "Thoda sabar, bahut mazaa! 😋",
  "Biryani ke liye intezaar toh banta hai! 🍛",
]

interface OrderTrackerProps {
  orderId: string
  currentStage?: number
  estimatedTime?: string
  items?: { name: string; quantity: number }[]
}

export function OrderTracker({
  orderId,
  currentStage = 2,
  estimatedTime = "25-30 min",
  items = [],
}: OrderTrackerProps) {
  const [stage, setStage] = useState(currentStage)
  const [currentQuote, setCurrentQuote] = useState(waitingQuotes[0])

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(waitingQuotes[Math.floor(Math.random() * waitingQuotes.length)])
    }, 5000)

    return () => clearInterval(quoteInterval)
  }, [])

  // Simulate order progress for demo
  useEffect(() => {
    if (stage < 4) {
      const timer = setTimeout(() => {
        setStage((prev) => Math.min(prev + 1, 4))
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  const isWaiting = stage < 4

  return (
    <div className="bg-card rounded-3xl overflow-hidden border border-border/50 shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm opacity-80">Order #{orderId}</p>
            <h3 className="text-xl font-bold">
              {stage === 4 ? "Delivered! 🎉" : "Order in Progress..."}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Estimated Time</p>
            <p className="text-lg font-bold">{stage === 4 ? "Done!" : estimatedTime}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Steps */}
        <div className="relative mb-8">
          {/* Progress Line */}
          <div className="absolute top-5 left-5 right-5 h-1 bg-muted rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((stage - 1) / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {orderStages.map((s, index) => {
              const isCompleted = stage > s.id
              const isCurrent = stage === s.id
              const Icon = s.icon

              return (
                <div key={s.id} className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      isCompleted
                        ? "bg-primary text-white"
                        : isCurrent
                        ? "bg-gradient-to-r from-primary to-accent text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <p
                    className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                      isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[10px] text-muted-foreground text-center">{s.labelUrdu}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Pingu Chef Waiting Animation */}
        <AnimatePresence>
          {isWaiting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center py-6"
            >
              <PinguChef
                isWaiting={true}
                mood={stage === 2 ? "cooking" : "happy"}
                showQuote={false}
                size="lg"
              />

              {/* Quote Bubble */}
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 max-w-sm text-center"
              >
                <p className="text-sm font-medium text-foreground">{currentQuote}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delivered Animation */}
        <AnimatePresence>
          {!isWaiting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-6"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <PinguChef mood="celebrating" showQuote={false} size="md" />
              <p className="mt-4 text-lg font-bold text-foreground">Khana aa gaya!</p>
              <p className="text-sm text-muted-foreground">Enjoy your meal! Khao aur maza karo! 😋</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Items */}
        {items.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border/50">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Order Items</h4>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-muted-foreground">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

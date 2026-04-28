"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Heart, Star, Clock, Plus, Flame, Leaf, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface FoodCardProps {
  id: string
  name: string
  nameUrdu?: string
  restaurant: string
  image: string
  price: number
  rating: number
  deliveryTime: string
  isVeg?: boolean
  isSpicy?: boolean
  isHomemade?: boolean
  isFavorite?: boolean
  aiRecommended?: boolean
  discount?: number
  onAddToCart?: () => void
  onFavorite?: () => void
  className?: string
}

export function FoodCard({
  name,
  nameUrdu,
  restaurant,
  image,
  price,
  rating,
  deliveryTime,
  isVeg,
  isSpicy,
  isHomemade,
  isFavorite = false,
  aiRecommended,
  discount,
  onAddToCart,
  onFavorite,
  className,
}: FoodCardProps) {
  const [liked, setLiked] = useState(isFavorite)
  const [isHovered, setIsHovered] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    onFavorite?.()
  }

  return (
    <motion.div
      className={cn(
        "group relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {aiRecommended && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-2 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold flex items-center gap-1"
            >
              <Flame className="w-3 h-3" /> AI Pick
            </motion.span>
          )}
          {discount && (
            <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
              {discount}% OFF
            </span>
          )}
          {isHomemade && (
            <span className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" /> Ghar ka
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button
          onClick={handleLike}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </motion.button>

        {/* Quick Add Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          onClick={onAddToCart}
          className="absolute bottom-3 right-3 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm flex items-center gap-2 shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </motion.button>

        {/* Bottom Left Info */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-foreground text-lg leading-tight">{name}</h3>
            {nameUrdu && (
              <p className="text-sm text-muted-foreground">{nameUrdu}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {isVeg && (
              <span className="w-5 h-5 rounded border-2 border-green-500 flex items-center justify-center">
                <Leaf className="w-3 h-3 text-green-500" />
              </span>
            )}
            {isSpicy && (
              <span className="text-lg" title="Teekha hai!">🌶️</span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{restaurant}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">Rs. {price}</span>
            {discount && (
              <span className="text-sm text-muted-foreground line-through">
                Rs. {Math.round(price * (1 + discount / 100))}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

"use client"

import { motion } from "motion/react"

const categories = [
  { emoji: "🍛", name: "Biryani", nameUrdu: "بریانی" },
  { emoji: "🍖", name: "BBQ", nameUrdu: "باربی کیو" },
  { emoji: "🫓", name: "Paratha", nameUrdu: "پراٹھا" },
  { emoji: "🍜", name: "Karahi", nameUrdu: "کڑاہی" },
  { emoji: "🥘", name: "Nihari", nameUrdu: "نہاری" },
  { emoji: "🍢", name: "Kebab", nameUrdu: "کباب" },
  { emoji: "🥗", name: "Salad", nameUrdu: "سلاد" },
  { emoji: "🍨", name: "Mithai", nameUrdu: "مٹھائی" },
  { emoji: "☕", name: "Chai", nameUrdu: "چائے" },
  { emoji: "🍕", name: "Pizza", nameUrdu: "پیزا" },
  { emoji: "🍔", name: "Burger", nameUrdu: "برگر" },
  { emoji: "🥤", name: "Drinks", nameUrdu: "مشروبات" },
]

interface QuickCategoriesProps {
  onCategorySelect?: (category: string) => void
}

export function QuickCategories({ onCategorySelect }: QuickCategoriesProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Kya khana hai aaj?</h3>
        <button className="text-sm text-primary font-medium hover:underline">
          Sab dekho →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => (
          <motion.button
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onCategorySelect?.(category.name)}
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 p-4 min-w-[90px] rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            <motion.span
              className="text-3xl"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3 }}
            >
              {category.emoji}
            </motion.span>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{category.name}</p>
              <p className="text-[10px] text-muted-foreground">{category.nameUrdu}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

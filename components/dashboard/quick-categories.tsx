"use client"

import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { messages } from "@/lib/i18n"

const categories = [
  { emoji: "🍛", key: "biryani" },
  { emoji: "🍖", key: "bbq" },
  { emoji: "🫓", key: "paratha" },
  { emoji: "🍜", key: "karahi" },
  { emoji: "🥘", key: "nihari" },
  { emoji: "🍢", key: "kebab" },
  { emoji: "🥗", key: "salad" },
  { emoji: "🍨", key: "mithai" },
  { emoji: "☕", key: "chai" },
  { emoji: "🍕", key: "pizza" },
  { emoji: "🍔", key: "burger" },
  { emoji: "🥤", key: "drinks" },
]

export function QuickCategories() {
  const { t } = useLanguage()
  const router = useRouter()

  function handleCategoryClick(key: string) {
    const searchTerm = messages.en[`qc_cat_${key}` as keyof typeof messages.en] || key
    router.push(`/dashboard/explore?search=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">{t("qc_title")}</h3>
        <button
          onClick={() => router.push("/dashboard/explore")}
          className="text-sm text-primary font-medium hover:underline"
        >
          {t("qc_view_all")}
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => {
          const name = t(`qc_cat_${category.key}`)
          const sub = t(`qc_cat_${category.key}_sub`)
          const hasSub = sub.trim().length > 0
          return (
            <motion.button
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCategoryClick(category.key)}
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
                <p className="text-sm font-medium text-foreground">{name}</p>
                {hasSub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { languages, Language } from "@/lib/i18n"
import { useLanguage, useShouldShowLanguagePrompt } from "@/components/language-provider"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const shouldShow = useShouldShowLanguagePrompt()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (shouldShow) {
      setIsOpen(true)
    }
  }, [shouldShow])

  const handleSelect = (code: Language) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl border border-border/50"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Choose your language</h2>
              <p className="text-sm text-muted-foreground">
                Select the language you want for this experience.
              </p>
            </div>
            <div className="grid gap-3">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    language === item.code
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 bg-background hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

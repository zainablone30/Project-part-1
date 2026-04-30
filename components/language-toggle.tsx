"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { languages, type Language } from "@/lib/i18n"
import { useLanguage } from "@/components/language-provider"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (code: Language) => {
    try {
      localStorage.setItem("dk-language", code)
    } catch (e) {}
    setLanguage(code)
    setIsOpen(false)
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  const current = languages.find((item) => item.code === language) ?? languages[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-2 text-sm font-medium text-foreground shadow-lg shadow-black/5 backdrop-blur transition-colors hover:bg-accent/10"
      >
        <span>{current.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-border/60 bg-card p-2 shadow-xl z-50">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                language === item.code
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import * as React from "react"
import { Language, messages } from "@/lib/i18n"

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

const storageKey = "dk-language"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>("natural")

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Language | null
    if (stored) {
      setLanguageState(stored)
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = language === "natural" ? "en" : language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const setLanguage = React.useCallback((next: Language) => {
    setLanguageState(next)
    try {
      localStorage.setItem(storageKey, next)
    } catch (e) {}
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }, [])

  const t = React.useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const template = messages[language][key] ?? messages.natural[key] ?? key
      if (!vars) {
        return template
      }
      return Object.keys(vars).reduce((acc, varKey) => {
        return acc.replace(new RegExp(`\\{${varKey}\\}`, "g"), String(vars[varKey]))
      }, template)
    },
    [language]
  )

  const value = React.useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }

  return context
}

export function useShouldShowLanguagePrompt() {
  const [shouldShow, setShouldShow] = React.useState(false)

  React.useEffect(() => {
    setShouldShow(!localStorage.getItem(storageKey))
  }, [])

  return shouldShow
}

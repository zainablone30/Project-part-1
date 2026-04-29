"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentTheme = resolvedTheme ?? theme
  const isDark = currentTheme === "dark"

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-2 text-sm font-medium text-foreground shadow-lg shadow-black/5 backdrop-blur transition-colors hover:bg-accent/10"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  )
}

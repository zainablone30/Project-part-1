'use client'

import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
}

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const getSystemTheme = (): ResolvedTheme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>('light')

  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    const initial =
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : defaultTheme
    setThemeState(initial)
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    const nextTheme =
      theme === 'system'
        ? enableSystem
          ? getSystemTheme()
          : 'light'
        : theme

    setResolvedTheme(nextTheme)

    const root = document.documentElement
    root.classList.toggle('dark', nextTheme === 'dark')
    root.style.colorScheme = nextTheme

    try {
      localStorage.setItem(storageKey, theme)
    } catch (e) {}
  }, [theme, enableSystem, storageKey])

  React.useEffect(() => {
    if (theme !== 'system' || !enableSystem) {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const nextTheme = media.matches ? 'dark' : 'light'
      setResolvedTheme(nextTheme)

      const root = document.documentElement
      root.classList.toggle('dark', nextTheme === 'dark')
      root.style.colorScheme = nextTheme
    }

    if (media.addEventListener) {
      media.addEventListener('change', handler)
    } else {
      media.addListener(handler)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handler)
      } else {
        media.removeListener(handler)
      }
    }
  }, [theme, enableSystem])

  const setTheme = React.useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
  }, [])

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}

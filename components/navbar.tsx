"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Utensils, Menu, X, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavbarProps {
  onLoginClick: () => void
  onSignupClick: () => void
}

export function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#features", label: t("nav_features") },
    { href: "#how-it-works", label: t("nav_how") },
    { href: "#ai-features", label: t("nav_ai") },
    { href: "#chefs", label: t("nav_chefs") },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-card/95 backdrop-blur-xl shadow-lg border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-primary-foreground" />
                </div>
              </motion.div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl md:text-2xl font-bold transition-colors ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}>
                  DastarKhan
                </span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded transition-colors ${
                  isScrolled 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-white/20 text-white"
                }`}>
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/10 ${
                    isScrolled 
                      ? "text-foreground hover:text-primary" 
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLoginClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  isScrolled
                    ? "text-foreground hover:text-primary hover:bg-primary/10"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <LogIn className="w-4 h-4" />
                {t("nav_login")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(217, 119, 6, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onSignupClick}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
              >
                <UserPlus className="w-4 h-4" />
                {t("nav_get_started")}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-card/95 backdrop-blur-xl border-b border-border shadow-xl">
              <div className="px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-border my-4" />
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onLoginClick()
                    }}
                    className="w-full px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    {t("nav_login")}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onSignupClick()
                    }}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    {t("nav_get_started")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  Home,
  Search,
  Heart,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  ChefHat,
  Sparkles,
  MapPin,
  Utensils,
  Clock,
  Bell,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PinguChef } from "@/components/pingu-chef"
import { supabase } from "@/lib/supabase"

const mainNavItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Search, label: "Explore", href: "/dashboard/explore" },
  { icon: Sparkles, label: "AI Suggest", href: "/dashboard/ai-suggest" },
  { icon: Heart, label: "Favorites", href: "/dashboard/favorites" },
  { icon: ShoppingBag, label: "Orders", href: "/dashboard/orders" },
]

const aiFeatures = [
  { icon: Utensils, label: "MediMenu AI", href: "/dashboard/medimenu", badge: "Health" },
  { icon: MapPin, label: "CuisineGPS", href: "/dashboard/cuisinegps", badge: "Tourist" },
  { icon: ChefHat, label: "Taste of Pakistan", href: "/dashboard/taste-pakistan", badge: "Desi" },
]

const bottomNavItems = [
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    setIsMobileOpen(false)
    await supabase.auth.signOut()
    router.replace("/login")
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">DastarKhan</h1>
            <p className="text-xs text-muted-foreground">AI Food Buddy</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          Menu
        </p>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-white"
                />
              )}
            </Link>
          )
        })}

        {/* AI Features */}
        <div className="pt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
            AI Features
          </p>
          {aiFeatures.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                <span
                  className={cn(
                    "ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium",
                    isActive ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
                  )}
                >
                  {item.badge}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Pingu Chef Mini */}
      <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <PinguChef size="sm" showQuote={false} />
          <div>
            <p className="text-sm font-semibold text-foreground">Pingu Chef</p>
            <p className="text-xs text-muted-foreground">Your food buddy!</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-border/50 space-y-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-foreground">DastarKhan</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-muted">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl bg-muted"
          >
            {isMobileOpen ? (
              <X className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMobileOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-background border-r border-border/50 flex flex-col pt-16"
      >
        <NavContent />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-background border-r border-border/50 flex-col">
        <NavContent />
      </aside>
    </>
  )
}

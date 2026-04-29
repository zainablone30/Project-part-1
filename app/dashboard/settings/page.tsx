"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Bell, Moon, Globe, Shield, Smartphone, ChevronRight } from "lucide-react"

type ToggleProps = {
  enabled: boolean
  onToggle: () => void
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-orange-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    orderUpdates: true,
    promotions: false,
    darkMode: false,
    language: "English",
    biometric: false,
    locationAccess: true,
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const setLanguage = (lang: string) => {
    setSettings((prev) => ({ ...prev, language: lang }))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
            <p className="text-muted-foreground">App preferences aur account settings</p>
          </div>

          {/* Notifications Section */}
          <div className="p-5 rounded-2xl border border-border bg-card mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-foreground">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Sab notifications on/off karo</p>
                </div>
                <Toggle enabled={settings.notifications} onToggle={() => toggle("notifications")} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">Order Updates</p>
                  <p className="text-xs text-muted-foreground">Order status ki updates milein</p>
                </div>
                <Toggle enabled={settings.orderUpdates} onToggle={() => toggle("orderUpdates")} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">Promotions & Deals</p>
                  <p className="text-xs text-muted-foreground">Discounts aur offers ki alerts</p>
                </div>
                <Toggle enabled={settings.promotions} onToggle={() => toggle("promotions")} />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="p-5 rounded-2xl border border-border bg-card mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-foreground">Appearance</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Aankhon ko aaraam do raat ko</p>
              </div>
              <Toggle enabled={settings.darkMode} onToggle={() => toggle("darkMode")} />
            </div>
          </div>

          {/* Language Section */}
          <div className="p-5 rounded-2xl border border-border bg-card mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-foreground">Language / زبان</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["English", "اردو"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    settings.language === lang
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-border text-foreground hover:border-orange-300"
                  }`}
                >
                  {lang === "English" ? "🇬🇧 English" : "🇵🇰 اردو"}
                </button>
              ))}
            </div>
          </div>

          {/* Security Section */}
          <div className="p-5 rounded-2xl border border-border bg-card mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-foreground">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">Biometric Login</p>
                  <p className="text-xs text-muted-foreground">Fingerprint ya face ID se login</p>
                </div>
                <Toggle enabled={settings.biometric} onToggle={() => toggle("biometric")} />
              </div>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <span className="text-sm font-medium text-foreground">Change Password</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Location Section */}
          <div className="p-5 rounded-2xl border border-border bg-card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-foreground">App Permissions</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Location Access</p>
                <p className="text-xs text-muted-foreground">Nearby restaurants dhoondhne ke liye</p>
              </div>
              <Toggle enabled={settings.locationAccess} onToggle={() => toggle("locationAccess")} />
            </div>
          </div>

          {/* App Version */}
          <p className="text-center text-xs text-muted-foreground">
            DastarKhan AI v1.0.0 — Made with ❤️ for Pakistan 🇵🇰
          </p>
        </div>
      </main>
    </div>
  )
}

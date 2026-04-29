"use client"

import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Bell, CheckCircle, Truck, Sparkles, ArrowLeft } from "lucide-react"

const notifications = [
  {
    id: "n1",
    title: "Order is on the way",
    detail: "Your rider picked up the order from Karachi Biryani House.",
    time: "5 min ago",
    icon: Truck,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "n2",
    title: "New AI suggestion",
    detail: "Try a low-oil chicken karahi tailored to your mood.",
    time: "25 min ago",
    icon: Sparkles,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    id: "n3",
    title: "Order delivered",
    detail: "Rate your order from BBQ Tonight.",
    time: "Yesterday",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
]

export default function NotificationsPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="lg:ml-72 min-h-screen p-6 pt-20 lg:pt-6">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">Latest updates from your orders and AI.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/50"
            >
              <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-foreground">{item.title}</h2>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { OrderTracker } from "@/components/dashboard/order-tracker"
import { PinguChef } from "@/components/pingu-chef"
import { Package, Clock, CheckCircle, XCircle, RotateCcw, ChevronRight, ArrowLeft } from "lucide-react"

const orders = [
  {
    id: "DK-2847",
    status: "preparing",
    restaurant: "Karachi Biryani House",
    items: [
      { name: "Chicken Biryani", quantity: 2, price: 450 },
      { name: "Raita", quantity: 1, price: 50 },
    ],
    total: 950,
    date: "Today, 2:30 PM",
    estimatedTime: "25-30 min",
  },
  {
    id: "DK-2801",
    status: "delivered",
    restaurant: "BBQ Tonight",
    items: [
      { name: "Seekh Kebab", quantity: 4, price: 380 },
      { name: "Naan", quantity: 2, price: 40 },
    ],
    total: 1600,
    date: "Yesterday, 8:15 PM",
  },
  {
    id: "DK-2756",
    status: "delivered",
    restaurant: "Pizza Hut",
    items: [{ name: "Large Pepperoni Pizza", quantity: 1, price: 1200 }],
    total: 1200,
    date: "2 days ago",
  },
  {
    id: "DK-2699",
    status: "cancelled",
    restaurant: "Desi Nashta Corner",
    items: [{ name: "Halwa Puri", quantity: 3, price: 250 }],
    total: 750,
    date: "3 days ago",
    cancelReason: "Restaurant closed",
  },
]

const statusConfig = {
  preparing: {
    label: "Preparing",
    labelUrdu: "بن رہا ہے",
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  delivered: {
    label: "Delivered",
    labelUrdu: "پہنچ گیا",
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  cancelled: {
    label: "Cancelled",
    labelUrdu: "منسوخ",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
}

export default function OrdersPage() {
  const router = useRouter()
  const [selectedOrder, setSelectedOrder] = useState<string | null>("DK-2847")
  const activeOrder = orders.find((o) => o.status === "preparing")

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
          <h1 className="text-2xl font-bold text-foreground mb-2">Mere Orders</h1>
          <p className="text-muted-foreground">Apne orders track karo aur history dekho</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Active Order Banner */}
            {activeOrder && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold">Active Order #{activeOrder.id}</p>
                      <p className="text-sm opacity-80">
                        {activeOrder.restaurant} - {activeOrder.estimatedTime}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(activeOrder.id)}
                    className="px-4 py-2 rounded-full bg-white text-foreground font-semibold text-sm hover:bg-white/90 transition-colors"
                  >
                    Track Karo
                  </button>
                </div>
              </motion.div>
            )}

            {/* Orders List */}
            <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h2 className="font-bold text-foreground">Order History</h2>
              </div>

              <div className="divide-y divide-border/50">
                {orders.map((order, index) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon

                  return (
                    <motion.button
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedOrder(order.id)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        selectedOrder === order.id ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl ${status.bgColor} flex items-center justify-center`}>
                            <StatusIcon className={`w-5 h-5 ${status.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-foreground">#{order.id}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${status.bgColor} ${status.color} font-medium`}>
                                {status.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{order.restaurant}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-foreground">Rs. {order.total}</p>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Details / Tracker */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {selectedOrder && (
                <motion.div
                  key={selectedOrder}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {orders.find((o) => o.id === selectedOrder)?.status === "preparing" ? (
                    <OrderTracker
                      orderId={selectedOrder}
                      currentStage={2}
                      estimatedTime="25-30 min"
                      items={orders.find((o) => o.id === selectedOrder)?.items.map((i) => ({
                        name: i.name,
                        quantity: i.quantity,
                      })) || []}
                    />
                  ) : (
                    <div className="bg-card rounded-3xl border border-border/50 p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <PinguChef size="sm" showQuote={false} mood="happy" />
                        <div>
                          <h3 className="font-bold text-foreground">
                            Order #{selectedOrder}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {orders.find((o) => o.id === selectedOrder)?.status === "delivered"
                              ? "Umeed hai khana pasand aaya! 😊"
                              : "Is order mein masla ho gaya tha 😔"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {orders
                          .find((o) => o.id === selectedOrder)
                          ?.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-foreground">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="text-muted-foreground">
                                Rs. {item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        <div className="pt-3 border-t border-border/50 flex items-center justify-between font-bold">
                          <span className="text-foreground">Total</span>
                          <span className="text-foreground">
                            Rs. {orders.find((o) => o.id === selectedOrder)?.total}
                          </span>
                        </div>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                        <RotateCcw className="w-5 h-5" />
                        Dobara Order Karo
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* No Order Selected */}
            {!selectedOrder && (
              <div className="bg-card rounded-3xl border border-border/50 p-8 text-center">
                <PinguChef size="md" showQuote={false} mood="happy" />
                <p className="mt-4 text-muted-foreground">
                  Koi order select karo details dekhne ke liye!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

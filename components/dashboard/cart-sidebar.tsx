"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, ChevronRight, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"

// ── Floating cart button ──────────────────────────────────────────────────────
export function CartButton() {
  const { items, openCart, isOpen } = useCart()
  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  if (count === 0 || isOpen) return null

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onClick={openCart}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 rounded-full bg-orange-500 px-5 py-3.5 text-white shadow-2xl hover:bg-orange-600 transition-colors font-bold text-sm"
    >
      <ShoppingCart className="w-5 h-5" />
      <span>{count} item{count > 1 ? "s" : ""}</span>
      <span className="rounded-full bg-white text-orange-600 text-xs font-bold px-2.5 py-1">
        Rs. {total}
      </span>
    </motion.button>
  )
}

// ── Cart sidebar ──────────────────────────────────────────────────────────────
export function CartSidebar() {
  const {
    items, isOpen, closeCart,
    removeItem, updateQty,
    subtotal, deliveryFee, total,
    placeOrder, isPlacingOrder,
    restaurantName,
  } = useCart()

  const router = useRouter()
  const [gettingLocation, setGettingLocation] = useState(false)
  const [placed, setPlaced] = useState(false)

  async function handlePlaceOrder() {
    setGettingLocation(true)
    let lat: number | undefined
    let lng: number | undefined

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 }),
      )
      lat = pos.coords.latitude
      lng = pos.coords.longitude
    } catch {
      // Fall back to Lahore centre
      lat = 31.5204
      lng = 74.3587
    }

    setGettingLocation(false)
    const orderId = await placeOrder(lat, lng)

    if (orderId) {
      setPlaced(true)
      setTimeout(() => {
        setPlaced(false)
        closeCart()
        router.push(`/dashboard/orders?new=${orderId}`)
      }, 2000)
    }
  }

  const busy = isPlacingOrder || gettingLocation

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Slide-over panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
              <div>
                <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-500" />
                  Your Cart
                </h2>
                {restaurantName && (
                  <p className="text-xs text-muted-foreground mt-0.5">{restaurantName}</p>
                )}
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-2 hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success overlay */}
            <AnimatePresence>
              {placed && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mx-4 mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center flex-shrink-0"
                >
                  <div className="text-4xl mb-2">✅</div>
                  <p className="font-bold text-emerald-800 text-base">Order place ho gaya!</p>
                  <p className="text-sm text-emerald-600 mt-1">
                    Tracking page par ja rahe hain…
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="font-semibold text-muted-foreground">Cart khali hai</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    MediMenu se koi dish add karo!
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div
                      key={item.foodId}
                      layout
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 rounded-2xl bg-muted/50 border border-border/40 p-3"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm leading-tight truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Rs. {item.price} each
                        </p>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.foodId, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-5 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.foodId, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price + remove */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="font-bold text-foreground text-sm tabular-nums">
                          Rs. {item.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeItem(item.foodId)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Checkout footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4 flex-shrink-0">
                {/* Price breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">Rs. {subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Delivery Fee
                    </span>
                    <span className="font-medium tabular-nums">Rs. {deliveryFee}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="tabular-nums text-orange-600">Rs. {total}</span>
                  </div>
                </div>

                {/* Place order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={busy || placed}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3.5 text-white font-bold hover:bg-orange-600 transition-all disabled:opacity-60 shadow-lg active:scale-95"
                >
                  {busy ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    <>
                      Order Place Karo
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-muted-foreground">
                  Estimated delivery: 25–35 min 🛵
                </p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

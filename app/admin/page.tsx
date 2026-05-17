"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { supabase } from "@/lib/supabase"
import {
  RefreshCw, Search, LogOut, Sun, Moon,
  ChevronDown, Package, Truck, CheckCircle,
  Clock, XCircle, AlertCircle, Wifi, WifiOff, Star,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type OrderItem = {
  food_id: string
  name: string
  price: number
  quantity: number
  image?: string
  restaurant_name?: string
}

type OrderStatus = "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled"

type Order = {
  id: string
  order_number?: string
  user_id?: string
  restaurant_area?: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  customer_lat?: number
  customer_lng?: number
  estimated_minutes?: number
  created_at: string
  notes?: string
}

// ── Config ────────────────────────────────────────────────────────────────────

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "dastarkhan2024"

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "preparing", "on_the_way", "delivered"]

type StatusMeta = { label: string; urdu: string; emoji: string; color: string; bg: string; border: string }
const STATUS_META: Record<OrderStatus, StatusMeta> = {
  pending:    { label: "Pending",    urdu: "انتظار",     emoji: "⏳", color: "#eab308", bg: "bg-yellow-500/15",  border: "border-yellow-500/30"  },
  confirmed:  { label: "Confirmed",  urdu: "تصدیق شدہ",  emoji: "✅", color: "#3b82f6", bg: "bg-blue-500/15",    border: "border-blue-500/30"    },
  preparing:  { label: "Preparing",  urdu: "بن رہا ہے",   emoji: "👨‍🍳", color: "#f59e0b", bg: "bg-amber-500/15",   border: "border-amber-500/30"   },
  on_the_way: { label: "On the Way", urdu: "راستے میں",   emoji: "🛵", color: "#f97316", bg: "bg-orange-500/15",  border: "border-orange-500/30"  },
  delivered:  { label: "Delivered",  urdu: "پہنچ گیا",    emoji: "🎉", color: "#22c55e", bg: "bg-green-500/15",   border: "border-green-500/30"   },
  cancelled:  { label: "Cancelled",  urdu: "منسوخ",       emoji: "✖", color: "#ef4444", bg: "bg-red-500/15",     border: "border-red-500/30"     },
}

// ── Theme ─────────────────────────────────────────────────────────────────────

type Theme = ReturnType<typeof buildTheme>
function buildTheme(dark: boolean) {
  return dark ? {
    page:      "bg-[#09090f] text-white",
    header:    "bg-[#09090f]/90 border-white/5",
    card:      "bg-[#111118] border-white/6",
    cardHover: "hover:border-white/12",
    stat:      "bg-[#111118] border-white/6",
    input:     "bg-[#111118] border-white/8 text-white placeholder-zinc-600 focus:border-orange-500",
    select:    "bg-[#111118] border-white/8 text-white",
    muted:     "text-zinc-400",
    subtle:    "text-zinc-600",
    divider:   "border-white/5",
    btn:       "bg-white/5 border-white/8 text-zinc-400 hover:bg-white/10 hover:text-white",
    ringOffset: "ring-offset-[#111118]",
    skeleton:  "bg-white/5",
    searchIcon: "text-zinc-600",
    badge:     "bg-white/6 text-zinc-300 border-white/8",
    tabActive: "bg-white text-black shadow-sm",
    tabInactive:"text-zinc-500 hover:text-zinc-300",
    toast:     "bg-zinc-800 border-zinc-700 text-white",
  } : {
    page:      "bg-slate-50 text-slate-900",
    header:    "bg-white/90 border-slate-200",
    card:      "bg-white border-slate-200",
    cardHover: "hover:border-slate-300 hover:shadow-md",
    stat:      "bg-white border-slate-200",
    input:     "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500",
    select:    "bg-white border-slate-200 text-slate-900",
    muted:     "text-slate-500",
    subtle:    "text-slate-400",
    divider:   "border-slate-100",
    btn:       "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-800",
    ringOffset: "ring-offset-white",
    skeleton:  "bg-slate-100",
    searchIcon: "text-slate-400",
    badge:     "bg-slate-100 text-slate-600 border-slate-200",
    tabActive: "bg-white text-slate-900 shadow-sm",
    tabInactive:"text-slate-400 hover:text-slate-700",
    toast:     "bg-white border-slate-200 text-slate-900 shadow-lg",
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getRestaurantName(order: Order) {
  return order.items?.[0]?.restaurant_name ?? "DastarKhan"
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-PK", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    })
  } catch { return iso }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── Toast ─────────────────────────────────────────────────────────────────────

type Toast = { id: number; msg: string; type: "success" | "error" }
let toastSeq = 0

function ToastList({ toasts, T }: { toasts: Toast[]; T: Theme }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium ${T.toast}`}
          >
            <span>{t.type === "success" ? "✅" : "❌"}</span>
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Login gate ────────────────────────────────────────────────────────────────

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [key, setKey] = useState("")
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (key === ADMIN_KEY) {
      sessionStorage.setItem("dk-admin", "1")
      onLogin()
    } else {
      setError(true); setShake(true); setKey("")
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-5xl mb-4">
              🐧
            </div>
            <h1 className="text-2xl font-bold text-white">DastarKhan Admin</h1>
            <p className="text-zinc-500 text-sm mt-1">Secure order management portal</p>
          </div>

          {/* Form */}
          <motion.div
            animate={shake ? { x: [-10, 10, -7, 7, -4, 4, 0] } : {}}
            transition={{ duration: 0.45 }}
            className="bg-[#111118] rounded-3xl p-6 border border-white/6"
          >
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-xs font-medium mb-2">Admin Key</label>
                <input
                  type="password"
                  value={key}
                  onChange={e => { setKey(e.target.value); setError(false) }}
                  placeholder="Enter your admin key…"
                  autoFocus
                  className={`w-full px-4 py-3 rounded-2xl bg-white/5 text-white border-2 outline-none transition-colors placeholder-zinc-700 ${
                    error ? "border-red-500" : "border-white/8 focus:border-orange-500"
                  }`}
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs mt-2 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" /> Incorrect key — try again
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600 active:scale-[0.98] transition-all"
              >
                Enter Admin Panel
              </button>
            </form>
          </motion.div>

          <p className="text-zinc-700 text-xs text-center mt-5">
            Set <code className="text-zinc-600">NEXT_PUBLIC_ADMIN_KEY</code> in{" "}
            <code className="text-zinc-600">.env.local</code> to change password
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// ── Status stepper ────────────────────────────────────────────────────────────

function StatusStepper({
  orderId, currentStatus, onStatusChange, isUpdating, T,
}: {
  orderId: string
  currentStatus: OrderStatus
  onStatusChange: (id: string, status: OrderStatus) => void
  isUpdating: boolean
  T: Theme
}) {
  const isCancelled = currentStatus === "cancelled"
  const currentIdx  = STATUS_FLOW.indexOf(currentStatus)

  if (isCancelled) {
    return (
      <div className={`flex items-center gap-2 text-sm font-medium text-red-400 ${T.bg} py-2`}>
        <XCircle className="w-4 h-4" /> Order Cancelled
      </div>
    )
  }

  return (
    <div className="flex items-center overflow-x-auto gap-0 py-1 no-scrollbar">
      {STATUS_FLOW.map((status, idx) => {
        const meta     = STATUS_META[status]
        const isPast   = idx < currentIdx
        const isCurrent = idx === currentIdx
        const isLast   = idx === STATUS_FLOW.length - 1

        return (
          <div key={status} className="flex items-center shrink-0">
            <button
              title={`Set to ${meta.label}`}
              disabled={isUpdating || isCurrent}
              onClick={() => onStatusChange(orderId, status)}
              className={`flex flex-col items-center gap-1.5 px-2 py-1 rounded-xl transition-all group
                ${isCurrent ? "cursor-default" : "cursor-pointer hover:opacity-90"}
                ${isUpdating ? "cursor-not-allowed" : ""}
              `}
              style={{ opacity: isCurrent ? 1 : isPast ? 0.7 : 0.35 }}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all relative
                  ${isCurrent ? "ring-2 ring-offset-2 " + T.ringOffset : ""}
                  ${isPast ? "bg-green-500/20" : ""}
                `}
                style={isCurrent ? {
                  boxShadow: `0 0 0 2px ${meta.color}, 0 0 16px ${meta.color}40`,
                } : undefined}
              >
                {isPast ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <span>{meta.emoji}</span>
                )}
                {isCurrent && isUpdating && (
                  <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping" />
                )}
              </div>
              <span className="text-[10px] font-semibold whitespace-nowrap leading-none">
                {meta.label}
              </span>
            </button>

            {!isLast && (
              <div
                className="h-px w-5 mx-0.5 mb-5 transition-colors shrink-0"
                style={{ backgroundColor: isPast ? "#22c55e" : "#ffffff14" }}
              />
            )}
          </div>
        )
      })}

      {/* Cancelled button always available */}
      <div className="flex items-center shrink-0 ml-2 mb-5">
        <div className="w-px h-5 bg-white/8 mx-1" />
        <button
          disabled={isUpdating}
          onClick={() => onStatusChange(orderId, "cancelled")}
          title="Cancel order"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 transition-all opacity-60 hover:opacity-100 disabled:cursor-not-allowed"
        >
          <XCircle className="w-3 h-3" /> Cancel
        </button>
      </div>
    </div>
  )
}

// ── Order card ────────────────────────────────────────────────────────────────

function OrderCard({
  order, onStatusChange, isUpdating, T,
}: {
  order: Order
  onStatusChange: (id: string, status: OrderStatus) => void
  isUpdating: boolean
  T: Theme
}) {
  const [expanded, setExpanded] = useState(false)
  const meta         = STATUS_META[order.status]
  const restaurantName = getRestaurantName(order)
  const subtotal     = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee  = Math.max(order.total - subtotal, 0)

  return (
    <motion.div
      layout
      className={`rounded-2xl border overflow-hidden transition-all duration-200 ${T.card} ${T.cardHover} ${
        isUpdating ? "ring-1 ring-orange-500/40" : ""
      }`}
    >
      {/* Top row */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-4">
          {/* Status icon */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${meta.bg} border ${meta.border}`}
          >
            {meta.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className={`font-bold text-sm font-mono ${T.badge} px-2 py-0.5 rounded-lg border text-xs`}>
                {order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${meta.bg} ${meta.border}`}
                style={{ color: meta.color }}
              >
                {meta.emoji} {meta.label}
              </span>
              {isUpdating && (
                <span className="text-orange-400 text-xs animate-pulse font-medium">Saving…</span>
              )}
            </div>
            <p className="font-semibold text-base leading-tight">{restaurantName}</p>
            <div className="flex flex-wrap gap-3 mt-1">
              {order.restaurant_area && (
                <span className={`text-xs ${T.muted}`}>📍 {order.restaurant_area}</span>
              )}
              <span className={`text-xs ${T.subtle}`}>{timeAgo(order.created_at)}</span>
              <span className={`text-xs ${T.subtle}`}>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Total + expand */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-orange-500 font-bold text-base tabular-nums">
              Rs.&nbsp;{order.total}
            </span>
            <button
              onClick={() => setExpanded(v => !v)}
              className={`p-1.5 rounded-xl transition-colors ${T.btn} border`}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Status stepper */}
        <div className={`mt-4 pt-4 border-t ${T.divider}`}>
          <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${T.subtle}`}>
            Update Status
          </p>
          <StatusStepper
            orderId={order.id}
            currentStatus={order.status}
            onStatusChange={onStatusChange}
            isUpdating={isUpdating}
            T={T}
          />
        </div>
      </div>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-5 pt-3 border-t ${T.divider} grid sm:grid-cols-2 gap-4`}>
              {/* Items */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${T.subtle}`}>
                  Order Items
                </p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="text-sm truncate">
                        {item.name}
                        <span className={`ml-1.5 text-xs ${T.muted}`}>×{item.quantity}</span>
                      </span>
                      <span className={`text-sm tabular-nums shrink-0 ${T.muted}`}>
                        Rs.&nbsp;{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Price */}
                <div className={`mt-3 pt-3 border-t ${T.divider} space-y-1`}>
                  <div className={`flex justify-between text-xs ${T.muted}`}>
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <div className={`flex justify-between text-xs ${T.muted}`}>
                    <span>Delivery</span>
                    <span>Rs. {deliveryFee || 50}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-1">
                    <span>Total</span>
                    <span className="text-orange-500">Rs. {order.total}</span>
                  </div>
                </div>
              </div>

              {/* Meta info */}
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${T.subtle}`}>
                  Order Info
                </p>
                <div className="space-y-2">
                  <div className={`flex gap-2 text-xs ${T.muted}`}>
                    <span className="font-medium shrink-0">Placed:</span>
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  {order.user_id && (
                    <div className={`flex gap-2 text-xs ${T.muted}`}>
                      <span className="font-medium shrink-0">User:</span>
                      <span className="font-mono truncate">{order.user_id}</span>
                    </div>
                  )}
                  {order.customer_lat && (
                    <div className={`flex gap-2 text-xs ${T.muted}`}>
                      <span className="font-medium shrink-0">Location:</span>
                      <span className="font-mono">
                        {order.customer_lat.toFixed(4)}, {order.customer_lng?.toFixed(4)}
                      </span>
                    </div>
                  )}
                  {order.estimated_minutes && (
                    <div className={`flex gap-2 text-xs ${T.muted}`}>
                      <span className="font-medium shrink-0">ETA:</span>
                      <span>{order.estimated_minutes}–{order.estimated_minutes + 10} min</span>
                    </div>
                  )}
                  {order.notes && (
                    <div className={`flex gap-2 text-xs ${T.muted}`}>
                      <span className="font-medium shrink-0">Notes:</span>
                      <span>{order.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main admin page ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed]         = useState(false)
  const [isDark, setIsDark]         = useState(true)
  const [orders, setOrders]         = useState<Order[]>([])
  const [loading, setLoading]       = useState(true)
  const [updating, setUpdating]     = useState<string | null>(null)
  const [search, setSearch]         = useState("")
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all")
  const [connected, setConnected]   = useState(true)
  const [toasts, setToasts]         = useState<Toast[]>([])
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const fetchRef = useRef<() => Promise<void>>()

  const T = buildTheme(isDark)

  function addToast(msg: string, type: Toast["type"]) {
    const id = ++toastSeq
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }

  // Persist theme
  useEffect(() => {
    const saved = localStorage.getItem("dk-admin-theme")
    if (saved) setIsDark(saved === "dark")
  }, [])
  useEffect(() => {
    localStorage.setItem("dk-admin-theme", isDark ? "dark" : "light")
  }, [isDark])

  // Check session
  useEffect(() => {
    if (sessionStorage.getItem("dk-admin") === "1") setAuthed(true)
  }, [])

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) {
      setOrders(data as Order[])
      setLastRefresh(new Date())
    }
    setLoading(false)
  }, [])

  fetchRef.current = fetchOrders

  useEffect(() => {
    if (!authed) return
    fetchOrders()

    const ch = supabase
      .channel("admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, payload => {
        if (payload.eventType === "INSERT") {
          setOrders(prev => [payload.new as Order, ...prev])
          addToast("New order received!", "success")
        } else if (payload.eventType === "UPDATE") {
          setOrders(prev =>
            prev.map(o => o.id === payload.new.id ? { ...o, ...(payload.new as Order) } : o),
          )
        } else if (payload.eventType === "DELETE") {
          setOrders(prev => prev.filter(o => o.id !== (payload.old as Order).id))
        }
      })
      .on("system", {}, evt => {
        setConnected(evt.extension === "postgres_changes" ? true : evt.status === "ok")
      })
      .subscribe(status => {
        setConnected(status === "SUBSCRIBED")
      })

    return () => { supabase.removeChannel(ch) }
  }, [authed, fetchOrders])

  async function handleStatusChange(id: string, status: OrderStatus) {
    const prev = orders.find(o => o.id === id)
    if (!prev || prev.status === status) return

    // 1. Optimistic update — instant UI response
    setOrders(all => all.map(o => o.id === id ? { ...o, status } : o))
    setUpdating(id)

    // 2. Write to Supabase
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)

    if (error) {
      // 3. Revert on failure
      setOrders(all => all.map(o => o.id === id ? { ...o, status: prev.status } : o))
      addToast(`Update failed: ${error.message}`, "error")
    } else {
      addToast(`Order set to "${STATUS_META[status].label}"`, "success")
    }

    setUpdating(null)
  }

  function handleLogout() {
    sessionStorage.removeItem("dk-admin")
    setAuthed(false)
  }

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />

  // ── Filter ────────────────────────────────────────────────────────────────

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !q
      || getRestaurantName(o).toLowerCase().includes(q)
      || (o.order_number ?? o.id).toLowerCase().includes(q)
      || (o.restaurant_area ?? "").toLowerCase().includes(q)
    const matchStatus = filterStatus === "all" || o.status === filterStatus
    return matchSearch && matchStatus
  })

  // ── Stats ─────────────────────────────────────────────────────────────────

  const stats = [
    { label: "Total",     count: orders.length,                                                                    emoji: "📦", color: "" },
    { label: "Pending",   count: orders.filter(o => o.status === "pending").length,                                emoji: "⏳", color: "text-yellow-500" },
    { label: "Active",    count: orders.filter(o => ["confirmed","preparing","on_the_way"].includes(o.status)).length, emoji: "🛵", color: "text-orange-500" },
    { label: "Delivered", count: orders.filter(o => o.status === "delivered").length,                              emoji: "🎉", color: "text-green-500" },
    { label: "Cancelled", count: orders.filter(o => o.status === "cancelled").length,                              emoji: "✖", color: "text-red-500" },
  ]

  const filterTabs: { value: OrderStatus | "all"; label: string; emoji: string }[] = [
    { value: "all",        label: "All",       emoji: "📋" },
    { value: "pending",    label: "Pending",   emoji: "⏳" },
    { value: "confirmed",  label: "Confirmed", emoji: "✅" },
    { value: "preparing",  label: "Preparing", emoji: "👨‍🍳" },
    { value: "on_the_way", label: "On Way",    emoji: "🛵" },
    { value: "delivered",  label: "Done",      emoji: "🎉" },
    { value: "cancelled",  label: "Cancelled", emoji: "✖" },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${T.page}`}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-20 border-b backdrop-blur-md transition-colors ${T.header}`}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-xl shrink-0">
              🐧
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-base leading-none">DastarKhan Admin</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                <span className={`text-[10px] font-medium ${T.subtle}`}>
                  {connected ? "Live" : "Reconnecting…"} · refreshed {timeAgo(lastRefresh.toISOString())}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={loading}
              title="Refresh"
              className={`p-2 rounded-xl border transition-all ${T.btn} disabled:opacity-40`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={() => setIsDark(d => !d)}
              title="Toggle theme"
              className={`p-2 rounded-xl border transition-all ${T.btn}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${T.btn}`}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6 space-y-6">

        {/* ── Stats grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {stats.map(s => (
            <div
              key={s.label}
              onClick={() => setFilterStatus(
                s.label === "Total" ? "all" :
                s.label === "Active" ? "on_the_way" :
                (s.label.toLowerCase().replace(/ /g, "_")) as OrderStatus
              )}
              className={`rounded-2xl border p-4 cursor-pointer transition-all ${T.stat} ${T.cardHover}`}
            >
              <div className="text-2xl mb-2">{s.emoji}</div>
              <div className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.count}</div>
              <div className={`text-xs font-medium mt-0.5 ${T.muted}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Search + filter tabs ────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${T.searchIcon}`} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by restaurant, order number, or area…"
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border-2 outline-none text-sm transition-colors ${T.input}`}
            />
          </div>

          {/* Status filter tabs */}
          <div className={`flex gap-1 p-1 rounded-2xl border overflow-x-auto no-scrollbar ${T.stat}`}>
            {filterTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  filterStatus === tab.value
                    ? T.tabActive
                    : T.tabInactive
                }`}
              >
                <span>{tab.emoji}</span>
                {tab.label}
                {tab.value !== "all" && (
                  <span className={`tabular-nums ${T.subtle}`}>
                    {orders.filter(o => tab.value === "all" || o.status === tab.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Orders ─────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-36 rounded-2xl animate-pulse ${T.skeleton}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl ${T.skeleton}`}>
              📭
            </div>
            <p className={`font-semibold ${T.muted}`}>No orders found</p>
            {(search || filterStatus !== "all") && (
              <button
                onClick={() => { setSearch(""); setFilterStatus("all") }}
                className="text-orange-500 text-sm hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <p className={`text-xs font-medium pb-2 ${T.subtle}`}>
              {filtered.length} of {orders.length} orders
            </p>
            <div className="space-y-3">
              {filtered.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  isUpdating={updating === order.id}
                  T={T}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Toasts */}
      <ToastList toasts={toasts} T={T} />
    </div>
  )
}

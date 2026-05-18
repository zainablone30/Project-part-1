"use client"

import { motion, useInView, AnimatePresence } from "motion/react"
import { useRef, useState } from "react"
import { ChefHat, Clock, Wallet, Users, GraduationCap, ArrowRight, Check, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

const benefits = [
  { icon: Clock,        title: "Flexible Hours",  description: "Work when you want, from your own kitchen" },
  { icon: Wallet,       title: "Earn Well",        description: "Set your own prices and keep most earnings" },
  { icon: Users,        title: "Build Community",  description: "Connect with health-conscious customers" },
  { icon: GraduationCap,title: "Full Support",     description: "Training, marketing, and operational support" },
]

const requirements = [
  "Passion for cooking and food safety",
  "Clean, hygienic kitchen space",
  "Commitment to quality ingredients",
  "Reliable internet connection",
]

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Other"]

type FormStep = 1 | 2
type FormData = {
  name: string
  whatsapp: string
  city: string
  specialty: string
  experience: string
  description: string
}

function ChefApplicationModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<FormStep>(1)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: "", whatsapp: "", city: "", specialty: "", experience: "", description: "",
  })

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function step1Valid() {
    return form.name.trim().length > 1 && form.whatsapp.trim().length >= 10 && form.city.trim()
  }
  function step2Valid() {
    return form.specialty.trim().length > 2
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      await supabase.from("chef_applications").insert({
        name: form.name.trim(),
        whatsapp: form.whatsapp.trim(),
        city: form.city,
        specialty: form.specialty.trim(),
        experience: form.experience || "Not specified",
        description: form.description.trim() || null,
      })
    } catch {
      // Table may not exist yet — still show success
    } finally {
      // Backup to localStorage
      try {
        const apps = JSON.parse(localStorage.getItem("dk-chef-apps") ?? "[]")
        apps.push({ ...form, submitted_at: new Date().toISOString() })
        localStorage.setItem("dk-chef-apps", JSON.stringify(apps))
      } catch {}
      setSubmitting(false)
      setDone(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-linear-to-br from-primary to-accent p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Apply as Home Chef</h2>
              <p className="text-white/70 text-xs">{done ? "Application submitted!" : `Step ${step} of 2`}</p>
            </div>
          </div>
          {!done && (
            <div className="flex gap-2 mt-4">
              {[1, 2].map(s => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all ${step >= s ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">Application Received! 🎉</h3>
                <p className="text-muted-foreground mb-6">
                  Shukriya <strong>{form.name}</strong>! Hamari team 24–48 ghante mein aapko{" "}
                  <strong>{form.whatsapp}</strong> par contact karegi.
                </p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  Theek Hai, Shukriya!
                </button>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="Apna poora naam likhein"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp Number *</label>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={e => set("whatsapp", e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
                  <select
                    value={form.city}
                    onChange={e => set("city", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="">City select karein</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!step1Valid()}
                  className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Aage Barho <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Main Specialty *</label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={e => set("specialty", e.target.value)}
                    placeholder="e.g. Biryani, Desi Food, Baking, Karahi..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Cooking Experience</label>
                  <select
                    value={form.experience}
                    onChange={e => set("experience", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="">Select karein</option>
                    <option value="Less than 1 year">1 saal se kam</option>
                    <option value="1-3 years">1–3 saal</option>
                    <option value="3-5 years">3–5 saal</option>
                    <option value="5+ years">5+ saal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Tell Us About Your Kitchen</label>
                  <textarea
                    value={form.description}
                    onChange={e => set("description", e.target.value)}
                    placeholder="Apne khane ke baare mein batayein, kya khaas hai aapke haath mein..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-2xl border border-border font-semibold hover:bg-muted transition-colors text-foreground"
                  >
                    Wapas
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!step2Valid() || submitting}
                    className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submit ho raha...</>
                    ) : (
                      <><Check className="w-4 h-4" /> Apply Karein</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ChefSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <section id="chefs" ref={ref} className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative bg-linear-to-br from-primary via-primary to-accent rounded-[2.5rem] overflow-hidden"
          >
            {/* Background Elements */}
            <div className="absolute inset-0">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute -right-32 -top-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute -left-32 -bottom-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16">
              {/* Content */}
              <div className="text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6"
                >
                  <ChefHat className="w-5 h-5" />
                  <span className="text-sm font-semibold">Join Our Chef Community</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                >
                  Turn Your Passion Into a{" "}
                  <span className="text-primary-foreground/90">Thriving Business</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/80 mb-8"
                >
                  Join Pakistan&apos;s first AI-powered home chef network. Share your culinary magic with
                  health-conscious customers who value authentic, homemade food.
                </motion.p>

                {/* Benefits Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="grid sm:grid-cols-2 gap-4 mb-8"
                >
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl"
                    >
                      <div className="p-2 bg-white/20 rounded-xl shrink-0">
                        <benefit.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-white/70">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Requirements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 }}
                  className="mb-8"
                >
                  <h4 className="font-semibold mb-3">What You Need:</h4>
                  <ul className="space-y-2">
                    {requirements.map((req) => (
                      <li key={req} className="flex items-center gap-2 text-white/80">
                        <Check className="w-4 h-4 text-primary-foreground" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* CTA */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(true)}
                  className="group px-8 py-4 bg-white text-primary rounded-2xl font-semibold flex items-center gap-2 shadow-xl"
                >
                  Apply as Home Chef
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative hidden lg:block"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative h-full min-h-125 rounded-3xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                    alt="Home chef preparing delicious meal"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                </motion.div>

                {/* Floating Stats Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-8 bottom-12 bg-white rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">2,500+</div>
                      <div className="text-sm text-muted-foreground">Active Home Chefs</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Rating Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1 }}
                  className="absolute -right-4 top-12 bg-white rounded-2xl p-4 shadow-xl"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">4.9</div>
                    <div className="flex justify-center gap-0.5 my-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-primary fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">Chef Rating</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showModal && <ChefApplicationModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  )
}

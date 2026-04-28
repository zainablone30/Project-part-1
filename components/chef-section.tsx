"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { ChefHat, Clock, Wallet, Users, GraduationCap, ArrowRight, Check } from "lucide-react"
import Image from "next/image"

const benefits = [
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Work when you want, from your own kitchen",
  },
  {
    icon: Wallet,
    title: "Earn Well",
    description: "Set your own prices and keep most earnings",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Connect with health-conscious customers",
  },
  {
    icon: GraduationCap,
    title: "Full Support",
    description: "Training, marketing, and operational support",
  },
]

const requirements = [
  "Passion for cooking and food safety",
  "Clean, hygienic kitchen space",
  "Commitment to quality ingredients",
  "Reliable internet connection",
]

export function ChefSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="chefs" ref={ref} className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-primary via-primary to-accent rounded-[2.5rem] overflow-hidden"
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
                    <div className="p-2 bg-white/20 rounded-xl flex-shrink-0">
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
                className="relative h-full min-h-[500px] rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                  alt="Home chef preparing delicious meal"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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
  )
}

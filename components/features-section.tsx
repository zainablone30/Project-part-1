"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { Sparkles, Heart, Utensils, Brain, Globe, Users, Stethoscope, MapPin } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Brain,
    title: "AI Mood Detection",
    description: "Our AI analyzes your mood and suggests meals that boost your emotional wellbeing through nutritional psychiatry",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Stethoscope,
    title: "MediMenu AI",
    description: "Health-intelligent recommendations for diabetics, heart patients, and those with dietary restrictions",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    gradient: "from-primary to-accent",
  },
  {
    icon: Utensils,
    title: "Homemade Quality",
    description: "Every meal prepared fresh by verified home chefs in your community with love and care",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    gradient: "from-amber-500 to-orange-600",
  },
]

const miniFeatures = [
  {
    icon: Globe,
    title: "CuisineGPS",
    description: "Find authentic international cuisines anywhere in Pakistan",
  },
  {
    icon: MapPin,
    title: "Taste of Pakistan",
    description: "Discover regional Pakistani specialties with cultural stories",
  },
  {
    icon: Users,
    title: "Smart Household",
    description: "Multi-profile family ordering for everyone's needs",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" ref={ref} className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4"
          >
            Revolutionary Features
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose{" "}
            <span className="text-primary">DastarKhan</span>{" "}
            <span className="text-accent">AI</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Revolutionary AI technology meets authentic home cooking for a personalized culinary experience
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-6 relative">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid sm:grid-cols-3 gap-4 md:gap-6"
        >
          {miniFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 p-5 bg-secondary/50 rounded-2xl border border-border hover:border-primary/30 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                <feature.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

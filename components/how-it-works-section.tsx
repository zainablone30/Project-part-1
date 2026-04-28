"use client"

import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { MessageSquare, ChefHat, Truck, Check } from "lucide-react"
import Image from "next/image"

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Tell Us How You Feel",
    description: "Share your mood, health goals, medical conditions, and any dietary restrictions with our intelligent AI assistant",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500&q=80",
    highlights: ["Mood analysis", "Health profiling", "Allergy detection"],
  },
  {
    step: "02",
    icon: ChefHat,
    title: "Get Personalized Menu",
    description: "Our AI curates perfect meals from verified local home chefs based on your unique nutritional requirements",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80",
    highlights: ["AI recommendations", "Chef matching", "Nutrition scoring"],
  },
  {
    step: "03",
    icon: Truck,
    title: "Enjoy Fresh & Healthy",
    description: "Receive freshly prepared, homemade meals delivered straight to your doorstep with real-time tracking",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
    highlights: ["Fresh delivery", "Live tracking", "Quality assured"],
  },
]

export function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="how-it-works" ref={ref} className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

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
            Simple Process
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Simple as{" "}
            <span className="text-primary">1</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-accent">2</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-primary">3</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From mood to meal in minutes. Our streamlined process ensures you get exactly what your body needs.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              className="relative"
            >
              {/* Step Number Background */}
              <div className="absolute -top-4 -left-4 text-[120px] font-bold text-primary/5 leading-none select-none pointer-events-none z-0">
                {step.step}
              </div>

              {/* Card */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 bg-card rounded-3xl overflow-hidden shadow-xl border border-border group"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="p-3 bg-primary rounded-2xl text-primary-foreground shadow-lg">
                      <step.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-xs font-bold text-primary mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  
                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {step.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                      >
                        <Check className="w-3 h-3 text-primary" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 border-t-2 border-dashed border-primary/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

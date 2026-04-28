"use client"

import { motion, useInView } from "motion/react"
import { useRef, useState } from "react"
import { 
  Brain, 
  Stethoscope, 
  Globe2, 
  MapPinned, 
  Users2, 
  MessageCircle,
  Pill,
  Heart,
  Baby,
  Activity,
  ChevronRight
} from "lucide-react"

const aiFeatures = [
  {
    id: "medimenu",
    icon: Stethoscope,
    title: "MediMenu AI",
    subtitle: "Health-Intelligent Recommendations",
    description: "When you indicate you're unwell, our AI Health Assistant activates, cross-referencing every menu item against a medically-validated food database to find meals safe and beneficial for your condition.",
    conditions: [
      { icon: Pill, name: "Diabetes", desc: "Low-glycemic filtering" },
      { icon: Heart, name: "Heart Disease", desc: "Low sodium options" },
      { icon: Activity, name: "Fever/Flu", desc: "Light, easy-to-digest meals" },
      { icon: Baby, name: "Pregnancy", desc: "Folate-rich suggestions" },
    ],
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-500",
  },
  {
    id: "cuisinegps",
    icon: Globe2,
    title: "CuisineGPS AI",
    subtitle: "Global Cuisine Finder",
    description: "Find authentic international cuisines anywhere in Pakistan. Our AI ranks restaurants by authenticity, quality, and user reviews across 45+ international cuisines.",
    highlights: ["Chinese", "Italian", "Lebanese", "Turkish", "Japanese", "Korean", "Thai", "Mexican"],
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
  },
  {
    id: "tasteofpakistan",
    icon: MapPinned,
    title: "Taste of Pakistan",
    subtitle: "Cultural Culinary Tourism",
    description: "An intelligent cultural food guide for tourists and locals. Discover regional specialties with AI-generated food narratives, street food safety ratings, and personalized foodie trails.",
    specialties: ["Lahori Chargha", "Karachi Nihari", "Peshawari Chapli Kebab", "Hunzai Diram Phitti", "Sindhi Biryani", "Quetta Saji"],
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-500",
  },
  {
    id: "household",
    icon: Users2,
    title: "Smart Household AI",
    subtitle: "Family-Wide Meal Planning",
    description: "Store individual health profiles for every family member. AI generates compatible meal bundles that satisfy everyone's nutritional requirements simultaneously.",
    features: ["Up to 10 profiles", "Child nutrition mode", "Elder care options", "Compatible bundles"],
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500",
  },
]

export function AIFeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeFeature, setActiveFeature] = useState(aiFeatures[0].id)

  const currentFeature = aiFeatures.find(f => f.id === activeFeature) || aiFeatures[0]

  return (
    <section id="ai-features" ref={ref} className="py-24 md:py-32 bg-foreground text-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6"
          >
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Powered by Advanced AI</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            AI Features That{" "}
            <span className="text-primary">Transform</span>{" "}
            Your Food Experience
          </h2>
          <p className="text-lg text-background/70 max-w-2xl mx-auto">
            Four revolutionary AI modules working together to understand your needs and deliver perfect meals every time
          </p>
        </motion.div>

        {/* Feature Tabs */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Tab Buttons */}
          <div className="lg:col-span-2 space-y-3">
            {aiFeatures.map((feature, index) => (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                onClick={() => setActiveFeature(feature.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group ${
                  activeFeature === feature.id
                    ? "bg-card text-card-foreground shadow-xl"
                    : "bg-background/5 hover:bg-background/10 text-background"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    activeFeature === feature.id 
                      ? `bg-gradient-to-br ${feature.color} text-white` 
                      : feature.bgColor
                  }`}>
                    <feature.icon className={`w-5 h-5 ${
                      activeFeature === feature.id ? "text-white" : feature.textColor
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className={`text-sm ${
                      activeFeature === feature.id ? "text-muted-foreground" : "text-background/60"
                    }`}>
                      {feature.subtitle}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${
                    activeFeature === feature.id ? "rotate-90 text-primary" : "text-background/40"
                  }`} />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Active Feature Content */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3 bg-card text-card-foreground rounded-3xl p-6 md:p-8 shadow-2xl"
          >
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${currentFeature.color} text-white mb-6`}>
              <currentFeature.icon className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{currentFeature.title}</h3>
            <p className="text-primary font-medium mb-4">{currentFeature.subtitle}</p>
            <p className="text-muted-foreground mb-6 text-lg">{currentFeature.description}</p>

            {/* Feature-specific content */}
            {currentFeature.id === "medimenu" && currentFeature.conditions && (
              <div className="grid sm:grid-cols-2 gap-3">
                {currentFeature.conditions.map((condition) => (
                  <div
                    key={condition.name}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-xl"
                  >
                    <div className={`p-2 rounded-lg ${currentFeature.bgColor}`}>
                      <condition.icon className={`w-4 h-4 ${currentFeature.textColor}`} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{condition.name}</div>
                      <div className="text-xs text-muted-foreground">{condition.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentFeature.id === "cuisinegps" && currentFeature.highlights && (
              <div className="flex flex-wrap gap-2">
                {currentFeature.highlights.map((cuisine) => (
                  <span
                    key={cuisine}
                    className={`px-3 py-1.5 ${currentFeature.bgColor} ${currentFeature.textColor} rounded-full text-sm font-medium`}
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            )}

            {currentFeature.id === "tasteofpakistan" && currentFeature.specialties && (
              <div className="flex flex-wrap gap-2">
                {currentFeature.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className={`px-3 py-1.5 ${currentFeature.bgColor} ${currentFeature.textColor} rounded-full text-sm font-medium`}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}

            {currentFeature.id === "household" && currentFeature.features && (
              <div className="grid sm:grid-cols-2 gap-3">
                {currentFeature.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 p-3 bg-secondary rounded-xl"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentFeature.color}`} />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* DastarkhanGPT Promo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-primary to-accent rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
                <MessageCircle className="w-10 h-10" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">DastarkhanGPT</h3>
              <p className="text-white/80 text-lg mb-4">
                Chat naturally with our AI assistant about food, health, and ordering. Ask questions like 
                &quot;I have a fever, what should I eat?&quot; or &quot;Plan a healthy lunch for my diabetic husband.&quot;
              </p>
              <button className="px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-colors">
                Try DastarkhanGPT
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

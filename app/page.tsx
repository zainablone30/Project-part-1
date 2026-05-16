"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { AIFeaturesSection } from "@/components/ai-features-section"
import { ChefSection } from "@/components/chef-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const router = useRouter()

  const handleLoginClick = () => {
    router.push("/login")
  }

  const handleSignupClick = () => {
    router.push("/signup")
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
      <HeroSection onGetStarted={handleSignupClick} />
      <FeaturesSection />
      <HowItWorksSection />
      <AIFeaturesSection />
      <ChefSection />
      <Footer />
    </main>
  )
}

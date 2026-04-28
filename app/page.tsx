"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { AIFeaturesSection } from "@/components/ai-features-section"
import { ChefSection } from "@/components/chef-section"
import { Footer } from "@/components/footer"
import { AuthModal } from "@/components/auth-modal"

export default function HomePage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  const handleLoginClick = () => {
    setAuthMode("login")
    setIsAuthOpen(true)
  }

  const handleSignupClick = () => {
    setAuthMode("signup")
    setIsAuthOpen(true)
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
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </main>
  )
}

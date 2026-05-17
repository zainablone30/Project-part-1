import type { Metadata } from "next"
import PinguChatbot from "@/components/dashboard/pingu-chatbot"
import { UserProfileProvider } from "@/lib/user-profile-context"
import { CartProvider } from "@/lib/cart-context"
import { CartSidebar, CartButton } from "@/components/dashboard/cart-sidebar"

export const metadata: Metadata = {
  title: "Dashboard | DastarKhan AI",
  description: "Your personalized food discovery dashboard with AI-powered recommendations",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProfileProvider>
      <CartProvider>
        {children}
        <CartSidebar />
        <CartButton />
        <PinguChatbot />
      </CartProvider>
    </UserProfileProvider>
  )
}

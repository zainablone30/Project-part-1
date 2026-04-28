import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | DastarKhan AI",
  description: "Your personalized food discovery dashboard with AI-powered recommendations",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

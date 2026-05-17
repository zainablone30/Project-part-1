import { Suspense } from "react"
import { AuthCallbackClient } from "./auth-callback-client"

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold">Signing you in...</p>
          </div>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  )
}

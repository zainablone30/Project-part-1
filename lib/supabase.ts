import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const cookieStorage: Pick<Storage, "getItem" | "setItem" | "removeItem"> = {
  getItem: (key) => {
    if (typeof document === "undefined") return null
    const match = document.cookie.match(new RegExp(`(?:^|; )${encodeURIComponent(key)}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
  },
  setItem: (key, value) => {
    if (typeof document === "undefined") return
    const domain = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN
    const attributes = [
      "Path=/",
      "SameSite=Lax",
      "Secure",
      domain ? `Domain=${domain}` : null,
    ]
      .filter(Boolean)
      .join("; ")
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; ${attributes}`
  },
  removeItem: (key) => {
    if (typeof document === "undefined") return
    const domain = process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN
    const attributes = [
      "Path=/",
      "SameSite=Lax",
      "Secure",
      "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      domain ? `Domain=${domain}` : null,
    ]
      .filter(Boolean)
      .join("; ")
    document.cookie = `${encodeURIComponent(key)}=; ${attributes}`
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    storage: typeof document === "undefined" ? undefined : cookieStorage,
  },
})

export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

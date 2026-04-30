"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase"

export type UserProfileData = {
  health_conditions: string[]
  allergies: string[]
  isProfileComplete: boolean
  loaded: boolean
}

const defaultProfile: UserProfileData = {
  health_conditions: [],
  allergies: [],
  isProfileComplete: true,
  loaded: false,
}

const UserProfileContext = createContext<UserProfileData>(defaultProfile)

export function useUserProfile() {
  return useContext(UserProfileContext)
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfileData>(defaultProfile)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setProfile({ ...defaultProfile, loaded: true })
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("health_conditions, allergies, profile_completed")
        .eq("id", session.user.id)
        .single()

      const conditions: string[] = data?.health_conditions || []
      const allergies: string[] = data?.allergies || []
      // Complete if: explicitly flagged OR user already has real health data set
      const hasRealConditions = conditions.length > 0 && !(conditions.length === 1 && conditions[0] === "None")
      const isProfileComplete = data?.profile_completed === true || hasRealConditions || allergies.length > 0
      setProfile({ health_conditions: conditions, allergies, isProfileComplete, loaded: true })
    }
    load()
  }, [])

  return (
    <UserProfileContext.Provider value={profile}>
      {children}
    </UserProfileContext.Provider>
  )
}

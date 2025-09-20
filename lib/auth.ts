import { createClient } from "@/lib/supabase/client"

export interface User {
  id: string
  email: string
  display_name: string
  avatar_url?: string | null
  created_at: string
}

export function getCurrentUser(): User | null {
  // Check if in guest mode
  if (typeof window !== "undefined") {
    const isGuest = localStorage.getItem("guestMode") === "true"
    if (isGuest) {
      const guestUser = localStorage.getItem("guestUser")
      return guestUser ? JSON.parse(guestUser) : null
    }
  }

  // For authenticated users, this would get the user from Supabase
  // For now, return null if not in guest mode
  return null
}

export function isGuestUser(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("guestMode") === "true"
  }
  return false
}

export async function signOut() {
  const supabase = createClient()

  // Clear guest mode
  if (typeof window !== "undefined") {
    localStorage.removeItem("guestMode")
    localStorage.removeItem("guestUser")
  }

  // Sign out from Supabase
  await supabase.auth.signOut()
}

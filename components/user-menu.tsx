"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getCurrentUser, isGuestUser, signOut, type User } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, UserIcon, Settings, Crown } from "lucide-react"

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    const guestMode = isGuestUser()

    setUser(currentUser)
    setIsGuest(guestMode)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" asChild>
          <a href="/auth/login">Sign In</a>
        </Button>
        <Button asChild>
          <a href="/auth/signup">Sign Up</a>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className={`text-white ${isGuest ? "bg-slate-600" : "bg-blue-600"}`}>
              {user.display_name?.charAt(0) || user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none text-slate-100">{user.display_name || "AI Learner"}</p>
              {isGuest && <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">Guest</span>}
            </div>
            <p className="text-xs leading-none text-slate-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-800" />

        {isGuest && (
          <>
            <DropdownMenuItem
              className="text-blue-400 focus:bg-slate-800 focus:text-blue-300"
              onClick={() => router.push("/auth/signup")}
            >
              <Crown className="mr-2 h-4 w-4" />
              <span>Create Account</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
          </>
        )}

        <DropdownMenuItem
          className="text-slate-200 focus:bg-slate-800 focus:text-slate-100"
          onClick={() => router.push("/profile")}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-slate-200 focus:bg-slate-800 focus:text-slate-100"
          onClick={() => router.push("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem className="text-slate-200 focus:bg-slate-800 focus:text-slate-100" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client';

import { BookOpen, Trophy, Users, User, Home, Zap, Brain, Code, MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UserMenu } from "@/components/user-menu"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, current: true },
  { name: "Learning Modules", href: "/modules", icon: BookOpen, current: false },
  { name: "AI Playground", href: "/playground", icon: Brain, current: false },
  { name: "AI Tools", href: "/ai-tools", icon: Code, current: false },
  { name: "Achievements", href: "/achievements", icon: Trophy, current: false },
  { name: "Community", href: "/community", icon: Users, current: false },
  { name: "Profile", href: "/profile", icon: User, current: false },
  { name: "Settings", href: "/settings", icon: Settings, current: false },
]

// Mock user data
const mockUserData = {
  level: 8,
  xp: 2450,
  next_level_xp: 800,
  achievements_count: 3,
  community_notifications: 2,
  streak_days: 12
}

export function Sidebar() {
  const [userData] = useState(mockUserData)
  
  const levelProgress = ((userData.xp % 100) / 100) * 100
  const xpToNext = userData.next_level_xp - (userData.xp % 100)

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">AI Learning Hub</span>
        </div>
        <UserMenu />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant={item.current ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-11",
              item.current
                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
            {item.name === "Achievements" && userData.achievements_count > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {userData.achievements_count}
              </Badge>
            )}
            {item.name === "Community" && userData.community_notifications > 0 && (
              <Badge variant="destructive" className="ml-auto text-xs">
                {userData.community_notifications}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-3">
          {/* Level Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-sidebar-foreground">
              <span>Level {userData.level}</span>
              <span>{xpToNext} XP to next</span>
            </div>
            <Progress value={levelProgress} className="h-1.5" />
          </div>

          {/* Streak Info */}
          <div className="flex items-center justify-between text-xs text-sidebar-foreground">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-orange-500" />
              <span>Streak</span>
            </div>
            <span className="font-medium">{userData.streak_days} days</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-sidebar-foreground">
            <div className="text-center p-2 bg-sidebar-accent/20 rounded">
              <div className="font-medium">{userData.xp}</div>
              <div>Total XP</div>
            </div>
            <div className="text-center p-2 bg-sidebar-accent/20 rounded">
              <div className="font-medium">{userData.achievements_count}</div>
              <div>Achievements</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
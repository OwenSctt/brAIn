'use client';

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Zap, 
  BookOpen, 
  Brain, 
  Code, 
  Trophy, 
  Users,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Mock user data
const mockUserData = {
  display_name: "AI Learner",
  level: 8,
  xp: 2450,
  notifications: 3,
  achievements: 2
}

const quickNav = [
  { name: "Dashboard", href: "/", icon: Zap },
  { name: "Modules", href: "/modules", icon: BookOpen },
  { name: "Playground", href: "/playground", icon: Brain },
  { name: "AI Tools", href: "/ai-tools", icon: Code },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Community", href: "/community", icon: Users },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Logo and Quick Nav */}
        <div className="flex items-center space-x-6">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              BR<span className="text-primary">AI</span>N
            </span>
          </Link>

          {/* Quick Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {quickNav.map((item) => {
              const isActive = mounted && pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-9 px-3",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules, prompts, or topics..."
              className="pl-10 pr-4 h-9"
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50">
                <div className="p-2">
                  <div className="text-sm text-muted-foreground mb-2">Recent searches</div>
                  <div className="space-y-1">
                    <div className="px-2 py-1 hover:bg-accent rounded text-sm cursor-pointer">Advanced prompting</div>
                    <div className="px-2 py-1 hover:bg-accent rounded text-sm cursor-pointer">Code generation</div>
                    <div className="px-2 py-1 hover:bg-accent rounded text-sm cursor-pointer">AI tools integration</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
            <Bell className="h-4 w-4" />
            {mockUserData.notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {mockUserData.notifications}
              </Badge>
            )}
          </Button>

          {/* User Level Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-muted rounded-full">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Level {mockUserData.level}</span>
            <Badge variant="secondary" className="text-xs">
              {mockUserData.xp} XP
            </Badge>
          </div>

          {/* Settings */}
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>

          {/* Profile */}
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <User className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-2 space-y-1">
            {quickNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}

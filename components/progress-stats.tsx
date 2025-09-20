"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Star, TrendingUp } from "lucide-react"
import { progressTracker } from "@/lib/progress"
import { createClient } from "@/lib/supabase/client"

interface ProgressStatsProps {
  userId?: string
}

export function ProgressStats({ userId }: ProgressStatsProps) {
  const [stats, setStats] = useState({
    completedLessons: 0,
    completedModules: 0,
    totalAchievements: 0,
    currentLevel: 1,
    currentXP: 0,
    xpToNextLevel: 1000,
    xpProgress: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const supabase = createClient()

        // Get user profile
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase.from("profiles").select("level, xp").eq("id", user.id).single()

        // Get progress data
        const progress = await progressTracker.getUserProgress()
        const achievements = await progressTracker.getUserAchievements()

        const completedLessons = progress?.length || 0
        const completedModules = progress ? new Set(progress.map((p) => p.module_id)).size : 0
        const totalAchievements = achievements?.length || 0
        const currentLevel = profile?.level || 1
        const currentXP = profile?.xp || 0
        const xpInCurrentLevel = currentXP % 1000
        const xpProgress = (xpInCurrentLevel / 1000) * 100

        setStats({
          completedLessons,
          completedModules,
          totalAchievements,
          currentLevel,
          currentXP,
          xpToNextLevel: 1000 - xpInCurrentLevel,
          xpProgress,
        })
      } catch (error) {
        console.error("Failed to load progress stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [userId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Lessons Completed</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{stats.completedLessons}</div>
            <p className="text-xs text-slate-400">Keep learning to unlock more!</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Modules Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{stats.completedModules}</div>
            <p className="text-xs text-slate-400">Modules mastered</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{stats.totalAchievements}</div>
            <p className="text-xs text-slate-400">Badges earned</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Current Level</CardTitle>
            <Star className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-slate-100">{stats.currentLevel}</div>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                {stats.currentXP} XP
              </Badge>
            </div>
            <p className="text-xs text-slate-400">{stats.xpToNextLevel} XP to next level</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Level {stats.currentLevel}</span>
              <span className="text-slate-400">Level {stats.currentLevel + 1}</span>
            </div>
            <Progress value={stats.xpProgress} className="h-2" />
            <p className="text-xs text-slate-400 text-center">{stats.currentXP % 1000} / 1000 XP</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { ProgressStats }

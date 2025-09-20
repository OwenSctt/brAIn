import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Target, Calendar } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user progress
  const { data: progress } = await supabase.from("user_progress").select("*").eq("user_id", user.id)

  // Fetch user achievements
  const { data: achievements } = await supabase.from("user_achievements").select("*").eq("user_id", user.id)

  const completedModules = progress?.length || 0
  const totalAchievements = achievements?.length || 0
  const currentLevel = profile?.level || 1
  const currentXP = profile?.xp || 0
  const xpToNextLevel = currentLevel * 1000
  const xpProgress = (currentXP % 1000) / 10

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <div className="flex-1 container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback className="bg-blue-600 text-white text-xl">
            {profile?.display_name?.charAt(0) || user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">{profile?.display_name || "AI Learner"}</h1>
          <p className="text-slate-400">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-blue-600 text-white">
              Level {currentLevel}
            </Badge>
            <span className="text-sm text-slate-400">{currentXP} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Modules Completed</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{completedModules}</div>
            <p className="text-xs text-slate-400">Keep learning to unlock more!</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{totalAchievements}</div>
            <p className="text-xs text-slate-400">Badges earned</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Current Level</CardTitle>
            <Star className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{currentLevel}</div>
            <p className="text-xs text-slate-400">{xpToNextLevel - (currentXP % 1000)} XP to next level</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">
              {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
            <p className="text-xs text-slate-400">Welcome to the community!</p>
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
              <span className="text-slate-400">Level {currentLevel}</span>
              <span className="text-slate-400">Level {currentLevel + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
            <p className="text-xs text-slate-400 text-center">{currentXP % 1000} / 1000 XP</p>
          </div>
        </CardContent>
      </Card>

      {profile?.bio && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">{profile.bio}</p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Zap, Target, TrendingUp, Star } from "lucide-react"

export function UserStats() {
  const currentLevel = 3
  const currentXP = 1250
  const nextLevelXP = 2000
  const progressToNext = (currentXP / nextLevelXP) * 100

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Level Progress
          </CardTitle>
          <CardDescription>Keep learning to level up and unlock new features!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-lg font-bold text-accent">{currentLevel}</span>
              </div>
              <div>
                <h3 className="font-semibold">Level {currentLevel}</h3>
                <p className="text-sm text-muted-foreground">Prompt Apprentice</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              {currentXP} XP
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>
                {currentXP} / {nextLevelXP} XP
              </span>
            </div>
            <Progress value={progressToNext} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {nextLevelXP - currentXP} XP needed to reach Level {currentLevel + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Modules Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-accent/20 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-secondary/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Community Rank</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { AchievementsGrid } from "@/components/achievements-grid"
import { UserStats } from "@/components/user-stats"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Zap } from "lucide-react"

export default function AchievementsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Achievements & Progress</h1>
          <p className="text-muted-foreground text-pretty">Track your learning journey and celebrate your milestones</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <UserStats />
            <AchievementsGrid />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <LeaderboardCard />

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <Target className="h-4 w-4" />
                  Set Learning Goal
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <Zap className="h-4 w-4" />
                  Daily Challenge
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                  <Trophy className="h-4 w-4" />
                  View All Badges
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

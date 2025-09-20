import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"

const leaderboardData = [
  {
    rank: 1,
    name: "Alex Chen",
    xp: 4250,
    level: 8,
    badge: "AI Master",
    avatar: "AC",
    trend: "up",
  },
  {
    rank: 2,
    name: "Sarah Kim",
    xp: 3890,
    level: 7,
    badge: "Prompt Guru",
    avatar: "SK",
    trend: "up",
  },
  {
    rank: 3,
    name: "Mike Johnson",
    xp: 3654,
    level: 7,
    badge: "Code Wizard",
    avatar: "MJ",
    trend: "down",
  },
  {
    rank: 47,
    name: "You",
    xp: 1250,
    level: 3,
    badge: "Prompt Apprentice",
    avatar: "JD",
    trend: "up",
    isCurrentUser: true,
  },
]

export function LeaderboardCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Leaderboard
        </CardTitle>
        <CardDescription>See how you rank among fellow learners</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              user.isCurrentUser ? "bg-accent/10 border border-accent/20" : ""
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex items-center justify-center w-6 text-sm font-medium">
                {user.rank <= 3 ? (
                  user.rank === 1 ? (
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  ) : user.rank === 2 ? (
                    <Medal className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Award className="h-4 w-4 text-amber-600" />
                  )
                ) : (
                  <span className="text-muted-foreground">#{user.rank}</span>
                )}
              </div>

              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium truncate ${user.isCurrentUser ? "text-accent" : ""}`}>
                    {user.name}
                  </p>
                  {user.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Level {user.level}</span>
                  <span>•</span>
                  <span>{user.xp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            <Badge variant="outline" className="text-xs">
              {user.badge}
            </Badge>
          </div>
        ))}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">Weekly leaderboard resets every Monday</p>
        </div>
      </CardContent>
    </Card>
  )
}

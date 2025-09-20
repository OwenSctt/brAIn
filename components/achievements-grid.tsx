import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Zap, Target, Users, BookOpen, Clock, Award, Lock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first learning module",
    icon: BookOpen,
    category: "Learning",
    xp: 100,
    unlocked: true,
    completed: true,
    progress: 100,
    rarity: "common",
    unlockedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Prompt Master",
    description: "Create 10 successful prompts",
    icon: Star,
    category: "Prompting",
    xp: 250,
    unlocked: true,
    completed: true,
    progress: 100,
    rarity: "rare",
    unlockedAt: "1 day ago",
  },
  {
    id: 3,
    title: "Speed Learner",
    description: "Complete 3 modules in one day",
    icon: Zap,
    category: "Learning",
    xp: 200,
    unlocked: true,
    completed: true,
    progress: 100,
    rarity: "uncommon",
    unlockedAt: "3 days ago",
  },
  {
    id: 4,
    title: "Community Helper",
    description: "Help 5 fellow learners in the community",
    icon: Users,
    category: "Community",
    xp: 300,
    unlocked: true,
    completed: true,
    progress: 100,
    rarity: "rare",
    unlockedAt: "1 week ago",
  },
  {
    id: 5,
    title: "Streak Master",
    description: "Maintain a 7-day learning streak",
    icon: Target,
    category: "Consistency",
    xp: 350,
    unlocked: true,
    completed: true,
    progress: 100,
    rarity: "epic",
    unlockedAt: "Today",
  },
  {
    id: 6,
    title: "AI Whisperer",
    description: "Get 95%+ accuracy on 20 prompt challenges",
    icon: Award,
    category: "Mastery",
    xp: 500,
    unlocked: true,
    completed: false,
    progress: 75,
    rarity: "legendary",
    requirement: "15/20 completed",
  },
  {
    id: 7,
    title: "Knowledge Seeker",
    description: "Complete all modules in a learning path",
    icon: Trophy,
    category: "Learning",
    xp: 400,
    unlocked: true,
    completed: false,
    progress: 37.5,
    rarity: "epic",
    requirement: "3/8 paths completed",
  },
  {
    id: 8,
    title: "Early Bird",
    description: "Complete 10 modules before 9 AM",
    icon: Clock,
    category: "Timing",
    xp: 150,
    unlocked: false,
    completed: false,
    progress: 0,
    rarity: "uncommon",
    requirement: "Unlock at Level 5",
  },
  {
    id: 9,
    title: "Perfectionist",
    description: "Score 100% on 5 consecutive assessments",
    icon: Star,
    category: "Mastery",
    xp: 600,
    unlocked: false,
    completed: false,
    progress: 0,
    rarity: "legendary",
    requirement: "Unlock at Level 10",
  },
]

const rarityColors = {
  common: "bg-gray-500/20 text-gray-500 border-gray-500/20",
  uncommon: "bg-green-500/20 text-green-500 border-green-500/20",
  rare: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  epic: "bg-purple-500/20 text-purple-500 border-purple-500/20",
  legendary: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20",
}

export function AchievementsGrid() {
  const completedCount = achievements.filter((a) => a.completed).length
  const totalCount = achievements.length

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement Progress
          </CardTitle>
          <CardDescription>
            {completedCount} of {totalCount} achievements unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={(completedCount / totalCount) * 100} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon

          return (
            <Card
              key={achievement.id}
              className={cn(
                "relative transition-all duration-200",
                achievement.completed && "ring-2 ring-accent/50",
                !achievement.unlocked && "opacity-60",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      achievement.completed ? "bg-accent/20" : achievement.unlocked ? "bg-muted" : "bg-muted/50",
                    )}
                  >
                    {!achievement.unlocked ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : achievement.completed ? (
                      <CheckCircle className="h-5 w-5 text-accent" />
                    ) : (
                      <IconComponent className="h-5 w-5 text-foreground" />
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", rarityColors[achievement.rarity as keyof typeof rarityColors])}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-base">{achievement.title}</CardTitle>
                  <CardDescription className="text-sm">{achievement.description}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="secondary" className="gap-1">
                    <Zap className="h-3 w-3" />
                    {achievement.xp} XP
                  </Badge>
                  <Badge variant="outline">{achievement.category}</Badge>
                </div>

                {achievement.unlocked && !achievement.completed && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-1.5" />
                    {achievement.requirement && (
                      <p className="text-xs text-muted-foreground">{achievement.requirement}</p>
                    )}
                  </div>
                )}

                {achievement.completed && achievement.unlockedAt && (
                  <p className="text-xs text-accent">Unlocked {achievement.unlockedAt}</p>
                )}

                {!achievement.unlocked && achievement.requirement && (
                  <p className="text-xs text-muted-foreground">{achievement.requirement}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

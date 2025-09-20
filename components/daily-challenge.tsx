import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Clock, Trophy, Target } from "lucide-react"

export function DailyChallenge() {
  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Daily Challenge
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            18h left
          </Badge>
        </div>
        <CardDescription>Complete today's challenge to earn bonus XP!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Prompt Optimization Challenge</h4>
          <p className="text-sm text-muted-foreground">
            Take a poorly written prompt and optimize it for better results. Show your understanding of prompt
            engineering principles.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-accent" />
            <span>+150 XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4 text-accent" />
            <span>Streak Bonus</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Community Progress</span>
            <span>67% completed</span>
          </div>
          <Progress value={67} className="h-2" />
        </div>

        <Button className="w-full gap-2">
          <Zap className="h-4 w-4" />
          Start Challenge
        </Button>
      </CardContent>
    </Card>
  )
}

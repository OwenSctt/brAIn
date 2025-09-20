import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Play, ArrowLeft, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModuleSidebarProps {
  moduleId: string
}

const lessons = [
  { id: 1, title: "What is AI Prompting?", duration: "5 min", completed: true },
  { id: 2, title: "Basic Prompt Structure", duration: "8 min", completed: true },
  { id: 3, title: "Common Prompt Patterns", duration: "12 min", completed: true },
  { id: 4, title: "Hands-on: Your First Prompt", duration: "15 min", completed: false, current: true },
  { id: 5, title: "Prompt Refinement Techniques", duration: "10 min", completed: false },
  { id: 6, title: "Real-world Scenarios", duration: "20 min", completed: false },
  { id: 7, title: "Best Practices & Tips", duration: "8 min", completed: false },
  { id: 8, title: "Module Assessment", duration: "12 min", completed: false },
]

export function ModuleSidebar({ moduleId }: ModuleSidebarProps) {
  const completedLessons = lessons.filter((lesson) => lesson.completed).length
  const progress = (completedLessons / lessons.length) * 100

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <Button variant="ghost" className="mb-4 p-0 h-auto text-sidebar-foreground hover:text-sidebar-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Modules
        </Button>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Introduction to AI Prompting</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Beginner</Badge>
            <Badge variant="outline">45 min</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-sidebar-foreground">
              <span>Progress</span>
              <span>
                {completedLessons} of {lessons.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {lessons.map((lesson, index) => (
            <Button
              key={lesson.id}
              variant="ghost"
              className={cn(
                "w-full justify-start p-3 h-auto text-left",
                lesson.current && "bg-sidebar-accent text-sidebar-accent-foreground",
                lesson.completed && "text-sidebar-foreground/70",
              )}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="mt-0.5">
                  {lesson.completed ? (
                    <CheckCircle className="h-5 w-5 text-accent" />
                  ) : lesson.current ? (
                    <Play className="h-5 w-5 text-sidebar-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-sm">{lesson.title}</div>
                  <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Achievement Preview */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-sidebar-accent-foreground">Module Reward</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Complete this module to earn the "Prompt Apprentice" badge and 250 XP!
          </p>
        </div>
      </div>
    </div>
  )
}

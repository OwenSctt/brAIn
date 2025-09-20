import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Star, Users, Zap, Play, CheckCircle } from "lucide-react"

const modules = [
  {
    id: 1,
    title: "Introduction to AI Prompting",
    description: "Learn the fundamentals of crafting effective prompts for AI models",
    difficulty: "Beginner",
    category: "Prompt Engineering",
    duration: "45 min",
    lessons: 8,
    rating: 4.8,
    enrolled: 1234,
    progress: 75,
    completed: false,
    image: "/ai-brain-circuit-pattern.jpg",
  },
  {
    id: 2,
    title: "Advanced Prompt Techniques",
    description: "Master complex prompting strategies like chain-of-thought and few-shot learning",
    difficulty: "Advanced",
    category: "Prompt Engineering",
    duration: "90 min",
    lessons: 12,
    rating: 4.9,
    enrolled: 856,
    progress: 0,
    completed: false,
    image: "/advanced-ai-neural-network.jpg",
  },
  {
    id: 3,
    title: "AI Code Generation Mastery",
    description: "Learn to generate, debug, and optimize code using AI assistants",
    difficulty: "Intermediate",
    category: "Code Generation",
    duration: "60 min",
    lessons: 10,
    rating: 4.7,
    enrolled: 2103,
    progress: 100,
    completed: true,
    image: "/code-generation-ai-programming.jpg",
  },
  {
    id: 4,
    title: "Data Analysis with AI Tools",
    description: "Harness AI for data cleaning, analysis, and visualization tasks",
    difficulty: "Intermediate",
    category: "Data Analysis",
    duration: "75 min",
    lessons: 9,
    rating: 4.6,
    enrolled: 967,
    progress: 25,
    completed: false,
    image: "/data-analysis-charts-ai.jpg",
  },
  {
    id: 5,
    title: "AI Tool Integration Strategies",
    description: "Learn to integrate multiple AI tools into your development workflow",
    difficulty: "Advanced",
    category: "AI Tools",
    duration: "120 min",
    lessons: 15,
    rating: 4.8,
    enrolled: 543,
    progress: 0,
    completed: false,
    image: "/ai-tools-integration-workflow.jpg",
  },
  {
    id: 6,
    title: "Prompt Debugging & Optimization",
    description: "Debug failing prompts and optimize them for better performance",
    difficulty: "Intermediate",
    category: "Prompt Engineering",
    duration: "50 min",
    lessons: 7,
    rating: 4.9,
    enrolled: 1456,
    progress: 0,
    completed: false,
    image: "/debugging-optimization-ai-prompts.jpg",
  },
]

export function ModulesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <Card key={module.id} className="group hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={module.image || "/placeholder.svg"}
              alt={module.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {module.completed && (
              <div className="absolute top-3 right-3 bg-accent text-accent-foreground rounded-full p-1">
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge
                variant={
                  module.difficulty === "Beginner"
                    ? "secondary"
                    : module.difficulty === "Intermediate"
                      ? "default"
                      : "destructive"
                }
              >
                {module.difficulty}
              </Badge>
            </div>
          </div>

          <CardHeader className="space-y-3">
            <div className="space-y-2">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">{module.title}</CardTitle>
              <CardDescription className="text-sm">{module.description}</CardDescription>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {module.duration}
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {module.lessons} lessons
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                {module.rating}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {module.enrolled.toLocaleString()} enrolled
              </div>
              <Badge variant="outline">{module.category}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {module.progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>
            )}

            <Button className="w-full gap-2" variant={module.completed ? "outline" : "default"}>
              {module.completed ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Review Module
                </>
              ) : module.progress > 0 ? (
                <>
                  <Play className="h-4 w-4" />
                  Continue Learning
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Start Module
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

'use client';

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Clock, Star, Play, CheckCircle, Lock, Filter, Search } from "lucide-react"
import { useState } from "react"

const mockModules = [
  {
    id: "module-1",
    title: "Advanced Prompting Techniques",
    description: "Master the art of crafting effective AI prompts for complex tasks and scenarios",
    category: "advanced",
    difficulty_level: 4,
    estimated_duration: 120,
    progress: 37.5,
    lessons_completed: 3,
    total_lessons: 8,
    is_current: true,
    is_locked: false,
    rating: 4.8,
    students_count: 1250,
    prerequisites: ["Basic Prompting Fundamentals"],
    skills: ["Prompt Engineering", "Context Management", "Chain of Thought"]
  },
  {
    id: "module-2", 
    title: "AI Tool Integration",
    description: "Learn to integrate various AI tools into your development workflow",
    category: "tools",
    difficulty_level: 3,
    estimated_duration: 90,
    progress: 0,
    lessons_completed: 0,
    total_lessons: 6,
    is_current: false,
    is_locked: false,
    rating: 4.6,
    students_count: 890,
    prerequisites: [],
    skills: ["API Integration", "Workflow Automation", "Tool Selection"]
  },
  {
    id: "module-3",
    title: "Building AI Applications",
    description: "Create real-world applications using AI technologies and frameworks",
    category: "projects", 
    difficulty_level: 5,
    estimated_duration: 180,
    progress: 0,
    lessons_completed: 0,
    total_lessons: 10,
    is_current: false,
    is_locked: true,
    rating: 4.9,
    students_count: 567,
    prerequisites: ["Advanced Prompting Techniques", "AI Tool Integration"],
    skills: ["Full-Stack Development", "AI Integration", "Deployment"]
  },
  {
    id: "module-4",
    title: "Basic Prompting Fundamentals",
    description: "Learn the fundamentals of effective AI prompting for beginners",
    category: "fundamentals",
    difficulty_level: 1,
    estimated_duration: 60,
    progress: 100,
    lessons_completed: 5,
    total_lessons: 5,
    is_current: false,
    is_locked: false,
    rating: 4.5,
    students_count: 2100,
    prerequisites: [],
    skills: ["Basic Prompting", "Clear Communication", "Iterative Improvement"]
  },
  {
    id: "module-5",
    title: "AI Ethics and Safety",
    description: "Understand the ethical implications and safety considerations in AI development",
    category: "fundamentals",
    difficulty_level: 2,
    estimated_duration: 75,
    progress: 0,
    lessons_completed: 0,
    total_lessons: 4,
    is_current: false,
    is_locked: false,
    rating: 4.7,
    students_count: 743,
    prerequisites: [],
    skills: ["Ethical AI", "Bias Detection", "Safety Protocols"]
  },
  {
    id: "module-6",
    title: "Advanced AI Models",
    description: "Deep dive into cutting-edge AI models and their applications",
    category: "advanced",
    difficulty_level: 5,
    estimated_duration: 150,
    progress: 0,
    lessons_completed: 0,
    total_lessons: 7,
    is_current: false,
    is_locked: true,
    rating: 4.8,
    students_count: 234,
    prerequisites: ["Advanced Prompting Techniques", "Building AI Applications"],
    skills: ["Model Architecture", "Fine-tuning", "Performance Optimization"]
  }
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "fundamentals", label: "Fundamentals" },
  { value: "advanced", label: "Advanced" },
  { value: "tools", label: "Tools" },
  { value: "projects", label: "Projects" }
]

const difficultyLevels = [
  { value: "all", label: "All Levels" },
  { value: "1", label: "Beginner" },
  { value: "2", label: "Intermediate" },
  { value: "3", label: "Advanced" },
  { value: "4", label: "Expert" },
  { value: "5", label: "Master" }
]

export default function ModulesPage() {
  const [modules] = useState(mockModules)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || module.difficulty_level.toString() === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return "text-green-600 bg-green-100"
      case 2: return "text-blue-600 bg-blue-100"
      case 3: return "text-yellow-600 bg-yellow-100"
      case 4: return "text-orange-600 bg-orange-100"
      case 5: return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return "Beginner"
      case 2: return "Intermediate"
      case 3: return "Advanced"
      case 4: return "Expert"
      case 5: return "Master"
      default: return "Unknown"
    }
  }

  const handleStartModule = (moduleId: string) => {
    console.log("Starting module:", moduleId)
  }

  const handleContinueModule = (moduleId: string) => {
    console.log("Continuing module:", moduleId)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">Learning Modules</h1>
            <p className="text-muted-foreground text-pretty">
              Explore our comprehensive collection of AI learning modules designed for all skill levels
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <Card key={module.id} className={`${module.is_current ? "ring-2 ring-primary" : ""} ${module.is_locked ? "opacity-60" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                    </div>
                    {module.is_current && (
                      <Badge variant="default">Current</Badge>
                    )}
                    {module.is_locked && (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className={getDifficultyColor(module.difficulty_level)}>
                      {getDifficultyLabel(module.difficulty_level)}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{module.estimated_duration} min</span>
                    </div>
                  </div>

                  {/* Rating and Students */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{module.rating}</span>
                    </div>
                    <span className="text-muted-foreground">{module.students_count} students</span>
                  </div>

                  {/* Progress */}
                  {module.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{module.lessons_completed}/{module.total_lessons} lessons</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  )}

                  {/* Prerequisites */}
                  {module.prerequisites.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {module.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Skills you'll learn:</p>
                    <div className="flex flex-wrap gap-1">
                      {module.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {module.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{module.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full"
                    variant={module.is_current ? "default" : "outline"}
                    disabled={module.is_locked}
                    onClick={() => module.is_current ? handleContinueModule(module.id) : handleStartModule(module.id)}
                  >
                    {module.is_locked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </>
                    ) : module.is_current ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continue
                      </>
                    ) : module.progress === 100 ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Start Module
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No modules found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
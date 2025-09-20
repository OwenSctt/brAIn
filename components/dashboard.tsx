'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Trophy, Users, Zap, Star, Clock, Target, Brain, Code, MessageSquare, TrendingUp } from "lucide-react"
import { XPDisplay } from "@/components/gamification/XPDisplay"
import { AchievementBadge } from "@/components/gamification/AchievementBadge"
import { Leaderboard } from "@/components/gamification/Leaderboard"
import { useState, useEffect } from "react"

// Mock user data - in a real app, this would come from the database
const mockUserData = {
  id: "user-123",
  display_name: "AI Learner",
  avatar_url: "",
  level: 8,
  xp: 2450,
  daily_xp: 180,
  daily_goal: 200,
  streak_days: 12,
  modules_completed: 5,
  lessons_completed: 23,
  current_module: {
    id: "module-1",
    title: "Advanced Prompting Techniques",
    description: "Master the art of crafting effective AI prompts for complex tasks",
    progress: 3,
    total: 8,
    current_lesson: "Context Management in Prompts"
  },
  recent_achievements: [
    {
      id: "achievement-1",
      title: "Prompt Master",
      description: "Completed 10 prompting exercises",
      category: "learning",
      xp_reward: 100,
      earned_at: new Date("2024-09-18T10:30:00Z")
    },
    {
      id: "achievement-2", 
      title: "Speed Learner",
      description: "Completed 3 modules in one day",
      category: "milestone",
      xp_reward: 200,
      earned_at: new Date("2024-09-15T14:20:00Z")
    },
    {
      id: "achievement-3",
      title: "Community Helper", 
      description: "Helped 5 fellow learners",
      category: "community",
      xp_reward: 150,
      earned_at: new Date("2024-09-13T09:15:00Z")
    }
  ],
  recent_activities: [
    {
      type: "lesson_completion",
      points: 50,
      timestamp: new Date("2024-09-19T22:30:00Z"),
      description: "Completed: Context Management in Prompts"
    },
    {
      type: "module_completion", 
      points: 200,
      timestamp: new Date("2024-09-19T20:30:00Z"),
      description: "Completed: Basic Prompting Fundamentals"
    },
    {
      type: "community_post",
      points: 25,
      timestamp: new Date("2024-09-19T18:30:00Z"),
      description: "Shared a helpful prompt template"
    }
  ],
  xp_milestones: [
    { milestone: 1000, achieved: true, progress: 100, description: "First 1000 XP" },
    { milestone: 2000, achieved: true, progress: 100, description: "Two thousand club" },
    { milestone: 5000, achieved: false, progress: 49, description: "Five thousand club" },
    { milestone: 10000, achieved: false, progress: 24.5, description: "Ten thousand master" }
  ]
}

const mockLeaderboardData = [
  {
    id: "user-1",
    rank: 1,
    display_name: "AI Master",
    avatar_url: "",
    score: 15420,
    level: 15,
    xp: 15420,
    streak_days: 45,
    modules_completed: 12,
    community_contributions: 89,
    is_current_user: false,
    change: "up"
  },
  {
    id: "user-2", 
    rank: 2,
    display_name: "Prompt Wizard",
    avatar_url: "",
    score: 12850,
    level: 13,
    xp: 12850,
    streak_days: 32,
    modules_completed: 10,
    community_contributions: 67,
    is_current_user: false,
    change: "down"
  },
  {
    id: "user-123",
    rank: 3,
    display_name: "AI Learner",
    avatar_url: "",
    score: 2450,
    level: 8,
    xp: 2450,
    streak_days: 12,
    modules_completed: 5,
    community_contributions: 23,
    is_current_user: true,
    change: "up"
  }
]

const mockLearningModules = [
  {
    id: "module-1",
    title: "Advanced Prompting Techniques",
    description: "Master the art of crafting effective AI prompts for complex tasks",
    category: "advanced",
    difficulty_level: 4,
    estimated_duration: 120,
    progress: 37.5,
    lessons_completed: 3,
    total_lessons: 8,
    is_current: true
  },
  {
    id: "module-2", 
    title: "AI Tool Integration",
    description: "Learn to integrate various AI tools into your workflow",
    category: "tools",
    difficulty_level: 3,
    estimated_duration: 90,
    progress: 0,
    lessons_completed: 0,
    total_lessons: 6,
    is_current: false
  },
  {
    id: "module-3",
    title: "Building AI Applications",
    description: "Create real-world applications using AI technologies",
    category: "projects", 
    difficulty_level: 5,
    estimated_duration: 180,
    progress: 0,
    lessons_completed: 0,
    total_lessons: 10,
    is_current: false
  }
]

export function Dashboard() {
  const [userData, setUserData] = useState(mockUserData)
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData)
  const [learningModules, setLearningModules] = useState(mockLearningModules)
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate level info
  const levelInfo = {
    level: userData.level,
    xp_required: userData.level * 100,
    xp_total: userData.xp,
    xp_to_next: (userData.level + 1) * 100 - userData.xp,
    progress_percentage: ((userData.xp % 100) / 100) * 100
  }

  const handleContinueLearning = () => {
    // Navigate to current module
    console.log("Continue learning:", userData.current_module.id)
  }

  const handleStartModule = (moduleId: string) => {
    // Navigate to module
    console.log("Start module:", moduleId)
  }

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Welcome back, {userData.display_name}!</h1>
        <p className="text-muted-foreground text-pretty">
          Continue your AI mastery journey. You're making great progress!
        </p>
      </div>

      {/* XP Display */}
      <XPDisplay
        levelInfo={levelInfo}
        dailyXP={userData.daily_xp}
        dailyGoal={userData.daily_goal}
        streakDays={userData.streak_days}
        recentActivities={userData.recent_activities}
        xpMilestones={userData.xp_milestones}
      />

      {/* Current Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current Learning Path: {userData.current_module.title}
          </CardTitle>
          <CardDescription>{userData.current_module.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{userData.current_module.progress} of {userData.current_module.total} modules</span>
            </div>
            <Progress value={(userData.current_module.progress / userData.current_module.total) * 100} className="h-2" />
          </div>
          <div className="text-sm text-muted-foreground">
            Current lesson: {userData.current_module.current_lesson}
          </div>
          <Button className="w-full" onClick={handleContinueLearning}>
            Continue Learning
          </Button>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <div className="space-y-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "learning" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("learning")}
          >
            Learning
          </Button>
          <Button
            variant={activeTab === "achievements" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
          </Button>
          <Button
            variant={activeTab === "leaderboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </Button>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.recent_achievements.map((achievement, index) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <AchievementBadge
                      achievement={achievement}
                      size="sm"
                      earned={true}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant="secondary">+{achievement.xp_reward} XP</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Jump into learning or explore the community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 bg-transparent"
                  onClick={() => handleQuickAction("new-module")}
                >
                  <BookOpen className="h-4 w-4" />
                  Start New Module
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 bg-transparent"
                  onClick={() => handleQuickAction("ai-playground")}
                >
                  <Brain className="h-4 w-4" />
                  AI Playground
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 bg-transparent"
                  onClick={() => handleQuickAction("community")}
                >
                  <Users className="h-4 w-4" />
                  Browse Community
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 bg-transparent"
                  onClick={() => handleQuickAction("daily-challenge")}
                >
                  <Clock className="h-4 w-4" />
                  Daily Challenge
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "learning" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Learning Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningModules.map((module) => (
                <Card key={module.id} className={module.is_current ? "ring-2 ring-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">
                        {module.category} • Level {module.difficulty_level}
                      </Badge>
                      <span>{module.estimated_duration} min</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{module.lessons_completed}/{module.total_lessons} lessons</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>

                    <Button 
                      className="w-full"
                      variant={module.is_current ? "default" : "outline"}
                      onClick={() => handleStartModule(module.id)}
                    >
                      {module.is_current ? "Continue" : "Start Module"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.recent_achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <AchievementBadge
                        achievement={achievement}
                        size="lg"
                        earned={true}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">+{achievement.xp_reward} XP</Badge>
                          <span className="text-xs text-muted-foreground">
                            {achievement.earned_at.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <Leaderboard
              entries={leaderboardData}
              currentUserId={userData.id}
              selectedPeriod="all_time"
              selectedType="xp"
              onPeriodChange={() => {}}
              onTypeChange={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  )
}
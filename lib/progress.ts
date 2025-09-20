import { createClient } from "@/lib/supabase/client"

export interface UserProgress {
  id: string
  user_id: string
  module_id: string
  lesson_id: string
  completed_at: string
  score?: number
}

export interface Achievement {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
}

export class ProgressTracker {
  private supabase = createClient()

  async markLessonComplete(moduleId: string, lessonId: string, score?: number) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // Mark lesson as complete
    const { error: progressError } = await this.supabase.from("user_progress").upsert({
      user_id: user.id,
      module_id: moduleId,
      lesson_id: lessonId,
      score,
      completed_at: new Date().toISOString(),
    })

    if (progressError) throw progressError

    // Calculate XP gained (base 100 + score bonus)
    const xpGained = 100 + (score || 0)

    // Update user XP and potentially level
    await this.updateUserXP(xpGained)

    // Check for achievements
    await this.checkAchievements(moduleId, lessonId)

    return { xpGained }
  }

  async updateUserXP(xpGained: number) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // Get current profile
    const { data: profile } = await this.supabase.from("profiles").select("xp, level").eq("id", user.id).single()

    if (!profile) return

    const newXP = (profile.xp || 0) + xpGained
    const newLevel = Math.floor(newXP / 1000) + 1

    // Update profile with new XP and level
    const { error } = await this.supabase
      .from("profiles")
      .update({
        xp: newXP,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) throw error

    // If level increased, award level-up achievement
    if (newLevel > (profile.level || 1)) {
      await this.awardAchievement(`level_${newLevel}`)
    }
  }

  async awardAchievement(achievementId: string) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // Check if user already has this achievement
    const { data: existing } = await this.supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", user.id)
      .eq("achievement_id", achievementId)
      .single()

    if (existing) return // Already has this achievement

    // Award the achievement
    const { error } = await this.supabase.from("user_achievements").insert({
      user_id: user.id,
      achievement_id: achievementId,
      earned_at: new Date().toISOString(),
    })

    if (error) throw error
  }

  async checkAchievements(moduleId: string, lessonId: string) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // Get user's progress
    const { data: progress } = await this.supabase.from("user_progress").select("*").eq("user_id", user.id)

    if (!progress) return

    const completedLessons = progress.length
    const completedModules = new Set(progress.map((p) => p.module_id)).size

    // First lesson achievement
    if (completedLessons === 1) {
      await this.awardAchievement("first_lesson")
    }

    // Module completion achievements
    if (completedModules >= 1) {
      await this.awardAchievement("first_module")
    }
    if (completedModules >= 5) {
      await this.awardAchievement("module_master")
    }

    // Lesson count achievements
    if (completedLessons >= 10) {
      await this.awardAchievement("dedicated_learner")
    }
    if (completedLessons >= 25) {
      await this.awardAchievement("ai_enthusiast")
    }
    if (completedLessons >= 50) {
      await this.awardAchievement("prompt_master")
    }
  }

  async getUserProgress() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) return null

    const { data: progress } = await this.supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })

    return progress
  }

  async getUserAchievements() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) return null

    const { data: achievements } = await this.supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })

    return achievements
  }
}

export const progressTracker = new ProgressTracker()

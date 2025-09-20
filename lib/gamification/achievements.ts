// Achievement System for AI Learning App
// Handles achievement checking, badge management, and progress tracking

import { Database } from '../database/schema';
import { Achievement, AchievementRequirements } from '../database/schema';

export interface AchievementProgress {
  achievement_id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  xp_reward: number;
  progress: number;
  max_progress: number;
  completed: boolean;
  earned_at?: string;
}

export interface UserAchievementStats {
  total_achievements: number;
  by_category: Record<string, number>;
  recent_achievements: Achievement[];
  progress_achievements: AchievementProgress[];
}

// Achievement categories and their display properties
export const ACHIEVEMENT_CATEGORIES = {
  learning: {
    name: 'Learning',
    color: 'blue',
    icon: 'book-open',
  },
  community: {
    name: 'Community',
    color: 'green',
    icon: 'users',
  },
  technical: {
    name: 'Technical',
    color: 'purple',
    icon: 'code',
  },
  milestone: {
    name: 'Milestone',
    color: 'gold',
    icon: 'trophy',
  },
} as const;

// Check if user meets achievement requirements
export function checkAchievementRequirements(
  requirements: AchievementRequirements,
  userStats: any
): { met: boolean; progress: number; max_progress: number } {
  const { type, count = 1, category, min_difficulty, min_percentage, min_days, min_rating, hours, level, amount } = requirements;

  let progress = 0;
  let max_progress = count;

  switch (type) {
    case 'lesson_completion':
      progress = userStats.lessons_completed || 0;
      break;

    case 'module_completion':
      progress = userStats.modules_completed || 0;
      break;

    case 'category_completion':
      progress = userStats.modules_by_category?.[category] || 0;
      max_progress = userStats.total_modules_in_category?.[category] || 1;
      break;

    case 'difficulty_completion':
      progress = userStats.modules_by_difficulty?.[min_difficulty || 1] || 0;
      break;

    case 'streak':
      progress = userStats.streaks?.[type] || 0;
      max_progress = min_days || 1;
      break;

    case 'community_post':
      progress = userStats.community_posts || 0;
      break;

    case 'likes_received':
      progress = userStats.likes_received || 0;
      break;

    case 'discussion_posts':
      progress = userStats.discussion_posts || 0;
      break;

    case 'comments_made':
      progress = userStats.comments_made || 0;
      break;

    case 'prompt_templates':
      progress = userStats.prompt_templates || 0;
      if (min_rating) {
        progress = userStats.high_rated_templates || 0;
      }
      break;

    case 'ai_models_used':
      progress = userStats.ai_models_used || 0;
      break;

    case 'prompts_created':
      progress = userStats.prompts_created || 0;
      break;

    case 'code_lines_generated':
      progress = userStats.code_lines_generated || 0;
      break;

    case 'bugs_debugged':
      progress = userStats.bugs_debugged || 0;
      break;

    case 'assessment_score':
      progress = userStats.highest_assessment_score || 0;
      max_progress = 100;
      break;

    case 'time_spent':
      progress = Math.round((userStats.total_time_spent || 0) / 3600); // Convert seconds to hours
      max_progress = hours || 1;
      break;

    case 'level_reached':
      progress = userStats.level || 0;
      max_progress = level || 1;
      break;

    case 'xp_earned':
      progress = userStats.total_xp || 0;
      max_progress = amount || 1;
      break;

    case 'daily_challenges':
      progress = userStats.daily_challenges_completed || 0;
      break;

    case 'weekend_learning':
      progress = userStats.weekend_lessons || 0;
      max_progress = 1;
      break;

    case 'late_night_learning':
      progress = userStats.late_night_lessons || 0;
      max_progress = 1;
      break;

    case 'early_user':
      progress = userStats.days_since_signup || 0;
      max_progress = 30;
      break;

    case 'beta_participation':
      progress = userStats.beta_features_used || 0;
      max_progress = 1;
      break;

    case 'feedback_provided':
      progress = userStats.feedback_count || 0;
      break;

    case 'bug_reported':
      progress = userStats.bugs_reported || 0;
      max_progress = 1;
      break;

    default:
      progress = 0;
      max_progress = 1;
  }

  const met = progress >= max_progress;
  const progress_percentage = Math.min((progress / max_progress) * 100, 100);

  return {
    met,
    progress: Math.min(progress, max_progress),
    max_progress,
  };
}

// Get all achievements with user progress
export function getAchievementsWithProgress(
  achievements: Achievement[],
  userStats: any,
  userAchievements: string[] = []
): AchievementProgress[] {
  return achievements.map(achievement => {
    const { met, progress, max_progress } = checkAchievementRequirements(achievement.requirements, userStats);
    const earned_at = userAchievements.includes(achievement.id) ? new Date().toISOString() : undefined;

    return {
      achievement_id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      icon: achievement.icon,
      xp_reward: achievement.xp_reward,
      progress,
      max_progress,
      completed: met,
      earned_at,
    };
  });
}

// Get newly earned achievements
export function getNewlyEarnedAchievements(
  oldAchievements: string[],
  newAchievements: string[]
): string[] {
  return newAchievements.filter(id => !oldAchievements.includes(id));
}

// Get achievement progress for dashboard
export function getAchievementProgress(achievements: AchievementProgress[]): {
  total_achievements: number;
  completed_achievements: number;
  completion_percentage: number;
  by_category: Record<string, { total: number; completed: number; percentage: number }>;
  recent_achievements: AchievementProgress[];
  nearly_complete: AchievementProgress[];
} {
  const total_achievements = achievements.length;
  const completed_achievements = achievements.filter(a => a.completed).length;
  const completion_percentage = total_achievements > 0 ? Math.round((completed_achievements / total_achievements) * 100) : 0;

  const by_category = achievements.reduce((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = { total: 0, completed: 0, percentage: 0 };
    }
    acc[category].total++;
    if (achievement.completed) {
      acc[category].completed++;
    }
    acc[category].percentage = Math.round((acc[category].completed / acc[category].total) * 100);
    return acc;
  }, {} as Record<string, { total: number; completed: number; percentage: number }>);

  const recent_achievements = achievements
    .filter(a => a.completed && a.earned_at)
    .sort((a, b) => new Date(b.earned_at!).getTime() - new Date(a.earned_at!).getTime())
    .slice(0, 5);

  const nearly_complete = achievements
    .filter(a => !a.completed && a.progress >= a.max_progress * 0.8)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  return {
    total_achievements,
    completed_achievements,
    completion_percentage,
    by_category,
    recent_achievements,
    nearly_complete,
  };
}

// Get achievement recommendations based on user activity
export function getAchievementRecommendations(
  achievements: Achievement[],
  userStats: any,
  userAchievements: string[] = []
): Achievement[] {
  const availableAchievements = achievements.filter(a => !userAchievements.includes(a.id));
  
  return availableAchievements
    .map(achievement => ({
      achievement,
      progress: checkAchievementRequirements(achievement.requirements, userStats),
    }))
    .filter(({ progress }) => progress.progress > 0)
    .sort((a, b) => b.progress.progress - a.progress.progress)
    .slice(0, 5)
    .map(({ achievement }) => achievement);
}

// Calculate achievement XP bonus
export function calculateAchievementXPBonus(achievements: Achievement[]): number {
  return achievements.reduce((total, achievement) => total + achievement.xp_reward, 0);
}

// Get achievement streak info
export function getAchievementStreakInfo(achievements: AchievementProgress[]): {
  current_streak: number;
  longest_streak: number;
  streak_category: string | null;
} {
  // This would typically come from a separate streak tracking system
  // For now, return mock data
  return {
    current_streak: 0,
    longest_streak: 0,
    streak_category: null,
  };
}

// Validate achievement data
export function validateAchievement(achievement: Partial<Achievement>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!achievement.id) {
    errors.push('Achievement ID is required');
  }

  if (!achievement.title) {
    errors.push('Achievement title is required');
  }

  if (!achievement.description) {
    errors.push('Achievement description is required');
  }

  if (!achievement.category || !ACHIEVEMENT_CATEGORIES[achievement.category as keyof typeof ACHIEVEMENT_CATEGORIES]) {
    errors.push('Valid achievement category is required');
  }

  if (!achievement.icon) {
    errors.push('Achievement icon is required');
  }

  if (achievement.xp_reward === undefined || achievement.xp_reward < 0) {
    errors.push('Valid XP reward is required');
  }

  if (!achievement.requirements) {
    errors.push('Achievement requirements are required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Get achievement rarity (based on completion rate)
export function getAchievementRarity(achievement: Achievement, completionRate: number): {
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  percentage: number;
} {
  const percentage = Math.round(completionRate * 100);

  if (percentage >= 80) return { rarity: 'common', percentage };
  if (percentage >= 60) return { rarity: 'uncommon', percentage };
  if (percentage >= 40) return { rarity: 'rare', percentage };
  if (percentage >= 20) return { rarity: 'epic', percentage };
  return { rarity: 'legendary', percentage };
}

// Get achievement milestones for motivation
export function getAchievementMilestones(completedCount: number): Array<{
  milestone: number;
  achieved: boolean;
  next: boolean;
  description: string;
}> {
  const milestones = [
    { count: 1, description: 'First Achievement' },
    { count: 5, description: 'Achievement Collector' },
    { count: 10, description: 'Achievement Hunter' },
    { count: 25, description: 'Achievement Master' },
    { count: 50, description: 'Achievement Legend' },
    { count: 100, description: 'Achievement God' },
  ];

  return milestones.map((milestone, index) => ({
    milestone: milestone.count,
    achieved: completedCount >= milestone.count,
    next: completedCount < milestone.count && (index === 0 || completedCount >= milestones[index - 1].count),
    description: milestone.description,
  }));
}

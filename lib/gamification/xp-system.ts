// XP System for AI Learning App
// Handles XP calculation, leveling, and progression tracking

import { Database } from '../database/schema';

export interface XPActivity {
  type: 'lesson_completion' | 'module_completion' | 'assessment_passed' | 'community_post' | 'daily_challenge' | 'streak_milestone' | 'achievement_earned';
  points: number;
  metadata?: any;
}

export interface LevelInfo {
  level: number;
  xp_required: number;
  xp_total: number;
  xp_to_next: number;
  progress_percentage: number;
}

// XP point values for different activities
export const XP_VALUES = {
  lesson_completion: 50,
  module_completion: 200,
  assessment_passed: 100,
  community_post: 25,
  daily_challenge: 150,
  streak_milestone: 100,
  achievement_earned: 75,
  first_lesson: 100, // bonus for first lesson
  perfect_score: 50, // bonus for perfect assessment score
  weekend_learning: 25, // bonus for weekend learning
  late_night_learning: 25, // bonus for late night learning
} as const;

// Level progression formula: XP required = level * 100 + (level - 1) * 50
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return (level - 1) * 100 + (level - 2) * 50;
}

// Calculate level from total XP
export function calculateLevelFromXP(totalXP: number): LevelInfo {
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = calculateXPForLevel(2);

  while (totalXP >= xpForNextLevel) {
    level++;
    xpForCurrentLevel = xpForNextLevel;
    xpForNextLevel = calculateXPForLevel(level + 1);
  }

  const xpRequired = xpForNextLevel - xpForCurrentLevel;
  const xpProgress = totalXP - xpForCurrentLevel;
  const progressPercentage = Math.round((xpProgress / xpRequired) * 100);

  return {
    level,
    xp_required: xpRequired,
    xp_total: totalXP,
    xp_to_next: xpRequired - xpProgress,
    progress_percentage: Math.min(progressPercentage, 100),
  };
}

// Calculate XP for a specific activity
export function calculateActivityXP(activity: XPActivity): number {
  let baseXP = XP_VALUES[activity.type] || 0;

  // Apply bonuses based on metadata
  if (activity.metadata) {
    // Perfect score bonus
    if (activity.metadata.perfect_score) {
      baseXP += XP_VALUES.perfect_score;
    }

    // First lesson bonus
    if (activity.metadata.is_first_lesson) {
      baseXP += XP_VALUES.first_lesson;
    }

    // Weekend learning bonus
    if (activity.metadata.is_weekend) {
      baseXP += XP_VALUES.weekend_learning;
    }

    // Late night learning bonus (after 10 PM)
    if (activity.metadata.is_late_night) {
      baseXP += XP_VALUES.late_night_learning;
    }

    // Streak multiplier
    if (activity.metadata.streak_multiplier) {
      baseXP = Math.round(baseXP * activity.metadata.streak_multiplier);
    }

    // Difficulty multiplier
    if (activity.metadata.difficulty_multiplier) {
      baseXP = Math.round(baseXP * activity.metadata.difficulty_multiplier);
    }
  }

  return Math.max(baseXP, 0);
}

// Check if user leveled up
export function checkLevelUp(oldXP: number, newXP: number): { leveledUp: boolean; newLevel?: number; oldLevel?: number } {
  const oldLevel = calculateLevelFromXP(oldXP).level;
  const newLevel = calculateLevelFromXP(newXP).level;

  return {
    leveledUp: newLevel > oldLevel,
    newLevel: newLevel > oldLevel ? newLevel : undefined,
    oldLevel: newLevel > oldLevel ? oldLevel : undefined,
  };
}

// Get level rewards (unlockable content, privileges, etc.)
export function getLevelRewards(level: number): string[] {
  const rewards: string[] = [];

  if (level >= 5) {
    rewards.push('unlock_advanced_modules');
  }
  if (level >= 10) {
    rewards.push('unlock_community_leaderboard');
  }
  if (level >= 15) {
    rewards.push('unlock_custom_achievements');
  }
  if (level >= 20) {
    rewards.push('unlock_beta_features');
  }
  if (level >= 25) {
    rewards.push('unlock_mentor_status');
  }
  if (level >= 30) {
    rewards.push('unlock_content_creation');
  }

  return rewards;
}

// Calculate streak multiplier
export function calculateStreakMultiplier(streakDays: number): number {
  if (streakDays < 3) return 1.0;
  if (streakDays < 7) return 1.1;
  if (streakDays < 14) return 1.2;
  if (streakDays < 30) return 1.3;
  return 1.5; // 50% bonus for 30+ day streaks
}

// Calculate difficulty multiplier
export function calculateDifficultyMultiplier(difficultyLevel: number): number {
  switch (difficultyLevel) {
    case 1: return 1.0;
    case 2: return 1.1;
    case 3: return 1.2;
    case 4: return 1.3;
    case 5: return 1.5;
    default: return 1.0;
  }
}

// Get XP breakdown for user dashboard
export function getXPBreakdown(activities: XPActivity[]): {
  total: number;
  by_category: Record<string, number>;
  recent_activities: XPActivity[];
} {
  const total = activities.reduce((sum, activity) => sum + activity.points, 0);
  
  const by_category = activities.reduce((acc, activity) => {
    const category = activity.type;
    acc[category] = (acc[category] || 0) + activity.points;
    return acc;
  }, {} as Record<string, number>);

  const recent_activities = activities
    .sort((a, b) => (b as any).timestamp - (a as any).timestamp)
    .slice(0, 10);

  return {
    total,
    by_category,
    recent_activities,
  };
}

// Validate XP activity
export function validateXPActivity(activity: XPActivity): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!activity.type || !XP_VALUES[activity.type]) {
    errors.push('Invalid activity type');
  }

  if (activity.points < 0) {
    errors.push('XP points cannot be negative');
  }

  if (activity.points > 1000) {
    errors.push('XP points seem unusually high');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Get XP milestones for motivation
export function getXPMilestones(currentXP: number): Array<{
  milestone: number;
  achieved: boolean;
  progress: number;
  description: string;
}> {
  const milestones = [
    { xp: 100, description: 'First 100 XP' },
    { xp: 500, description: 'Half a thousand' },
    { xp: 1000, description: 'Thousand points' },
    { xp: 2500, description: 'Two and a half thousand' },
    { xp: 5000, description: 'Five thousand club' },
    { xp: 10000, description: 'Ten thousand elite' },
    { xp: 25000, description: 'Twenty-five thousand legend' },
    { xp: 50000, description: 'Fifty thousand master' },
    { xp: 100000, description: 'Hundred thousand grandmaster' },
  ];

  return milestones.map(milestone => ({
    milestone: milestone.xp,
    achieved: currentXP >= milestone.xp,
    progress: Math.min((currentXP / milestone.xp) * 100, 100),
    description: milestone.description,
  }));
}

// Get daily XP goal recommendations
export function getDailyXPGoal(level: number, streakDays: number): number {
  const baseGoal = 200; // Base daily goal
  const levelMultiplier = 1 + (level - 1) * 0.1; // 10% increase per level
  const streakMultiplier = 1 + (streakDays * 0.05); // 5% increase per streak day

  return Math.round(baseGoal * levelMultiplier * streakMultiplier);
}

// Check if daily XP goal is met
export function checkDailyXPGoal(dailyXP: number, goal: number): {
  met: boolean;
  progress: number;
  remaining: number;
} {
  const progress = Math.min((dailyXP / goal) * 100, 100);
  const remaining = Math.max(goal - dailyXP, 0);

  return {
    met: dailyXP >= goal,
    progress: Math.round(progress),
    remaining,
  };
}

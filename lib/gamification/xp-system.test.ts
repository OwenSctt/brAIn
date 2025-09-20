import {
  calculateXPForLevel,
  calculateLevelFromXP,
  calculateActivityXP,
  checkLevelUp,
  getLevelRewards,
  calculateStreakMultiplier,
  calculateDifficultyMultiplier,
  getXPBreakdown,
  validateXPActivity,
  getXPMilestones,
  getDailyXPGoal,
  checkDailyXPGoal,
} from './xp-system';

describe('XP System', () => {
  describe('calculateXPForLevel', () => {
    it('should return 0 for level 1', () => {
      expect(calculateXPForLevel(1)).toBe(0);
    });

    it('should calculate correct XP for level 2', () => {
      expect(calculateXPForLevel(2)).toBe(100);
    });

    it('should calculate correct XP for level 5', () => {
      expect(calculateXPForLevel(5)).toBe(550);
    });

    it('should calculate correct XP for level 10', () => {
      expect(calculateXPForLevel(10)).toBe(1300);
    });
  });

  describe('calculateLevelFromXP', () => {
    it('should return level 1 for 0 XP', () => {
      const result = calculateLevelFromXP(0);
      expect(result.level).toBe(1);
      expect(result.xp_total).toBe(0);
    });

    it('should return correct level for 500 XP', () => {
      const result = calculateLevelFromXP(500);
      expect(result.level).toBe(4);
      expect(result.xp_total).toBe(500);
    });

    it('should calculate progress correctly', () => {
      const result = calculateLevelFromXP(150);
      expect(result.level).toBe(2);
      expect(result.progress_percentage).toBeGreaterThan(0);
      expect(result.progress_percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateActivityXP', () => {
    it('should calculate base XP for lesson completion', () => {
      const activity = {
        type: 'lesson_completion' as const,
        points: 50,
      };
      expect(calculateActivityXP(activity)).toBe(50);
    });

    it('should apply perfect score bonus', () => {
      const activity = {
        type: 'lesson_completion' as const,
        points: 50,
        metadata: {
          perfect_score: true,
        },
      };
      expect(calculateActivityXP(activity)).toBe(100);
    });

    it('should apply weekend bonus', () => {
      const activity = {
        type: 'lesson_completion' as const,
        points: 50,
        metadata: {
          is_weekend: true,
        },
      };
      expect(calculateActivityXP(activity)).toBe(75);
    });

    it('should apply streak multiplier', () => {
      const activity = {
        type: 'lesson_completion' as const,
        points: 50,
        metadata: {
          streak_multiplier: 1.2,
        },
      };
      expect(calculateActivityXP(activity)).toBe(60);
    });

    it('should return 0 for negative points', () => {
      const activity = {
        type: 'lesson_completion' as const,
        points: -10,
      };
      expect(calculateActivityXP(activity)).toBe(50);
    });
  });

  describe('checkLevelUp', () => {
    it('should detect level up', () => {
      const result = checkLevelUp(100, 200);
      expect(result.leveledUp).toBe(false);
      expect(result.newLevel).toBeUndefined();
      expect(result.oldLevel).toBeUndefined();
    });

    it('should not detect level up when XP decreases', () => {
      const result = checkLevelUp(200, 100);
      expect(result.leveledUp).toBe(false);
    });

    it('should not detect level up when XP stays same', () => {
      const result = checkLevelUp(100, 100);
      expect(result.leveledUp).toBe(false);
    });
  });

  describe('getLevelRewards', () => {
    it('should return empty array for level 1', () => {
      expect(getLevelRewards(1)).toEqual([]);
    });

    it('should return rewards for level 5', () => {
      const rewards = getLevelRewards(5);
      expect(rewards).toContain('unlock_advanced_modules');
    });

    it('should return rewards for level 10', () => {
      const rewards = getLevelRewards(10);
      expect(rewards).toContain('unlock_community_leaderboard');
    });

    it('should return rewards for level 20', () => {
      const rewards = getLevelRewards(20);
      expect(rewards).toContain('unlock_beta_features');
    });
  });

  describe('calculateStreakMultiplier', () => {
    it('should return 1.0 for short streaks', () => {
      expect(calculateStreakMultiplier(1)).toBe(1.0);
      expect(calculateStreakMultiplier(2)).toBe(1.0);
    });

    it('should return 1.1 for 3-6 day streaks', () => {
      expect(calculateStreakMultiplier(3)).toBe(1.1);
      expect(calculateStreakMultiplier(6)).toBe(1.1);
    });

    it('should return 1.5 for 30+ day streaks', () => {
      expect(calculateStreakMultiplier(30)).toBe(1.5);
      expect(calculateStreakMultiplier(100)).toBe(1.5);
    });
  });

  describe('calculateDifficultyMultiplier', () => {
    it('should return 1.0 for difficulty 1', () => {
      expect(calculateDifficultyMultiplier(1)).toBe(1.0);
    });

    it('should return 1.5 for difficulty 5', () => {
      expect(calculateDifficultyMultiplier(5)).toBe(1.5);
    });

    it('should return 1.0 for invalid difficulty', () => {
      expect(calculateDifficultyMultiplier(0)).toBe(1.0);
      expect(calculateDifficultyMultiplier(10)).toBe(1.0);
    });
  });

  describe('getXPBreakdown', () => {
    it('should calculate total XP correctly', () => {
      const activities = [
        { type: 'lesson_completion', points: 50, timestamp: Date.now() },
        { type: 'module_completion', points: 200, timestamp: Date.now() },
      ];
      const breakdown = getXPBreakdown(activities);
      expect(breakdown.total).toBe(250);
    });

    it('should group by category correctly', () => {
      const activities = [
        { type: 'lesson_completion', points: 50, timestamp: Date.now() },
        { type: 'lesson_completion', points: 50, timestamp: Date.now() },
        { type: 'module_completion', points: 200, timestamp: Date.now() },
      ];
      const breakdown = getXPBreakdown(activities);
      expect(breakdown.by_category.lesson_completion).toBe(100);
      expect(breakdown.by_category.module_completion).toBe(200);
    });
  });

  describe('validateXPActivity', () => {
    it('should validate correct activity', () => {
      const activity = {
        type: 'lesson_completion' as const,
        points: 50,
      };
      const result = validateXPActivity(activity);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid activity type', () => {
      const activity = {
        type: 'invalid_type' as any,
        points: 50,
      };
      const result = validateXPActivity(activity);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid activity type');
    });

    it('should reject negative points', () => {
      const activity = {
        type: 'lesson_completion' as const,
        points: -10,
      };
      const result = validateXPActivity(activity);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('XP points cannot be negative');
    });

    it('should warn about unusually high points', () => {
      const activity = {
        type: 'lesson_completion' as const,
        points: 2000,
      };
      const result = validateXPActivity(activity);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('XP points seem unusually high');
    });
  });

  describe('getXPMilestones', () => {
    it('should return milestones for current XP', () => {
      const milestones = getXPMilestones(2500);
      expect(milestones).toHaveLength(9);
      expect(milestones[0].achieved).toBe(true);
      expect(milestones[1].achieved).toBe(true);
    });

    it('should calculate progress correctly', () => {
      const milestones = getXPMilestones(500);
      const firstUnachieved = milestones.find(m => !m.achieved);
      expect(firstUnachieved?.progress).toBeGreaterThan(0);
      expect(firstUnachieved?.progress).toBeLessThanOrEqual(100);
    });
  });

  describe('getDailyXPGoal', () => {
    it('should return base goal for level 1', () => {
      const goal = getDailyXPGoal(1, 0);
      expect(goal).toBe(200);
    });

    it('should increase with level', () => {
      const goal1 = getDailyXPGoal(1, 0);
      const goal10 = getDailyXPGoal(10, 0);
      expect(goal10).toBeGreaterThan(goal1);
    });

    it('should increase with streak', () => {
      const goalNoStreak = getDailyXPGoal(5, 0);
      const goalWithStreak = getDailyXPGoal(5, 10);
      expect(goalWithStreak).toBeGreaterThan(goalNoStreak);
    });
  });

  describe('checkDailyXPGoal', () => {
    it('should detect when goal is met', () => {
      const result = checkDailyXPGoal(200, 200);
      expect(result.met).toBe(true);
      expect(result.progress).toBe(100);
      expect(result.remaining).toBe(0);
    });

    it('should calculate progress correctly', () => {
      const result = checkDailyXPGoal(100, 200);
      expect(result.met).toBe(false);
      expect(result.progress).toBe(50);
      expect(result.remaining).toBe(100);
    });

    it('should handle over-achievement', () => {
      const result = checkDailyXPGoal(300, 200);
      expect(result.met).toBe(true);
      expect(result.progress).toBe(100);
      expect(result.remaining).toBe(0);
    });
  });
});

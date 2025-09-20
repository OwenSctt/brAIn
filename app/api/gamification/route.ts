import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateLevelFromXP, calculateActivityXP } from '@/lib/gamification/xp-system';
import { checkAchievementRequirements, getAchievementsWithProgress } from '@/lib/gamification/achievements';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type') as 'xp' | 'streak' | 'modules_completed' | 'community_contributions' || 'xp';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user streaks
    const { data: streaks, error: streaksError } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId);

    if (streaksError) {
      console.error('Error fetching user streaks:', streaksError);
    }

    // Get user achievements
    const { data: userAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (achievementsError) {
      console.error('Error fetching user achievements:', achievementsError);
    }

    // Get all achievements
    const { data: allAchievements, error: allAchievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true);

    if (allAchievementsError) {
      console.error('Error fetching all achievements:', allAchievementsError);
    }

    // Calculate level info
    const levelInfo = calculateLevelFromXP(profile.xp);

    // Get user stats for achievement checking
    const userStats = {
      level: levelInfo.level,
      total_xp: profile.xp,
      lessons_completed: 0, // This would come from module_progress table
      modules_completed: 0, // This would come from module_progress table
      community_posts: 0, // This would come from community_posts table
      likes_received: 0, // This would come from post_likes table
      streak_days: streaks?.[0]?.current_streak || 0,
    };

    // Get achievement progress
    const achievementProgress = allAchievements ? 
      getAchievementsWithProgress(
        allAchievements,
        userStats,
        userAchievements?.map(ua => ua.achievement_id) || []
      ) : [];

    // Get leaderboard data
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboards')
      .select(`
        *,
        profiles!leaderboards_user_id_fkey (
          display_name,
          avatar_url
        )
      `)
      .eq('leaderboard_type', type)
      .eq('period', 'all_time')
      .order('score', { ascending: false })
      .limit(100);

    if (leaderboardError) {
      console.error('Error fetching leaderboard:', leaderboardError);
    }

    return NextResponse.json({
      data: {
        user: {
          id: profile.id,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          level: levelInfo.level,
          xp: profile.xp,
          level_info: levelInfo,
          streaks: streaks || [],
          achievements: achievementProgress,
          earned_achievements: userAchievements?.map(ua => ua.achievement_id) || [],
        },
        leaderboard: leaderboard || [],
      },
    });
  } catch (error) {
    console.error('Error in gamification API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    
    const {
      user_id,
      activity_type,
      points,
      metadata = {},
    } = body;

    if (!user_id || !activity_type || !points) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate new XP
    const newXP = profile.xp + points;
    const oldLevelInfo = calculateLevelFromXP(profile.xp);
    const newLevelInfo = calculateLevelFromXP(newXP);

    // Update user profile with new XP and level
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        xp: newXP,
        level: newLevelInfo.level,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user_id);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }

    // Update streaks
    await updateUserStreaks(user_id, activity_type, supabase);

    // Check for new achievements
    const newAchievements = await checkAndAwardAchievements(user_id, newLevelInfo, supabase);

    // Update leaderboards
    await updateLeaderboards(user_id, newXP, activity_type, supabase);

    return NextResponse.json({
      data: {
        level_info: newLevelInfo,
        leveled_up: newLevelInfo.level > oldLevelInfo.level,
        new_achievements: newAchievements,
        points_awarded: points,
      },
    });
  } catch (error) {
    console.error('Error in gamification POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update user streaks
async function updateUserStreaks(userId: string, activityType: string, supabase: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // Update daily learning streak
  if (activityType === 'lesson_completion' || activityType === 'module_completion') {
    const { data: existingStreak } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .eq('streak_type', 'daily_learning')
      .single();

    if (existingStreak) {
      const lastActivity = existingStreak.last_activity_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivity === today) {
        // Already updated today, do nothing
        return;
      } else if (lastActivity === yesterdayStr) {
        // Continue streak
        await supabase
          .from('user_streaks')
          .update({
            current_streak: existingStreak.current_streak + 1,
            longest_streak: Math.max(existingStreak.current_streak + 1, existingStreak.longest_streak),
            last_activity_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingStreak.id);
      } else {
        // Reset streak
        await supabase
          .from('user_streaks')
          .update({
            current_streak: 1,
            last_activity_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingStreak.id);
      }
    } else {
      // Create new streak
      await supabase
        .from('user_streaks')
        .insert({
          user_id: userId,
          streak_type: 'daily_learning',
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today,
        });
    }
  }
}

// Helper function to check and award achievements
async function checkAndAwardAchievements(userId: string, levelInfo: any, supabase: any) {
  // Get all achievements
  const { data: achievements, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_active', true);

  if (error || !achievements) return [];

  // Get user's current achievements
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', userId);

  const earnedAchievementIds = userAchievements?.map(ua => ua.achievement_id) || [];

  // Get user stats
  const userStats = {
    level: levelInfo.level,
    total_xp: levelInfo.xp_total,
    // Add other stats as needed
  };

  const newAchievements = [];

  // Check each achievement
  for (const achievement of achievements) {
    if (earnedAchievementIds.includes(achievement.id)) continue;

    const { met } = checkAchievementRequirements(achievement.requirements, userStats);
    
    if (met) {
      // Award achievement
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
        });

      // Award XP for achievement
      await supabase
        .from('profiles')
        .update({
          xp: levelInfo.xp_total + achievement.xp_reward,
        })
        .eq('id', userId);

      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

// Helper function to update leaderboards
async function updateLeaderboards(userId: string, xp: number, activityType: string, supabase: any) {
  const periods = ['daily', 'weekly', 'monthly', 'all_time'];
  
  for (const period of periods) {
    // Update XP leaderboard
    await supabase
      .from('leaderboards')
      .upsert({
        user_id: userId,
        leaderboard_type: 'xp',
        score: xp,
        period: period,
        calculated_at: new Date().toISOString(),
      });

    // Update other leaderboard types as needed
    if (activityType === 'module_completion') {
      // Update modules completed leaderboard
      const { data: moduleCount } = await supabase
        .from('module_progress')
        .select('module_id')
        .eq('user_id', userId)
        .eq('completion_status', 'completed');

      if (moduleCount) {
        await supabase
          .from('leaderboards')
          .upsert({
            user_id: userId,
            leaderboard_type: 'modules_completed',
            score: moduleCount.length,
            period: period,
            calculated_at: new Date().toISOString(),
          });
      }
    }
  }
}

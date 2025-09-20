'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  TrendingUp, 
  Target, 
  Zap, 
  Award,
  Calendar,
  Clock,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { LevelInfo } from '@/lib/gamification/xp-system';

interface XPDisplayProps {
  levelInfo: LevelInfo;
  dailyXP: number;
  dailyGoal: number;
  streakDays: number;
  recentActivities: Array<{
    type: string;
    points: number;
    timestamp: Date;
    description: string;
  }>;
  xpMilestones: Array<{
    milestone: number;
    achieved: boolean;
    progress: number;
    description: string;
  }>;
  className?: string;
}

export default function XPDisplay({
  levelInfo,
  dailyXP,
  dailyGoal,
  streakDays,
  recentActivities,
  xpMilestones,
  className = '',
}: XPDisplayProps) {
  const dailyProgress = Math.min((dailyXP / dailyGoal) * 100, 100);
  const nextMilestone = xpMilestones.find(m => !m.achieved);
  const achievedMilestones = xpMilestones.filter(m => m.achieved);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main XP Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Level {levelInfo.level}</h3>
                <p className="text-sm text-muted-foreground">
                  {levelInfo.xp_total.toLocaleString()} XP
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {levelInfo.xp_to_next} XP to next level
            </Badge>
          </div>

          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level Progress</span>
              <span>{levelInfo.progress_percentage}%</span>
            </div>
            <Progress value={levelInfo.progress_percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Daily Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="font-medium">Daily Goal</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {dailyXP} / {dailyGoal}
              </span>
              <Badge 
                variant={dailyXP >= dailyGoal ? "default" : "secondary"}
                className="text-xs"
              >
                {dailyXP >= dailyGoal ? "Complete!" : "In Progress"}
              </Badge>
            </div>
          </div>
          <Progress value={dailyProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Streak Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Learning Streak</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-orange-600">
                {streakDays}
              </span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </div>
          {streakDays > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              Keep it up! You're on fire! 🔥
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      {recentActivities.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Recent Activities</span>
            </div>
            <div className="space-y-2">
              {recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{activity.description}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-medium">+{activity.points}</span>
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* XP Milestones */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Trophy className="w-4 h-4" />
            <span className="font-medium">XP Milestones</span>
          </div>
          <div className="space-y-2">
            {xpMilestones.slice(0, 5).map((milestone, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    milestone.achieved ? 'bg-green-500' : 'bg-muted'
                  }`} />
                  <span className="text-sm">{milestone.description}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {milestone.milestone.toLocaleString()} XP
                  </span>
                  {milestone.achieved ? (
                    <Award className="w-4 h-4 text-green-600" />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {milestone.progress}%
                    </span>
                  )}
                </div>
              </div>
            ))}
            {nextMilestone && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next: {nextMilestone.description}</span>
                  <span className="font-medium">{nextMilestone.progress}%</span>
                </div>
                <Progress value={nextMilestone.progress} className="h-1 mt-1" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Level Rewards Preview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Award className="w-4 h-4" />
            <span className="font-medium">Level Rewards</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {levelInfo.level >= 5 && (
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Advanced modules unlocked</span>
              </div>
            )}
            {levelInfo.level >= 10 && (
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Community leaderboard access</span>
              </div>
            )}
            {levelInfo.level >= 15 && (
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Custom achievements</span>
              </div>
            )}
            {levelInfo.level < 5 && (
              <div className="text-xs">
                Reach level 5 to unlock advanced features!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Compact XP Display for headers/sidebars
export function CompactXPDisplay({ levelInfo, dailyXP, dailyGoal }: {
  levelInfo: LevelInfo;
  dailyXP: number;
  dailyGoal: number;
}) {
  const dailyProgress = Math.min((dailyXP / dailyGoal) * 100, 100);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Star className="w-4 h-4 text-primary" />
        <span className="font-medium">L{levelInfo.level}</span>
        <span className="text-sm text-muted-foreground">
          {levelInfo.xp_total.toLocaleString()} XP
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Target className="w-4 h-4 text-green-600" />
        <div className="w-16">
          <Progress value={dailyProgress} className="h-1" />
        </div>
        <span className="text-xs text-muted-foreground">
          {dailyXP}/{dailyGoal}
        </span>
      </div>
    </div>
  );
}

// XP Activity Feed Component
export function XPActivityFeed({ activities }: {
  activities: Array<{
    type: string;
    points: number;
    timestamp: Date;
    description: string;
  }>;
}) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson_completion': return <BookOpen className="w-4 h-4" />;
      case 'module_completion': return <Award className="w-4 h-4" />;
      case 'assessment_passed': return <Target className="w-4 h-4" />;
      case 'community_post': return <MessageSquare className="w-4 h-4" />;
      case 'daily_challenge': return <Calendar className="w-4 h-4" />;
      case 'streak_milestone': return <Zap className="w-4 h-4" />;
      case 'achievement_earned': return <Trophy className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'lesson_completion': return 'text-blue-600';
      case 'module_completion': return 'text-green-600';
      case 'assessment_passed': return 'text-purple-600';
      case 'community_post': return 'text-orange-600';
      case 'daily_challenge': return 'text-pink-600';
      case 'streak_milestone': return 'text-yellow-600';
      case 'achievement_earned': return 'text-gold-600';
      default: return 'text-primary';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium flex items-center space-x-2">
        <TrendingUp className="w-4 h-4" />
        <span>Recent XP Activity</span>
      </h3>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
            <div className={`${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {activity.timestamp.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-green-600">
                +{activity.points}
              </span>
              <Star className="w-3 h-3 text-yellow-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { XPDisplay };

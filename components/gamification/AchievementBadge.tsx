'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Zap, 
  Target, 
  BookOpen, 
  Users, 
  Code, 
  Calendar,
  CheckCircle,
  Lock,
  Sparkles
} from 'lucide-react';
import { Achievement, AchievementProgress } from '@/lib/gamification/achievements';

interface AchievementBadgeProps {
  achievement: Achievement | AchievementProgress;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  earned?: boolean;
  className?: string;
}

const ACHIEVEMENT_ICONS = {
  learning: BookOpen,
  community: Users,
  technical: Code,
  milestone: Trophy,
  default: Star,
} as const;

const ACHIEVEMENT_COLORS = {
  learning: 'text-blue-600 bg-blue-100',
  community: 'text-green-600 bg-green-100',
  technical: 'text-purple-600 bg-purple-100',
  milestone: 'text-yellow-600 bg-yellow-100',
  default: 'text-gray-600 bg-gray-100',
} as const;

const RARITY_COLORS = {
  common: 'border-gray-300',
  uncommon: 'border-green-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-yellow-400',
} as const;

const RARITY_GLOWS = {
  common: '',
  uncommon: 'shadow-green-200',
  rare: 'shadow-blue-200',
  epic: 'shadow-purple-200',
  legendary: 'shadow-yellow-200',
} as const;

export default function AchievementBadge({
  achievement,
  size = 'md',
  showProgress = false,
  earned = false,
  className = '',
}: AchievementBadgeProps) {
  const IconComponent = ACHIEVEMENT_ICONS[achievement.category as keyof typeof ACHIEVEMENT_ICONS] || ACHIEVEMENT_ICONS.default;
  const colorClass = ACHIEVEMENT_COLORS[achievement.category as keyof typeof ACHIEVEMENT_COLORS] || ACHIEVEMENT_COLORS.default;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const progress = 'progress' in achievement ? achievement.progress : 0;
  const maxProgress = 'max_progress' in achievement ? achievement.max_progress : 1;
  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;
  const isCompleted = earned || ('completed' in achievement ? achievement.completed : false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative ${className}`}>
            <Card className={`
              ${sizeClasses[size]} 
              ${colorClass} 
              ${isCompleted ? 'opacity-100' : 'opacity-60'} 
              ${isCompleted ? 'ring-2 ring-primary/20' : ''}
              transition-all duration-200 hover:scale-105 cursor-pointer
              ${RARITY_GLOWS[achievement.category as keyof typeof RARITY_GLOWS] || ''}
            `}>
              <CardContent className="p-0 h-full flex items-center justify-center">
                <div className="relative">
                  <IconComponent className={iconSizes[size]} />
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                  )}
                  {!isCompleted && (
                    <div className="absolute -top-1 -right-1">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress Ring */}
            {showProgress && !isCompleted && progress > 0 && (
              <div className="absolute inset-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted-foreground/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                    className="text-primary transition-all duration-300"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}

            {/* XP Reward Badge */}
            {achievement.xp_reward > 0 && (
              <div className="absolute -bottom-1 -right-1">
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  +{achievement.xp_reward}
                </Badge>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <IconComponent className="w-4 h-4" />
              <span className="font-semibold">{achievement.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            {showProgress && !isCompleted && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{progress}/{maxProgress}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <Badge variant="outline" className="text-xs">
                {achievement.category}
              </Badge>
              <span className="text-muted-foreground">
                +{achievement.xp_reward} XP
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Achievement Grid Component
export function AchievementGrid({ 
  achievements, 
  showProgress = false,
  earnedAchievements = [],
  className = ''
}: {
  achievements: Achievement[];
  showProgress?: boolean;
  earnedAchievements?: string[];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className}`}>
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          showProgress={showProgress}
          earned={earnedAchievements.includes(achievement.id)}
        />
      ))}
    </div>
  );
}

// Achievement Progress List Component
export function AchievementProgressList({ 
  achievements, 
  className = ''
}: {
  achievements: AchievementProgress[];
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {achievements.map((achievement) => (
        <Card key={achievement.achievement_id} className="p-4">
          <div className="flex items-center space-x-4">
            <AchievementBadge
              achievement={achievement}
              size="md"
              showProgress={!achievement.completed}
              earned={achievement.completed}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{achievement.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {achievement.description}
              </p>
              {!achievement.completed && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.max_progress}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(achievement.progress / achievement.max_progress) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">
                +{achievement.xp_reward} XP
              </div>
              {achievement.completed && achievement.earned_at && (
                <div className="text-xs text-muted-foreground">
                  {new Date(achievement.earned_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Recent Achievements Component
export function RecentAchievements({ 
  achievements, 
  limit = 5,
  className = ''
}: {
  achievements: Achievement[];
  limit?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-medium flex items-center space-x-2">
        <Sparkles className="w-4 h-4" />
        <span>Recent Achievements</span>
      </h3>
      <div className="space-y-2">
        {achievements.slice(0, limit).map((achievement) => (
          <div key={achievement.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
            <AchievementBadge
              achievement={achievement}
              size="sm"
              earned={true}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{achievement.title}</p>
              <p className="text-xs text-muted-foreground">
                +{achievement.xp_reward} XP
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Achievement Category Filter
export function AchievementCategoryFilter({ 
  selectedCategory, 
  onCategoryChange,
  className = ''
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}) {
  const categories = [
    { id: 'all', name: 'All', icon: Star },
    { id: 'learning', name: 'Learning', icon: BookOpen },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'technical', name: 'Technical', icon: Code },
    { id: 'milestone', name: 'Milestone', icon: Trophy },
  ];

  return (
    <div className={`flex space-x-2 ${className}`}>
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="flex items-center space-x-2"
          >
            <IconComponent className="w-4 h-4" />
            <span>{category.name}</span>
          </Button>
        );
      })}
    </div>
  );
}

export { AchievementBadge };

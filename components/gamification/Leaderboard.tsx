'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar,
  Zap,
  BookOpen,
  MessageSquare,
  Code
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  rank: number;
  display_name: string;
  avatar_url?: string;
  score: number;
  level: number;
  xp: number;
  streak_days?: number;
  modules_completed?: number;
  community_contributions?: number;
  is_current_user?: boolean;
  change?: 'up' | 'down' | 'same' | 'new';
  previous_rank?: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  selectedPeriod: 'daily' | 'weekly' | 'monthly' | 'all_time';
  selectedType: 'xp' | 'streak' | 'modules_completed' | 'community_contributions';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly' | 'all_time') => void;
  onTypeChange: (type: 'xp' | 'streak' | 'modules_completed' | 'community_contributions') => void;
  className?: string;
}

const LEADERBOARD_TYPES = {
  xp: {
    name: 'XP',
    icon: Star,
    description: 'Total experience points earned',
    color: 'text-yellow-600',
  },
  streak: {
    name: 'Streak',
    icon: Zap,
    description: 'Current learning streak',
    color: 'text-orange-600',
  },
  modules_completed: {
    name: 'Modules',
    icon: BookOpen,
    description: 'Modules completed',
    color: 'text-blue-600',
  },
  community_contributions: {
    name: 'Community',
    icon: MessageSquare,
    description: 'Community contributions',
    color: 'text-green-600',
  },
} as const;

const PERIOD_LABELS = {
  daily: 'Today',
  weekly: 'This Week',
  monthly: 'This Month',
  all_time: 'All Time',
} as const;

const RANK_ICONS = {
  1: Crown,
  2: Medal,
  3: Trophy,
} as const;

const RANK_COLORS = {
  1: 'text-yellow-600 bg-yellow-100',
  2: 'text-gray-600 bg-gray-100',
  3: 'text-orange-600 bg-orange-100',
} as const;

export default function Leaderboard({
  entries,
  currentUserId,
  selectedPeriod,
  selectedType,
  onPeriodChange,
  onTypeChange,
  className = '',
}: LeaderboardProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const currentType = LEADERBOARD_TYPES[selectedType];
  const currentUserEntry = entries.find(entry => entry.is_current_user);
  const topEntries = entries.slice(0, 10);
  const currentUserRank = currentUserEntry?.rank || 0;

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      const IconComponent = RANK_ICONS[rank as keyof typeof RANK_ICONS];
      return <IconComponent className="w-5 h-5" />;
    }
    return <span className="text-lg font-bold">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank <= 3) {
      return RANK_COLORS[rank as keyof typeof RANK_COLORS];
    }
    return 'text-muted-foreground bg-muted';
  };

  const getScoreDisplay = (entry: LeaderboardEntry) => {
    switch (selectedType) {
      case 'xp':
        return `${entry.score.toLocaleString()} XP`;
      case 'streak':
        return `${entry.streak_days || 0} days`;
      case 'modules_completed':
        return `${entry.modules_completed || 0} modules`;
      case 'community_contributions':
        return `${entry.community_contributions || 0} contributions`;
      default:
        return entry.score.toLocaleString();
    }
  };

  const getChangeIcon = (change?: string) => {
    switch (change) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />;
      case 'new':
        return <Star className="w-3 h-3 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <p className="text-muted-foreground">{currentType.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LEADERBOARD_TYPES).map(([key, type]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center space-x-2">
                    <type.icon className="w-4 h-4" />
                    <span>{type.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current User Status */}
      {currentUserEntry && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getRankColor(currentUserEntry.rank)}`}>
                  {getRankIcon(currentUserEntry.rank)}
                </div>
                <div>
                  <p className="font-medium">Your Rank: #{currentUserEntry.rank}</p>
                  <p className="text-sm text-muted-foreground">
                    {getScoreDisplay(currentUserEntry)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Level {currentUserEntry.level}</p>
                <p className="text-sm text-muted-foreground">
                  {currentUserEntry.xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Content */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'grid')}>
        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {topEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 ${
                      index !== topEntries.length - 1 ? 'border-b' : ''
                    } ${entry.is_current_user ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getRankColor(entry.rank)}`}>
                        {getRankIcon(entry.rank)}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={entry.avatar_url} />
                        <AvatarFallback>
                          {entry.display_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{entry.display_name}</p>
                          {entry.is_current_user && (
                            <Badge variant="secondary">You</Badge>
                          )}
                          {getChangeIcon(entry.change)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Level {entry.level} • {entry.xp.toLocaleString()} XP
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${currentType.color}`}>
                        {getScoreDisplay(entry)}
                      </p>
                      {entry.streak_days && selectedType !== 'streak' && (
                        <p className="text-xs text-muted-foreground">
                          {entry.streak_days} day streak
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topEntries.map((entry) => (
              <Card key={entry.id} className={entry.is_current_user ? 'border-primary/20 bg-primary/5' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-full ${getRankColor(entry.rank)}`}>
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={entry.avatar_url} />
                      <AvatarFallback>
                        {entry.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{entry.display_name}</p>
                      {entry.is_current_user && (
                        <Badge variant="secondary" className="text-xs">You</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <span className={`font-bold ${currentType.color}`}>
                        {getScoreDisplay(entry)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Level</span>
                      <span className="font-medium">{entry.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">XP</span>
                      <span className="font-medium">{entry.xp.toLocaleString()}</span>
                    </div>
                    {entry.streak_days && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Streak</span>
                        <span className="font-medium">{entry.streak_days} days</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leaderboard Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{entries.length}</p>
              <p className="text-sm text-muted-foreground">Total Participants</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {entries.length > 0 ? entries[0].score.toLocaleString() : 0}
              </p>
              <p className="text-sm text-muted-foreground">Highest Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {Math.round(entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length) || 0}
              </p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {entries.filter(entry => entry.streak_days && entry.streak_days > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Active Streaks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Compact Leaderboard for sidebars
export function CompactLeaderboard({ 
  entries, 
  selectedType,
  limit = 5,
  className = ''
}: {
  entries: LeaderboardEntry[];
  selectedType: 'xp' | 'streak' | 'modules_completed' | 'community_contributions';
  limit?: number;
  className?: string;
}) {
  const currentType = LEADERBOARD_TYPES[selectedType];
  const topEntries = entries.slice(0, limit);

  const getScoreDisplay = (entry: LeaderboardEntry) => {
    switch (selectedType) {
      case 'xp':
        return `${entry.score.toLocaleString()} XP`;
      case 'streak':
        return `${entry.streak_days || 0} days`;
      case 'modules_completed':
        return `${entry.modules_completed || 0} modules`;
      case 'community_contributions':
        return `${entry.community_contributions || 0} contributions`;
      default:
        return entry.score.toLocaleString();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center space-x-2">
          <currentType.icon className="w-4 h-4" />
          <span>Top {currentType.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topEntries.map((entry, index) => (
            <div key={entry.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-6 text-center">
                <span className="text-sm font-medium">#{entry.rank}</span>
              </div>
              <Avatar className="w-6 h-6">
                <AvatarImage src={entry.avatar_url} />
                <AvatarFallback className="text-xs">
                  {entry.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.display_name}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${currentType.color}`}>
                  {getScoreDisplay(entry)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { Leaderboard };

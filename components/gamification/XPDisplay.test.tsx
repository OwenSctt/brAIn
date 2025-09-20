import React from 'react';
import { render, screen } from '@testing-library/react';
import XPDisplay from './XPDisplay';

const mockLevelInfo = {
  level: 5,
  xp_required: 1000,
  xp_total: 2500,
  xp_to_next: 500,
  progress_percentage: 50,
};

const mockRecentActivities = [
  {
    type: 'lesson_completion',
    points: 50,
    timestamp: new Date(),
    description: 'Completed lesson',
  },
  {
    type: 'module_completion',
    points: 200,
    timestamp: new Date(),
    description: 'Completed module',
  },
];

const mockXPMilestones = [
  {
    milestone: 1000,
    achieved: true,
    progress: 100,
    description: 'First 1000 XP',
  },
  {
    milestone: 5000,
    achieved: false,
    progress: 50,
    description: 'Five thousand club',
  },
];

describe('XPDisplay', () => {
  it('renders level information correctly', () => {
    render(
      <XPDisplay
        levelInfo={mockLevelInfo}
        dailyXP={100}
        dailyGoal={200}
        streakDays={5}
        recentActivities={mockRecentActivities}
        xpMilestones={mockXPMilestones}
      />
    );

    expect(screen.getByText('Level 5')).toBeInTheDocument();
    expect(screen.getByText('2,500 XP')).toBeInTheDocument();
    expect(screen.getByText('500 XP to next level')).toBeInTheDocument();
  });

  it('renders daily progress correctly', () => {
    render(
      <XPDisplay
        levelInfo={mockLevelInfo}
        dailyXP={100}
        dailyGoal={200}
        streakDays={5}
        recentActivities={mockRecentActivities}
        xpMilestones={mockXPMilestones}
      />
    );

    expect(screen.getByText('100 / 200')).toBeInTheDocument();
    expect(screen.getByText('Daily Goal')).toBeInTheDocument();
  });

  it('renders streak information correctly', () => {
    render(
      <XPDisplay
        levelInfo={mockLevelInfo}
        dailyXP={100}
        dailyGoal={200}
        streakDays={5}
        recentActivities={mockRecentActivities}
        xpMilestones={mockXPMilestones}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('days')).toBeInTheDocument();
    expect(screen.getByText('Learning Streak')).toBeInTheDocument();
  });

  it('renders recent activities', () => {
    render(
      <XPDisplay
        levelInfo={mockLevelInfo}
        dailyXP={100}
        dailyGoal={200}
        streakDays={5}
        recentActivities={mockRecentActivities}
        xpMilestones={mockXPMilestones}
      />
    );

    expect(screen.getByText('Recent Activities')).toBeInTheDocument();
    expect(screen.getByText('Completed lesson')).toBeInTheDocument();
    expect(screen.getByText('Completed module')).toBeInTheDocument();
  });

  it('renders XP milestones', () => {
    render(
      <XPDisplay
        levelInfo={mockLevelInfo}
        dailyXP={100}
        dailyGoal={200}
        streakDays={5}
        recentActivities={mockRecentActivities}
        xpMilestones={mockXPMilestones}
      />
    );

    expect(screen.getByText('XP Milestones')).toBeInTheDocument();
    expect(screen.getByText('First 1000 XP')).toBeInTheDocument();
    expect(screen.getByText('Five thousand club')).toBeInTheDocument();
  });
});

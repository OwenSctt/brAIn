-- Seed data for achievement system
-- This script populates the database with initial achievements and badges

-- Note: This assumes there's an achievements table or we need to create one
-- Let's create the achievements table first if it doesn't exist
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('learning', 'community', 'technical', 'milestone')),
  icon TEXT NOT NULL, -- icon name or URL
  xp_reward INTEGER NOT NULL DEFAULT 0,
  requirements JSONB NOT NULL, -- criteria for earning the achievement
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert learning achievements
INSERT INTO public.achievements (id, title, description, category, icon, xp_reward, requirements, is_active) VALUES
-- Learning Milestones
('first_lesson', 'First Steps', 'Complete your first lesson', 'learning', 'book-open', 50, '{"type": "lesson_completion", "count": 1}', true),
('module_master', 'Module Master', 'Complete your first full module', 'learning', 'graduation-cap', 200, '{"type": "module_completion", "count": 1}', true),
('knowledge_seeker', 'Knowledge Seeker', 'Complete 5 lessons', 'learning', 'search', 300, '{"type": "lesson_completion", "count": 5}', true),
('learning_champion', 'Learning Champion', 'Complete 10 lessons', 'learning', 'trophy', 500, '{"type": "lesson_completion", "count": 10}', true),
('module_explorer', 'Module Explorer', 'Complete 3 different modules', 'learning', 'compass', 400, '{"type": "module_completion", "count": 3}', true),
('fundamentals_expert', 'Fundamentals Expert', 'Complete all fundamentals modules', 'learning', 'star', 600, '{"type": "category_completion", "category": "fundamentals"}', true),
('advanced_learner', 'Advanced Learner', 'Complete an advanced module', 'learning', 'zap', 400, '{"type": "difficulty_completion", "min_difficulty": 3}', true),
('project_master', 'Project Master', 'Complete a project-based module', 'learning', 'briefcase', 500, '{"type": "category_completion", "category": "projects"}', true),

-- Streak Achievements
('daily_learner', 'Daily Learner', 'Maintain a 3-day learning streak', 'milestone', 'calendar', 150, '{"type": "streak", "streak_type": "daily_learning", "min_days": 3}', true),
('week_warrior', 'Week Warrior', 'Maintain a 7-day learning streak', 'milestone', 'calendar-days', 300, '{"type": "streak", "streak_type": "daily_learning", "min_days": 7}', true),
('month_master', 'Month Master', 'Maintain a 30-day learning streak', 'milestone', 'calendar-check', 1000, '{"type": "streak", "streak_type": "daily_learning", "min_days": 30}', true),

-- Community Achievements
('first_share', 'First Share', 'Share your first prompt with the community', 'community', 'share-2', 100, '{"type": "community_post", "count": 1}', true),
('helpful_contributor', 'Helpful Contributor', 'Get 5 likes on your shared content', 'community', 'heart', 200, '{"type": "likes_received", "count": 5}', true),
('community_favorite', 'Community Favorite', 'Get 25 likes on your shared content', 'community', 'users', 500, '{"type": "likes_received", "count": 25}', true),
('discussion_starter', 'Discussion Starter', 'Start 5 discussion threads', 'community', 'message-circle', 300, '{"type": "discussion_posts", "count": 5}', true),
('collaborative_spirit', 'Collaborative Spirit', 'Participate in 10 community discussions', 'community', 'users-2', 400, '{"type": "comments_made", "count": 10}', true),
('prompt_guru', 'Prompt Guru', 'Share 10 high-quality prompt templates', 'community', 'lightbulb', 600, '{"type": "prompt_templates", "count": 10, "min_rating": 4.0}', true),

-- Technical Achievements
('ai_explorer', 'AI Explorer', 'Use 3 different AI models', 'technical', 'cpu', 200, '{"type": "ai_models_used", "count": 3}', true),
('prompt_engineer', 'Prompt Engineer', 'Create 20 effective prompts', 'technical', 'wrench', 400, '{"type": "prompts_created", "count": 20}', true),
('code_generator', 'Code Generator', 'Generate 50 lines of code using AI', 'technical', 'code', 300, '{"type": "code_lines_generated", "count": 50}', true),
('debugging_master', 'Debugging Master', 'Use AI to successfully debug 5 issues', 'technical', 'bug', 350, '{"type": "bugs_debugged", "count": 5}', true),
('assessment_ace', 'Assessment Ace', 'Score 90% or higher on any assessment', 'technical', 'target', 250, '{"type": "assessment_score", "min_percentage": 90}', true),
('perfect_score', 'Perfect Score', 'Get a perfect score on any assessment', 'technical', 'award', 500, '{"type": "assessment_score", "min_percentage": 100}', true),

-- Special Achievements
('early_adopter', 'Early Adopter', 'Join the platform in the first month', 'milestone', 'rocket', 100, '{"type": "early_user", "days_since_signup": 30}', true),
('dedicated_learner', 'Dedicated Learner', 'Spend 10 hours learning on the platform', 'milestone', 'clock', 400, '{"type": "time_spent", "hours": 10}', true),
('knowledge_sponge', 'Knowledge Sponge', 'Spend 50 hours learning on the platform', 'milestone', 'book', 800, '{"type": "time_spent", "hours": 50}', true),
('daily_challenge_champion', 'Daily Challenge Champion', 'Complete 5 daily challenges', 'milestone', 'calendar-star', 300, '{"type": "daily_challenges", "count": 5}', true),
('weekend_warrior', 'Weekend Warrior', 'Complete a lesson on the weekend', 'milestone', 'sun', 100, '{"type": "weekend_learning"}', true),
('night_owl', 'Night Owl', 'Complete a lesson after 10 PM', 'milestone', 'moon', 100, '{"type": "late_night_learning"}', true),

-- Level-based Achievements
('level_5', 'Rising Star', 'Reach level 5', 'milestone', 'star', 200, '{"type": "level_reached", "level": 5}', true),
('level_10', 'Experienced Learner', 'Reach level 10', 'milestone', 'star', 400, '{"type": "level_reached", "level": 10}', true),
('level_20', 'Advanced Practitioner', 'Reach level 20', 'milestone', 'star', 800, '{"type": "level_reached", "level": 20}', true),
('level_50', 'AI Master', 'Reach level 50', 'milestone', 'crown', 2000, '{"type": "level_reached", "level": 50}', true),

-- XP Milestones
('xp_1000', 'Thousand Points', 'Earn 1,000 XP', 'milestone', 'trending-up', 100, '{"type": "xp_earned", "amount": 1000}', true),
('xp_5000', 'Five Thousand Club', 'Earn 5,000 XP', 'milestone', 'trending-up', 200, '{"type": "xp_earned", "amount": 5000}', true),
('xp_10000', 'Ten Thousand Elite', 'Earn 10,000 XP', 'milestone', 'trending-up', 500, '{"type": "xp_earned", "amount": 10000}', true),
('xp_25000', 'Twenty-Five Thousand Legend', 'Earn 25,000 XP', 'milestone', 'trending-up', 1000, '{"type": "xp_earned", "amount": 25000}', true),

-- Special Event Achievements
('beta_tester', 'Beta Tester', 'Participate in beta testing of new features', 'milestone', 'flask-conical', 300, '{"type": "beta_participation"}', true),
('feedback_champion', 'Feedback Champion', 'Provide valuable feedback on 5 features', 'community', 'message-square', 250, '{"type": "feedback_provided", "count": 5}', true),
('bug_hunter', 'Bug Hunter', 'Report a bug that gets fixed', 'technical', 'search', 200, '{"type": "bug_reported", "status": "fixed"}', true);

-- Create indexes for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON public.achievements(is_active);

-- Enable RLS on achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements (public read)
CREATE POLICY "achievements_select_all" ON public.achievements FOR SELECT TO authenticated USING (is_active = true);

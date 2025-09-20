-- Extended Database Schema for AI Learning App Enhancement
-- This script extends the existing schema with new tables for enhanced features

-- 1. Learning Modules Table
CREATE TABLE IF NOT EXISTS public.learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'fundamentals', 'advanced', 'tools', 'projects'
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_duration INTEGER NOT NULL, -- in minutes
  prerequisites TEXT[], -- array of module IDs that must be completed first
  content_structure JSONB NOT NULL, -- structured content data
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_type TEXT NOT NULL CHECK (lesson_type IN ('video', 'exercise', 'sandbox', 'assessment', 'reading')),
  content JSONB NOT NULL, -- lesson-specific content data
  order_index INTEGER NOT NULL,
  estimated_duration INTEGER, -- in minutes
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('quiz', 'practical', 'coding', 'prompt_evaluation')),
  questions JSONB NOT NULL, -- structured question data
  passing_score INTEGER DEFAULT 70, -- percentage
  time_limit INTEGER, -- in minutes
  max_attempts INTEGER DEFAULT 3,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Streaks Table
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL CHECK (streak_type IN ('daily_learning', 'module_completion', 'community_activity')),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, streak_type)
);

-- 5. Leaderboards Table
CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leaderboard_type TEXT NOT NULL CHECK (leaderboard_type IN ('xp', 'streak', 'modules_completed', 'community_contributions')),
  score INTEGER NOT NULL DEFAULT 0,
  rank_position INTEGER,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, leaderboard_type, period)
);

-- 6. AI Tool Usage Table
CREATE TABLE IF NOT EXISTS public.ai_tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL CHECK (tool_name IN ('openai', 'anthropic', 'github_copilot', 'custom')),
  model_name TEXT NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 6) DEFAULT 0,
  request_duration_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Prompt Templates Table
CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  template_content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. User Follows Table
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 9. Module Progress Table (Enhanced)
CREATE TABLE IF NOT EXISTS public.module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completion_status TEXT NOT NULL CHECK (completion_status IN ('not_started', 'in_progress', 'completed', 'skipped')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  time_spent INTEGER DEFAULT 0, -- in seconds
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id, lesson_id)
);

-- 10. Assessment Results Table
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB, -- user's answers
  time_taken INTEGER, -- in seconds
  attempt_number INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Daily Challenges Table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('prompt_creation', 'module_completion', 'community_engagement', 'ai_tool_usage')),
  requirements JSONB NOT NULL, -- specific requirements for the challenge
  xp_reward INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. User Daily Challenge Progress Table
CREATE TABLE IF NOT EXISTS public.user_daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, challenge_id, DATE(completed_at))
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_learning_modules_category ON public.learning_modules(category);
CREATE INDEX IF NOT EXISTS idx_learning_modules_difficulty ON public.learning_modules(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_learning_modules_published ON public.learning_modules(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_assessments_module_id ON public.assessments(module_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_streaks_type ON public.user_streaks(streak_type);
CREATE INDEX IF NOT EXISTS idx_leaderboards_type_period ON public.leaderboards(leaderboard_type, period);
CREATE INDEX IF NOT EXISTS idx_leaderboards_score ON public.leaderboards(leaderboard_type, period, score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tool_usage_user_id ON public.ai_tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_usage_created_at ON public.ai_tool_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_category ON public.prompt_templates(category);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_public ON public.prompt_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON public.user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following ON public.user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_user_id ON public.module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_module_id ON public.module_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_id ON public.assessment_results(assessment_id);

-- Enable Row Level Security on all new tables
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_modules (public read, authenticated write)
CREATE POLICY "learning_modules_select_all" ON public.learning_modules FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "learning_modules_insert_authenticated" ON public.learning_modules FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "learning_modules_update_own" ON public.learning_modules FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "learning_modules_delete_own" ON public.learning_modules FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for lessons (public read, authenticated write)
CREATE POLICY "lessons_select_all" ON public.lessons FOR SELECT TO authenticated USING (true);
CREATE POLICY "lessons_insert_authenticated" ON public.lessons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "lessons_update_authenticated" ON public.lessons FOR UPDATE TO authenticated USING (true);
CREATE POLICY "lessons_delete_authenticated" ON public.lessons FOR DELETE TO authenticated USING (true);

-- RLS Policies for assessments (public read, authenticated write)
CREATE POLICY "assessments_select_all" ON public.assessments FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "assessments_insert_authenticated" ON public.assessments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "assessments_update_authenticated" ON public.assessments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "assessments_delete_authenticated" ON public.assessments FOR DELETE TO authenticated USING (true);

-- RLS Policies for user_streaks (own data only)
CREATE POLICY "user_streaks_select_own" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_streaks_insert_own" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_streaks_update_own" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_streaks_delete_own" ON public.user_streaks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for leaderboards (public read, system write)
CREATE POLICY "leaderboards_select_all" ON public.leaderboards FOR SELECT TO authenticated USING (true);
CREATE POLICY "leaderboards_insert_system" ON public.leaderboards FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "leaderboards_update_system" ON public.leaderboards FOR UPDATE TO authenticated USING (true);
CREATE POLICY "leaderboards_delete_system" ON public.leaderboards FOR DELETE TO authenticated USING (true);

-- RLS Policies for ai_tool_usage (own data only)
CREATE POLICY "ai_tool_usage_select_own" ON public.ai_tool_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ai_tool_usage_insert_own" ON public.ai_tool_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_tool_usage_update_own" ON public.ai_tool_usage FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ai_tool_usage_delete_own" ON public.ai_tool_usage FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for prompt_templates (public read if public, own write)
CREATE POLICY "prompt_templates_select_public" ON public.prompt_templates FOR SELECT TO authenticated USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "prompt_templates_insert_own" ON public.prompt_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "prompt_templates_update_own" ON public.prompt_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "prompt_templates_delete_own" ON public.prompt_templates FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_follows (own data only)
CREATE POLICY "user_follows_select_own" ON public.user_follows FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);
CREATE POLICY "user_follows_insert_own" ON public.user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "user_follows_delete_own" ON public.user_follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for module_progress (own data only)
CREATE POLICY "module_progress_select_own" ON public.module_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "module_progress_insert_own" ON public.module_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "module_progress_update_own" ON public.module_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "module_progress_delete_own" ON public.module_progress FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for assessment_results (own data only)
CREATE POLICY "assessment_results_select_own" ON public.assessment_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "assessment_results_insert_own" ON public.assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "assessment_results_update_own" ON public.assessment_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "assessment_results_delete_own" ON public.assessment_results FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for daily_challenges (public read, system write)
CREATE POLICY "daily_challenges_select_all" ON public.daily_challenges FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "daily_challenges_insert_system" ON public.daily_challenges FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "daily_challenges_update_system" ON public.daily_challenges FOR UPDATE TO authenticated USING (true);
CREATE POLICY "daily_challenges_delete_system" ON public.daily_challenges FOR DELETE TO authenticated USING (true);

-- RLS Policies for user_daily_challenges (own data only)
CREATE POLICY "user_daily_challenges_select_own" ON public.user_daily_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_daily_challenges_insert_own" ON public.user_daily_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_daily_challenges_update_own" ON public.user_daily_challenges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_daily_challenges_delete_own" ON public.user_daily_challenges FOR DELETE USING (auth.uid() = user_id);

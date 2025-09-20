-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table for tracking module completion
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score INTEGER,
  UNIQUE(user_id, module_id, lesson_id)
);

-- Create user_achievements table for gamification
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create community_posts table for sharing prompts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  prompt_text TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_likes table for community interactions
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Create post_comments table for community feedback
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for user_progress
CREATE POLICY "user_progress_select_own" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_progress_insert_own" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_progress_update_own" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_progress_delete_own" ON public.user_progress FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "user_achievements_select_own" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_achievements_insert_own" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_achievements_update_own" ON public.user_achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_achievements_delete_own" ON public.user_achievements FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for community_posts (public read, own write)
CREATE POLICY "community_posts_select_all" ON public.community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "community_posts_insert_own" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "community_posts_update_own" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "community_posts_delete_own" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for post_likes
CREATE POLICY "post_likes_select_all" ON public.post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "post_likes_insert_own" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_likes_delete_own" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for post_comments (public read, own write)
CREATE POLICY "post_comments_select_all" ON public.post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "post_comments_insert_own" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_comments_update_own" ON public.post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "post_comments_delete_own" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

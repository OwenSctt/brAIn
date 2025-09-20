-- Add settings columns to profiles table
-- This script adds user preference columns to the existing profiles table

-- Add notification preferences
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS achievement_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS community_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS weekly_digest BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT false;

-- Add privacy settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
ADD COLUMN IF NOT EXISTS show_progress BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_achievements BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_messages BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS data_sharing BOOLEAN DEFAULT false;

-- Add appearance settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
ADD COLUMN IF NOT EXISTS animations BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS compact_mode BOOLEAN DEFAULT false;

-- Add AI tool preferences
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS default_ai_model TEXT DEFAULT 'gpt-4',
ADD COLUMN IF NOT EXISTS max_tokens INTEGER DEFAULT 4000,
ADD COLUMN IF NOT EXISTS temperature DECIMAL(3,2) DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS auto_save BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS cost_limit DECIMAL(10,2) DEFAULT 50.00;

-- Add user preferences
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC-8',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON public.profiles(profile_visibility);
CREATE INDEX IF NOT EXISTS idx_profiles_theme ON public.profiles(theme);
CREATE INDEX IF NOT EXISTS idx_profiles_ai_model ON public.profiles(default_ai_model);

-- Update RLS policies for new columns
-- The existing RLS policies will automatically cover these new columns
-- since they're part of the profiles table

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.email_notifications IS 'User preference for email notifications';
COMMENT ON COLUMN public.profiles.push_notifications IS 'User preference for push notifications';
COMMENT ON COLUMN public.profiles.achievement_notifications IS 'User preference for achievement notifications';
COMMENT ON COLUMN public.profiles.community_notifications IS 'User preference for community notifications';
COMMENT ON COLUMN public.profiles.weekly_digest IS 'User preference for weekly digest emails';
COMMENT ON COLUMN public.profiles.marketing_emails IS 'User preference for marketing emails';
COMMENT ON COLUMN public.profiles.profile_visibility IS 'Profile visibility setting: public, friends, or private';
COMMENT ON COLUMN public.profiles.show_progress IS 'Whether to show learning progress publicly';
COMMENT ON COLUMN public.profiles.show_achievements IS 'Whether to show achievements publicly';
COMMENT ON COLUMN public.profiles.allow_messages IS 'Whether to allow direct messages from other users';
COMMENT ON COLUMN public.profiles.data_sharing IS 'Whether to allow data sharing for analytics';
COMMENT ON COLUMN public.profiles.theme IS 'UI theme preference: light, dark, or system';
COMMENT ON COLUMN public.profiles.font_size IS 'Font size preference: small, medium, or large';
COMMENT ON COLUMN public.profiles.animations IS 'Whether to enable UI animations';
COMMENT ON COLUMN public.profiles.compact_mode IS 'Whether to use compact UI mode';
COMMENT ON COLUMN public.profiles.default_ai_model IS 'Default AI model for playground';
COMMENT ON COLUMN public.profiles.max_tokens IS 'Maximum tokens for AI requests';
COMMENT ON COLUMN public.profiles.temperature IS 'Temperature setting for AI requests (0.0-2.0)';
COMMENT ON COLUMN public.profiles.auto_save IS 'Whether to auto-save work in progress';
COMMENT ON COLUMN public.profiles.cost_limit IS 'Monthly cost limit for AI usage';
COMMENT ON COLUMN public.profiles.timezone IS 'User timezone for display purposes';
COMMENT ON COLUMN public.profiles.language IS 'User language preference';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user settings from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user settings:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Default settings structure
    const settings = {
      profile: {
        displayName: profile?.display_name || '',
        email: profile?.email || '',
        bio: profile?.bio || '',
        avatar: profile?.avatar_url || '',
        timezone: profile?.timezone || 'UTC-8',
        language: profile?.language || 'en'
      },
      notifications: {
        email: profile?.email_notifications !== false,
        push: profile?.push_notifications !== false,
        achievements: profile?.achievement_notifications !== false,
        community: profile?.community_notifications !== false,
        weeklyDigest: profile?.weekly_digest !== false,
        marketing: profile?.marketing_emails === true
      },
      privacy: {
        profileVisibility: profile?.profile_visibility || 'public',
        showProgress: profile?.show_progress !== false,
        showAchievements: profile?.show_achievements !== false,
        allowMessages: profile?.allow_messages !== false,
        dataSharing: profile?.data_sharing === true
      },
      appearance: {
        theme: profile?.theme || 'dark',
        fontSize: profile?.font_size || 'medium',
        animations: profile?.animations !== false,
        compactMode: profile?.compact_mode === true
      },
      ai: {
        defaultModel: profile?.default_ai_model || 'gpt-4',
        maxTokens: profile?.max_tokens || 4000,
        temperature: profile?.temperature || 0.7,
        autoSave: profile?.auto_save !== false,
        costLimit: profile?.cost_limit || 50
      }
    };

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error in settings GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { user_id, settings } = body;

    if (!user_id || !settings) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update user settings in profiles table
    const updateData = {
      display_name: settings.profile?.displayName,
      bio: settings.profile?.bio,
      avatar_url: settings.profile?.avatar,
      timezone: settings.profile?.timezone,
      language: settings.profile?.language,
      email_notifications: settings.notifications?.email,
      push_notifications: settings.notifications?.push,
      achievement_notifications: settings.notifications?.achievements,
      community_notifications: settings.notifications?.community,
      weekly_digest: settings.notifications?.weeklyDigest,
      marketing_emails: settings.notifications?.marketing,
      profile_visibility: settings.privacy?.profileVisibility,
      show_progress: settings.privacy?.showProgress,
      show_achievements: settings.privacy?.showAchievements,
      allow_messages: settings.privacy?.allowMessages,
      data_sharing: settings.privacy?.dataSharing,
      theme: settings.appearance?.theme,
      font_size: settings.appearance?.fontSize,
      animations: settings.appearance?.animations,
      compact_mode: settings.appearance?.compactMode,
      default_ai_model: settings.ai?.defaultModel,
      max_tokens: settings.ai?.maxTokens,
      temperature: settings.ai?.temperature,
      auto_save: settings.ai?.autoSave,
      cost_limit: settings.ai?.costLimit,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user settings:', error);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in settings PUT API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

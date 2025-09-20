import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's AI tool usage
    const { data: usage, error: usageError } = await supabase
      .from('ai_tool_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (usageError) {
      console.error('Error fetching AI tool usage:', usageError);
      return NextResponse.json(
        { error: 'Failed to fetch AI tool usage' },
        { status: 500 }
      );
    }

    // Calculate usage statistics
    const stats = {
      total_requests: usage?.length || 0,
      total_tokens: usage?.reduce((sum, record) => sum + (record.total_tokens || 0), 0) || 0,
      total_cost: usage?.reduce((sum, record) => sum + (record.cost_usd || 0), 0) || 0,
      success_rate: usage?.length ? 
        (usage.filter(record => record.success).length / usage.length) * 100 : 0,
      average_response_time: usage?.length ? 
        usage.reduce((sum, record) => sum + (record.request_duration_ms || 0), 0) / usage.length : 0,
      by_tool: usage?.reduce((acc, record) => {
        const tool = record.tool_name;
        if (!acc[tool]) {
          acc[tool] = {
            requests: 0,
            tokens: 0,
            cost: 0,
            success_rate: 0,
          };
        }
        acc[tool].requests++;
        acc[tool].tokens += record.total_tokens || 0;
        acc[tool].cost += record.cost_usd || 0;
        acc[tool].success_rate = usage.filter(r => r.tool_name === tool && r.success).length / 
          usage.filter(r => r.tool_name === tool).length * 100;
        return acc;
      }, {} as Record<string, any>) || {},
    };

    return NextResponse.json({
      data: {
        usage: usage || [],
        stats,
      },
    });
  } catch (error) {
    console.error('Error in AI integrations API:', error);
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
      tool_name,
      model_name,
      prompt_tokens,
      completion_tokens,
      total_tokens,
      cost_usd,
      request_duration_ms,
      success,
      error_message,
    } = body;

    if (!user_id || !tool_name || !model_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate tool name
    const validTools = ['openai', 'anthropic', 'github_copilot', 'custom'];
    if (!validTools.includes(tool_name)) {
      return NextResponse.json(
        { error: 'Invalid tool name' },
        { status: 400 }
      );
    }

    // Record AI tool usage
    const { data: usage, error } = await supabase
      .from('ai_tool_usage')
      .insert({
        user_id,
        tool_name,
        model_name,
        prompt_tokens: prompt_tokens || 0,
        completion_tokens: completion_tokens || 0,
        total_tokens: total_tokens || 0,
        cost_usd: cost_usd || 0,
        request_duration_ms,
        success: success !== false,
        error_message,
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording AI tool usage:', error);
      return NextResponse.json(
        { error: 'Failed to record AI tool usage' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: usage }, { status: 201 });
  } catch (error) {
    console.error('Error in AI integrations POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

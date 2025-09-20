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

    // Get user's AI tool usage
    const { data: usage, error } = await supabase
      .from('ai_tool_usage')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI tool usage:', error);
      return NextResponse.json({ error: 'Failed to fetch AI tool usage' }, { status: 500 });
    }

    // Get available AI tools
    const availableTools = [
      {
        id: 'openai-gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        description: 'Most capable model for complex reasoning and analysis',
        maxTokens: 8192,
        costPerToken: 0.00003,
        capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation'],
        isAvailable: true
      },
      {
        id: 'openai-gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        description: 'Fast and efficient for most tasks',
        maxTokens: 4096,
        costPerToken: 0.000002,
        capabilities: ['text-generation', 'conversation', 'code-generation'],
        isAvailable: true
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        description: 'Most capable model for complex tasks',
        maxTokens: 200000,
        costPerToken: 0.000015,
        capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation', 'complex-reasoning'],
        isAvailable: true
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        description: 'Balanced performance and speed',
        maxTokens: 200000,
        costPerToken: 0.000003,
        capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation'],
        isAvailable: true
      }
    ];

    // Calculate usage statistics
    const totalRequests = usage?.reduce((sum, record) => sum + (record.total_requests || 0), 0) || 0;
    const totalTokens = usage?.reduce((sum, record) => sum + (record.total_tokens || 0), 0) || 0;
    const totalCost = usage?.reduce((sum, record) => sum + (record.cost_usd || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      data: {
        tools: availableTools,
        usage: {
          totalRequests,
          totalTokens,
          totalCost,
          records: usage || []
        }
      }
    });
  } catch (error) {
    console.error('Error in AI tools API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { user_id, tool_name, model_name, prompt_tokens, completion_tokens, cost_usd, success } = body;

    if (!user_id || !tool_name || !model_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Record AI tool usage
    const { data, error } = await supabase
      .from('ai_tool_usage')
      .insert({
        user_id,
        tool_name,
        model_name,
        prompt_tokens: prompt_tokens || 0,
        completion_tokens: completion_tokens || 0,
        total_tokens: (prompt_tokens || 0) + (completion_tokens || 0),
        cost_usd: cost_usd || 0,
        success: success !== false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording AI tool usage:', error);
      return NextResponse.json({ error: 'Failed to record usage' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in AI tools POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

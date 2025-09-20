import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Mock AI clients - in a real implementation, these would be actual API clients
const mockOpenAIResponse = async (prompt: string, model: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = {
    'gpt-3.5-turbo': `Here's a helpful response to your prompt: "${prompt}". This is a simulated GPT-3.5 response.`,
    'gpt-4': `Here's an advanced response to your prompt: "${prompt}". This is a simulated GPT-4 response with more detailed analysis.`,
    'gpt-4-turbo': `Here's a comprehensive response to your prompt: "${prompt}". This is a simulated GPT-4 Turbo response with enhanced capabilities.`,
  };
  
  return {
    response: responses[model as keyof typeof responses] || responses['gpt-3.5-turbo'],
    usage: {
      prompt_tokens: Math.floor(prompt.length / 4),
      completion_tokens: Math.floor(Math.random() * 200) + 50,
      total_tokens: 0,
      cost_usd: 0,
    },
  };
};

const mockAnthropicResponse = async (prompt: string, model: string) => {
  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1800));
  
  const responses = {
    'claude-3-haiku': `Claude Haiku response: "${prompt}". This is a simulated Claude 3 Haiku response.`,
    'claude-3-sonnet': `Claude Sonnet response: "${prompt}". This is a simulated Claude 3 Sonnet response with balanced performance.`,
    'claude-3-opus': `Claude Opus response: "${prompt}". This is a simulated Claude 3 Opus response with advanced reasoning.`,
  };
  
  return {
    response: responses[model as keyof typeof responses] || responses['claude-3-sonnet'],
    usage: {
      prompt_tokens: Math.floor(prompt.length / 4),
      completion_tokens: Math.floor(Math.random() * 300) + 100,
      total_tokens: 0,
      cost_usd: 0,
    },
  };
};

const mockGitHubCopilotResponse = async (prompt: string, model: string) => {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  return {
    response: `// GitHub Copilot suggestion for: "${prompt}"\n// This is a simulated GitHub Copilot response with code suggestions.`,
    usage: {
      prompt_tokens: Math.floor(prompt.length / 4),
      completion_tokens: Math.floor(Math.random() * 150) + 30,
      total_tokens: 0,
      cost_usd: 0,
    },
  };
};

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    
    const {
      user_id,
      prompt,
      model_id,
      tool_name,
      settings = {},
    } = body;

    if (!user_id || !prompt || !model_id || !tool_name) {
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

    const startTime = Date.now();
    let response;
    let success = true;
    let errorMessage = '';

    try {
      // Call appropriate AI service based on tool_name
      switch (tool_name) {
        case 'openai':
          response = await mockOpenAIResponse(prompt, model_id);
          break;
        case 'anthropic':
          response = await mockAnthropicResponse(prompt, model_id);
          break;
        case 'github_copilot':
          response = await mockGitHubCopilotResponse(prompt, model_id);
          break;
        default:
          throw new Error(`Unsupported tool: ${tool_name}`);
      }

      // Calculate total tokens and cost
      response.usage.total_tokens = response.usage.prompt_tokens + response.usage.completion_tokens;
      
      // Mock cost calculation (in real implementation, use actual pricing)
      const costPerToken = 0.00002; // $0.02 per 1K tokens
      response.usage.cost_usd = (response.usage.total_tokens * costPerToken) / 1000;

    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      response = {
        response: '',
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
          cost_usd: 0,
        },
      };
    }

    const requestDuration = Date.now() - startTime;

    // Record usage in database
    const { error: usageError } = await supabase
      .from('ai_tool_usage')
      .insert({
        user_id,
        tool_name,
        model_name: model_id,
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
        cost_usd: response.usage.cost_usd,
        request_duration_ms: requestDuration,
        success,
        error_message: errorMessage || null,
      });

    if (usageError) {
      console.error('Error recording AI tool usage:', usageError);
      // Don't fail the request if we can't record usage
    }

    // Award XP for AI tool usage
    if (success) {
      const xpPoints = Math.min(Math.floor(response.usage.total_tokens / 10), 50); // Max 50 XP per request
      
      // Update user XP
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', user_id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            xp: profile.xp + xpPoints,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user_id);
      }
    }

    return NextResponse.json({
      data: {
        response: response.response,
        usage: {
          ...response.usage,
          request_duration_ms: requestDuration,
        },
        success,
        error: errorMessage,
        xp_awarded: success ? Math.min(Math.floor(response.usage.total_tokens / 10), 50) : 0,
      },
    });
  } catch (error) {
    console.error('Error in test prompt API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve available models
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tool_name = searchParams.get('tool_name');

    const models = {
      openai: [
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'Fast and efficient for most tasks',
          max_tokens: 4096,
          cost_per_token: 0.000002,
          capabilities: ['text-generation', 'conversation', 'code-generation'],
        },
        {
          id: 'gpt-4',
          name: 'GPT-4',
          description: 'Advanced reasoning and analysis',
          max_tokens: 8192,
          cost_per_token: 0.00003,
          capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation'],
        },
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          description: 'Latest GPT-4 with enhanced capabilities',
          max_tokens: 128000,
          cost_per_token: 0.00001,
          capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation', 'long-context'],
        },
      ],
      anthropic: [
        {
          id: 'claude-3-haiku',
          name: 'Claude 3 Haiku',
          description: 'Fast and lightweight for simple tasks',
          max_tokens: 200000,
          cost_per_token: 0.00000025,
          capabilities: ['text-generation', 'conversation', 'analysis'],
        },
        {
          id: 'claude-3-sonnet',
          name: 'Claude 3 Sonnet',
          description: 'Balanced performance and speed',
          max_tokens: 200000,
          cost_per_token: 0.000003,
          capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation'],
        },
        {
          id: 'claude-3-opus',
          name: 'Claude 3 Opus',
          description: 'Most capable model for complex tasks',
          max_tokens: 200000,
          cost_per_token: 0.000015,
          capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation', 'complex-reasoning'],
        },
      ],
      github_copilot: [
        {
          id: 'github-copilot',
          name: 'GitHub Copilot',
          description: 'AI pair programmer for code completion',
          max_tokens: 4096,
          cost_per_token: 0.00001,
          capabilities: ['code-generation', 'code-completion', 'code-explanation'],
        },
      ],
    };

    if (tool_name && models[tool_name as keyof typeof models]) {
      return NextResponse.json({
        data: models[tool_name as keyof typeof models],
      });
    }

    return NextResponse.json({
      data: models,
    });
  } catch (error) {
    console.error('Error in models API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

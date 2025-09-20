'use client';

import { Sidebar } from "@/components/sidebar"
import { SandboxEditor } from "@/components/learning/SandboxEditor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Code, MessageSquare, Zap, Settings, BookOpen } from "lucide-react"
import { useState } from "react"

const mockModels = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai' as const,
    description: 'Fast and efficient for most tasks',
    maxTokens: 4096,
    costPerToken: 0.000002,
    capabilities: ['text-generation', 'conversation', 'code-generation'],
    isAvailable: true
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai' as const,
    description: 'Advanced reasoning and analysis',
    maxTokens: 8192,
    costPerToken: 0.00003,
    capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation'],
    isAvailable: true
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic' as const,
    description: 'Balanced performance and speed',
    maxTokens: 200000,
    costPerToken: 0.000003,
    capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation'],
    isAvailable: true
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic' as const,
    description: 'Most capable model for complex tasks',
    maxTokens: 200000,
    costPerToken: 0.000015,
    capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation', 'complex-reasoning'],
    isAvailable: true
  }
]

const mockScenarios = [
  "Write a Python function to sort a list of dictionaries by a specific key",
  "Explain quantum computing in simple terms for a 10-year-old",
  "Create a marketing strategy for a new AI-powered fitness app",
  "Debug this JavaScript code and explain what's wrong",
  "Write a persuasive email to convince a client to adopt AI solutions"
]

const mockHints = [
  "Try breaking down complex problems into smaller steps",
  "Consider using specific examples to illustrate your points",
  "Think about the target audience when crafting your response",
  "Don't forget to include error handling in your code",
  "Use clear and concise language for better understanding"
]

export default function PlaygroundPage() {
  const [selectedScenario, setSelectedScenario] = useState(0)
  const [selectedHint, setSelectedHint] = useState(0)

  const handlePromptSubmit = async (prompt: string, modelId: string) => {
    // Mock API call - in a real app, this would call the actual API
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const responses = {
      'gpt-3.5-turbo': `Here's a helpful response to your prompt: "${prompt}". This is a simulated GPT-3.5 response with practical suggestions and examples.`,
      'gpt-4': `Here's an advanced response to your prompt: "${prompt}". This is a simulated GPT-4 response with detailed analysis and comprehensive solutions.`,
      'claude-3-sonnet': `Claude Sonnet response: "${prompt}". This is a simulated Claude 3 Sonnet response with balanced performance and thoughtful insights.`,
      'claude-3-opus': `Claude Opus response: "${prompt}". This is a simulated Claude 3 Opus response with advanced reasoning and comprehensive analysis.`,
    }
    
    const response = responses[modelId as keyof typeof responses] || responses['gpt-3.5-turbo']
    const promptTokens = Math.floor(prompt.length / 4)
    const completionTokens = Math.floor(Math.random() * 200) + 50
    const totalTokens = promptTokens + completionTokens
    const costPerToken = mockModels.find(m => m.id === modelId)?.costPerToken || 0.000002
    const cost = totalTokens * costPerToken

    return {
      response,
      usage: {
        tool_name: mockModels.find(m => m.id === modelId)?.provider || 'openai',
        model_name: modelId,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost_usd: cost,
        request_duration_ms: 1000 + Math.random() * 2000,
        success: true,
        error_message: null,
        created_at: new Date().toISOString()
      },
      success: true
    }
  }

  const handleProgressUpdate = (progress: number) => {
    console.log("Progress updated:", progress)
  }

  const handleComplete = (score?: number) => {
    console.log("Lesson completed with score:", score)
  }

  const handleSettingsOpen = (modelId: string) => {
    console.log("Opening settings for model:", modelId)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">AI Playground</h1>
            <p className="text-muted-foreground text-pretty">
              Experiment with different AI models and practice your prompting skills in a safe environment
            </p>
          </div>

          {/* Quick Start Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5" />
                  Try a Scenario
                </CardTitle>
                <CardDescription>Practice with real-world prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{mockScenarios[selectedScenario]}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedScenario((prev) => (prev + 1) % mockScenarios.length)}
                  >
                    Next Scenario
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5" />
                  Get a Hint
                </CardTitle>
                <CardDescription>Need some guidance?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{mockHints[selectedHint]}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedHint((prev) => (prev + 1) % mockHints.length)}
                  >
                    Next Hint
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Learn More
                </CardTitle>
                <CardDescription>Improve your prompting skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Check out our prompting fundamentals module</p>
                  <Button variant="outline" size="sm">
                    View Module
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Sandbox Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                AI Sandbox
              </CardTitle>
              <CardDescription>
                Experiment with different AI models and see how they respond to your prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SandboxEditor
                availableModels={mockModels}
                onPromptSubmit={handlePromptSubmit}
                onProgressUpdate={handleProgressUpdate}
                onComplete={handleComplete}
                onSettingsOpen={handleSettingsOpen}
                initialPrompt={mockScenarios[selectedScenario]}
                scenarios={mockScenarios}
                showHints={true}
                evaluationCriteria={[
                  "Response is relevant to the prompt",
                  "Response provides actionable insights",
                  "Response is well-structured and clear",
                  "Response demonstrates understanding of the context"
                ]}
              />
            </CardContent>
          </Card>

          {/* Tips and Best Practices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Prompting Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Be Specific</h4>
                  <p className="text-sm text-muted-foreground">
                    Provide clear context and specific requirements for better results
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Use Examples</h4>
                  <p className="text-sm text-muted-foreground">
                    Include examples to help the AI understand your desired output format
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Iterate and Refine</h4>
                  <p className="text-sm text-muted-foreground">
                    Don't be afraid to refine your prompts based on the responses you get
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Model Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">GPT-3.5 Turbo</h4>
                  <p className="text-sm text-muted-foreground">
                    Best for: Quick responses, general tasks, cost-effective
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">GPT-4</h4>
                  <p className="text-sm text-muted-foreground">
                    Best for: Complex reasoning, analysis, high-quality outputs
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Claude 3</h4>
                  <p className="text-sm text-muted-foreground">
                    Best for: Long-form content, creative writing, detailed analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
'use client';

export const dynamic = 'force-dynamic';

import { Sidebar } from "@/components/sidebar"
import { AIToolSelector } from "@/components/ai-integrations/AIToolSelector"
import { PromptTester } from "@/components/ai-integrations/PromptTester"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Code, Settings, Zap, BookOpen, TrendingUp } from "lucide-react"
import { useState } from "react"

const mockTools = [
  {
    id: 'openai-gpt-4',
    name: 'GPT-4',
    provider: 'openai' as const,
    description: 'Most capable model for complex reasoning and analysis',
    maxTokens: 8192,
    costPerToken: 0.00003,
    capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation'],
    isAvailable: true,
    usage: {
      totalRequests: 1247,
      totalTokens: 456789,
      totalCost: 13.70,
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  },
  {
    id: 'openai-gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai' as const,
    description: 'Fast and efficient for most tasks',
    maxTokens: 4096,
    costPerToken: 0.000002,
    capabilities: ['text-generation', 'conversation', 'code-generation'],
    isAvailable: true,
    usage: {
      totalRequests: 3421,
      totalTokens: 1234567,
      totalCost: 2.47,
      lastUsed: new Date(Date.now() - 30 * 60 * 1000)
    }
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic' as const,
    description: 'Most capable model for complex tasks',
    maxTokens: 200000,
    costPerToken: 0.000015,
    capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation', 'complex-reasoning'],
    isAvailable: true,
    usage: {
      totalRequests: 567,
      totalTokens: 234567,
      totalCost: 3.52,
      lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic' as const,
    description: 'Balanced performance and speed',
    maxTokens: 200000,
    costPerToken: 0.000003,
    capabilities: ['text-generation', 'reasoning', 'analysis', 'code-generation'],
    isAvailable: true,
    usage: {
      totalRequests: 1890,
      totalTokens: 678901,
      totalCost: 2.04,
      lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  }
]

const mockTemplates = [
  {
    id: 'code-review',
    name: 'Code Review Assistant',
    description: 'Review code for bugs, performance, and best practices',
    category: 'development',
    usage: 234,
    rating: 4.8
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Generate engaging content for blogs, social media, and marketing',
    category: 'writing',
    usage: 456,
    rating: 4.6
  },
  {
    id: 'data-analyst',
    name: 'Data Analysis',
    description: 'Analyze data and generate insights and visualizations',
    category: 'analysis',
    usage: 123,
    rating: 4.9
  },
  {
    id: 'debugging-helper',
    name: 'Debugging Assistant',
    description: 'Help identify and fix bugs in your code',
    category: 'development',
    usage: 345,
    rating: 4.7
  }
]

export default function AIToolsPage() {
  const [selectedTool, setSelectedTool] = useState(mockTools[0])
  const [activeTab, setActiveTab] = useState("overview")

  const handleToolSelect = (toolId: string) => {
    const tool = mockTools.find(t => t.id === toolId)
    if (tool) setSelectedTool(tool)
  }

  const handleTestPrompt = async (prompt: string, modelId: string) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const responses = {
      'openai-gpt-4': `GPT-4 Response: "${prompt}". This is a simulated GPT-4 response with advanced reasoning and comprehensive analysis.`,
      'openai-gpt-3.5-turbo': `GPT-3.5 Response: "${prompt}". This is a simulated GPT-3.5 response with practical suggestions.`,
      'claude-3-opus': `Claude Opus Response: "${prompt}". This is a simulated Claude Opus response with detailed insights.`,
      'claude-3-sonnet': `Claude Sonnet Response: "${prompt}". This is a simulated Claude Sonnet response with balanced analysis.`,
    }
    
    const response = responses[modelId as keyof typeof responses] || responses['openai-gpt-4']
    const promptTokens = Math.floor(prompt.length / 4)
    const completionTokens = Math.floor(Math.random() * 200) + 50
    const totalTokens = promptTokens + completionTokens
    const costPerToken = selectedTool.costPerToken
    const cost = totalTokens * costPerToken

    return {
      response,
      usage: {
        tool_name: selectedTool.provider,
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-balance">AI Tools</h1>
            <p className="text-muted-foreground text-pretty">
              Manage and test your AI tools, track usage, and optimize performance
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7,125</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$21.73</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">All systems operational</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Templates</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">4 categories</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest AI tool usage and interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTools && mockTools.length > 0 ? mockTools.slice(0, 3).map((tool) => (
                    <div key={tool.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Last used {tool.usage.lastUsed.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{tool.usage.totalRequests} requests</p>
                        <p className="text-xs text-muted-foreground">${tool.usage.totalCost.toFixed(2)}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-muted-foreground py-4">
                      No recent activity
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <AIToolSelector
                availableModels={mockTools}
                selectedModel={selectedTool.id}
                onModelSelect={handleToolSelect}
                showUsage={true}
                showCosts={true}
              />
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTemplates && mockTemplates.length > 0 ? mockTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{template.category}</Badge>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{template.usage} uses</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">{template.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">★</span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    No templates available
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>Track your AI tool usage and costs over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Analytics charts would go here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Test Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Quick Test
              </CardTitle>
              <CardDescription>
                Test your selected AI tool with a quick prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptTester
                availableModels={mockTools}
                selectedModel={selectedTool.id}
                onModelSelect={handleToolSelect}
                onPromptSubmit={handleTestPrompt}
                showAdvanced={false}
                initialPrompt="Write a simple hello world program in Python"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Download, 
  Settings, 
  Bot, 
  Clock,
  Zap,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { AIToolUsage } from '@/lib/database/schema';

interface Model {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'github_copilot' | 'custom';
  maxTokens: number;
  costPerToken: number;
  isAvailable: boolean;
}

interface TestResult {
  modelId: string;
  modelName: string;
  provider: string;
  response: string;
  usage: AIToolUsage;
  duration: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}

interface PromptTesterProps {
  models: Model[];
  onPromptTest: (prompt: string, modelId: string) => Promise<{
    response: string;
    usage: AIToolUsage;
    success: boolean;
    error?: string;
  }>;
  onSettingsOpen: (modelId: string) => void;
  className?: string;
}

export default function PromptTester({
  models,
  onPromptTest,
  onSettingsOpen,
  className = '',
}: PromptTesterProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState('results');
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of results
  const scrollToBottom = () => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleTest = async () => {
    if (!prompt.trim() || selectedModels.length === 0 || isTesting) return;

    setIsTesting(true);
    const newResults: TestResult[] = [];

    // Test each selected model
    for (const modelId of selectedModels) {
      const model = models.find(m => m.id === modelId);
      if (!model || !model.isAvailable) continue;

      try {
        const startTime = Date.now();
        const result = await onPromptTest(prompt, modelId);
        const duration = Date.now() - startTime;

        const testResult: TestResult = {
          modelId,
          modelName: model.name,
          provider: model.provider,
          response: result.response,
          usage: result.usage,
          duration,
          success: result.success,
          error: result.error,
          timestamp: new Date(),
        };

        newResults.push(testResult);
      } catch (error) {
        const testResult: TestResult = {
          modelId,
          modelName: model.name,
          provider: model.provider,
          response: '',
          usage: {
            tool_name: model.provider as any,
            model_name: model.name,
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
            cost_usd: 0,
            request_duration_ms: 0,
            success: false,
            error_message: error instanceof Error ? error.message : 'Unknown error',
            created_at: new Date().toISOString(),
          },
          duration: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
        };

        newResults.push(testResult);
      }
    }

    setTestResults(prev => [...newResults, ...prev]);
    setIsTesting(false);
    scrollToBottom();
  };

  const handleClearResults = () => {
    setTestResults([]);
  };

  const handleExportResults = () => {
    const exportData = {
      prompt,
      settings,
      results: testResults,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleTest();
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return <Bot className="w-4 h-4" />;
      case 'anthropic': return <MessageSquare className="w-4 h-4" />;
      case 'github_copilot': return <Zap className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'text-green-600 bg-green-100';
      case 'anthropic': return 'text-purple-600 bg-purple-100';
      case 'github_copilot': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalCost = testResults.reduce((sum, result) => sum + (result.usage.cost_usd || 0), 0);
  const totalTokens = testResults.reduce((sum, result) => sum + (result.usage.total_tokens || 0), 0);
  const averageDuration = testResults.length > 0 
    ? testResults.reduce((sum, result) => sum + result.duration, 0) / testResults.length 
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prompt Tester</h2>
          <p className="text-muted-foreground">Test your prompts across multiple AI models</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleClearResults}
            disabled={testResults.length === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button
            variant="outline"
            onClick={handleExportResults}
            disabled={testResults.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
          {/* Prompt Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your prompt here... (Ctrl+Enter to test)"
                className="min-h-[200px] resize-none"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Press Ctrl+Enter to test</span>
                <span>{prompt.length} characters</span>
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedModels.includes(model.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:bg-muted/50'
                    } ${!model.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => model.isAvailable && handleModelToggle(model.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${getProviderColor(model.provider)}`}>
                          {getProviderIcon(model.provider)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{model.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {model.maxTokens.toLocaleString()} tokens
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {model.isAvailable ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          ${model.costPerToken.toFixed(6)}/token
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Temperature</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{settings.temperature}</span>
              </div>
              <div>
                <label className="text-sm font-medium">Max Tokens</label>
                <input
                  type="number"
                  min="1"
                  max="4000"
                  value={settings.maxTokens}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Top P</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.topP}
                  onChange={(e) => setSettings(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{settings.topP}</span>
              </div>
            </CardContent>
          </Card>

          {/* Test Button */}
          <Button
            onClick={handleTest}
            disabled={!prompt.trim() || selectedModels.length === 0 || isTesting}
            className="w-full"
            size="lg"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Test Prompt
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-4">
              {testResults.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No test results yet</p>
                    <p className="text-sm text-muted-foreground">
                      Select models and test your prompt to see results
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <Card key={index} className={result.success ? '' : 'border-red-200'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getProviderColor(result.provider)}`}>
                              {getProviderIcon(result.provider)}
                            </div>
                            <div>
                              <CardTitle className="text-base">{result.modelName}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {result.provider} • {result.duration}ms
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {result.success ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyResponse(result.response)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {result.success ? (
                          <div className="space-y-3">
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="text-sm whitespace-pre-wrap">{result.response}</p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center space-x-4">
                                <span>{result.usage.total_tokens} tokens</span>
                                <span>${result.usage.cost_usd?.toFixed(6)}</span>
                              </div>
                              <span>{result.timestamp.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-800">Error: {result.error}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <div ref={resultsEndRef} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="comparison">
              <Card>
                <CardHeader>
                  <CardTitle>Model Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  {testResults.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No results to compare
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Model</th>
                            <th className="text-left p-2">Response Length</th>
                            <th className="text-left p-2">Duration</th>
                            <th className="text-left p-2">Tokens</th>
                            <th className="text-left p-2">Cost</th>
                            <th className="text-left p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testResults.map((result, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2 font-medium">{result.modelName}</td>
                              <td className="p-2">{result.response.length} chars</td>
                              <td className="p-2">{result.duration}ms</td>
                              <td className="p-2">{result.usage.total_tokens}</td>
                              <td className="p-2">${result.usage.cost_usd?.toFixed(6)}</td>
                              <td className="p-2">
                                {result.success ? (
                                  <Badge variant="default" className="text-xs">Success</Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-xs">Failed</Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Usage Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Tests</span>
                        <span className="font-medium">{testResults.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Tokens</span>
                        <span className="font-medium">{totalTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Cost</span>
                        <span className="font-medium">${totalCost.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Duration</span>
                        <span className="font-medium">{Math.round(averageDuration)}ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Model Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{result.modelName}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {result.duration}ms
                            </span>
                            {result.success ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export { PromptTester };

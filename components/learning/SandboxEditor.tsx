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
  Upload, 
  Settings, 
  Bot, 
  Code, 
  MessageSquare,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { AIToolUsage } from '@/lib/database/schema';

interface SandboxEditorProps {
  availableModels: Array<{
    id: string;
    name: string;
    provider: 'openai' | 'anthropic' | 'github_copilot' | 'custom';
    description: string;
    maxTokens: number;
    costPerToken: number;
  }>;
  onPromptSubmit: (prompt: string, modelId: string) => Promise<{
    response: string;
    usage: AIToolUsage;
    success: boolean;
    error?: string;
  }>;
  onProgressUpdate: (progress: number) => void;
  onComplete: (score?: number) => void;
  initialPrompt?: string;
  scenarios?: string[];
  showHints?: boolean;
  evaluationCriteria?: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  usage?: AIToolUsage;
}

export default function SandboxEditor({
  availableModels,
  onPromptSubmit,
  onProgressUpdate,
  onComplete,
  initialPrompt = '',
  scenarios = [],
  showHints = true,
  evaluationCriteria = [],
}: SandboxEditorProps) {
  const [selectedModel, setSelectedModel] = useState(availableModels[0]?.id || '');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
  });
  const [hints, setHints] = useState<string[]>([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    totalRequests: 0,
    totalTokens: 0,
    averageResponseTime: 0,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update progress based on interactions
  useEffect(() => {
    const newProgress = Math.min(
      (messages.filter(m => m.role === 'user').length * 20) + 
      (hints.length > 0 ? 10 : 0) + 
      (scenarios.length > 0 && currentScenario >= scenarios.length - 1 ? 20 : 0),
      100
    );
    setProgress(newProgress);
    onProgressUpdate(newProgress);
  }, [messages, hints, currentScenario, scenarios.length, onProgressUpdate]);

  const handleSubmit = async () => {
    if (!prompt.trim() || !selectedModel || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setPrompt('');

    try {
      const startTime = Date.now();
      const result = await onPromptSubmit(prompt, selectedModel);
      const responseTime = Date.now() - startTime;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        model: selectedModel,
        usage: result.usage,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update stats
      setTotalCost(prev => prev + (result.usage?.cost_usd || 0));
      setSessionStats(prev => ({
        totalRequests: prev.totalRequests + 1,
        totalTokens: prev.totalTokens + (result.usage?.total_tokens || 0),
        averageResponseTime: prev.averageResponseTime === 0 
          ? responseTime 
          : (prev.averageResponseTime + responseTime) / 2,
      }));

      if (result.success) {
        // Check if we should complete the lesson
        if (progress >= 80) {
          onComplete(85); // Score based on progress
        }
      }
    } catch (error) {
      console.error('Error submitting prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setProgress(0);
    onProgressUpdate(0);
  };

  const handleCopyResponse = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleExportChat = () => {
    const chatData = {
      messages,
      settings,
      stats: sessionStats,
      totalCost,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-sandbox-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.messages) {
          setMessages(data.messages);
        }
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Error importing chat:', error);
      }
    };
    reader.readAsText(file);
  };

  const showNextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint(prev => prev + 1);
    }
  };

  const showNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    }
  };

  const selectedModelData = availableModels.find(m => m.id === selectedModel);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <h3 className="text-lg font-semibold">AI Sandbox</h3>
          {selectedModelData && (
            <Badge variant="outline">{selectedModelData.name}</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportChat}
          >
            <Download className="w-4 h-4" />
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={handleImportChat}
            className="hidden"
            id="import-chat"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-chat')?.click()}
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chat Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scenarios */}
          {scenarios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{scenarios[currentScenario]}</p>
                  {currentScenario < scenarios.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={showNextScenario}
                    >
                      Next Scenario
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hints */}
          {showHints && hints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Hints</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{hints[currentHint]}</p>
                  {currentHint < hints.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={showNextHint}
                    >
                      Next Hint
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Messages */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-base">Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start a conversation with AI</p>
                      <p className="text-sm">Type your prompt below and press Ctrl+Enter to send</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <div className="flex items-center space-x-2 mt-2 text-xs opacity-70">
                                <span>{message.timestamp.toLocaleTimeString()}</span>
                                {message.model && (
                                  <Badge variant="outline" className="text-xs">
                                    {message.model}
                                  </Badge>
                                )}
                                {message.usage && (
                                  <span>{message.usage.total_tokens} tokens</span>
                                )}
                              </div>
                            </div>
                            {message.role === 'assistant' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyResponse(message.content)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Input Area */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center space-x-2">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {model.provider}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSubmit}
                    disabled={!prompt.trim() || !selectedModel || isLoading}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
                <Textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter your prompt here... (Ctrl+Enter to send)"
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Press Ctrl+Enter to send</span>
                  <span>{prompt.length} characters</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Settings */}
          {showSettings && (
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
          )}

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Requests</span>
                <span>{sessionStats.totalRequests}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Tokens</span>
                <span>{sessionStats.totalTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg Response Time</span>
                <span>{sessionStats.averageResponseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Cost</span>
                <span>${totalCost.toFixed(4)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          {evaluationCriteria.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evaluation Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {evaluationCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export { SandboxEditor };

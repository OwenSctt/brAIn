'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Code, 
  MessageSquare, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Star,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'github_copilot' | 'custom';
  description: string;
  icon: string;
  models: Array<{
    id: string;
    name: string;
    description: string;
    maxTokens: number;
    costPerToken: number;
    capabilities: string[];
    isAvailable: boolean;
  }>;
  features: string[];
  pricing: {
    type: 'per_token' | 'per_request' | 'subscription';
    base: number;
    unit: string;
  };
  status: 'available' | 'limited' | 'unavailable';
  lastUsed?: Date;
  totalUsage?: number;
  totalCost?: number;
}

interface AIToolSelectorProps {
  tools: AITool[];
  selectedTool?: string;
  selectedModel?: string;
  onToolSelect: (toolId: string, modelId: string) => void;
  onSettingsOpen: (toolId: string) => void;
  showUsageStats?: boolean;
  className?: string;
}

const PROVIDER_ICONS = {
  openai: Bot,
  anthropic: MessageSquare,
  github_copilot: Code,
  custom: Settings,
} as const;

const PROVIDER_COLORS = {
  openai: 'text-green-600 bg-green-100',
  anthropic: 'text-purple-600 bg-purple-100',
  github_copilot: 'text-blue-600 bg-blue-100',
  custom: 'text-gray-600 bg-gray-100',
} as const;

const STATUS_COLORS = {
  available: 'text-green-600',
  limited: 'text-yellow-600',
  unavailable: 'text-red-600',
} as const;

const STATUS_LABELS = {
  available: 'Available',
  limited: 'Limited',
  unavailable: 'Unavailable',
} as const;

export default function AIToolSelector({
  tools,
  selectedTool,
  selectedModel,
  onToolSelect,
  onSettingsOpen,
  showUsageStats = true,
  className = '',
}: AIToolSelectorProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTools = tools.filter(tool => {
    if (activeTab === 'all') return true;
    return tool.provider === activeTab;
  });

  const getProviderIcon = (provider: string) => {
    const IconComponent = PROVIDER_ICONS[provider as keyof typeof PROVIDER_ICONS] || PROVIDER_ICONS.custom;
    return <IconComponent className="w-5 h-5" />;
  };

  const getProviderColor = (provider: string) => {
    return PROVIDER_COLORS[provider as keyof typeof PROVIDER_COLORS] || PROVIDER_COLORS.custom;
  };

  const formatCost = (cost: number) => {
    if (cost < 0.001) return `$${cost.toFixed(6)}`;
    if (cost < 0.01) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(2)}`;
  };

  const formatUsage = (usage: number) => {
    if (usage < 1000) return usage.toString();
    if (usage < 1000000) return `${(usage / 1000).toFixed(1)}K`;
    return `${(usage / 1000000).toFixed(1)}M`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Tools</h2>
          <p className="text-muted-foreground">Select an AI tool and model for your learning</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {tools.filter(t => t.status === 'available').length} Available
          </Badge>
        </div>
      </div>

      {/* Provider Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          <TabsTrigger value="github_copilot">GitHub</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <Card 
                key={tool.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTool === tool.id ? 'ring-2 ring-primary' : ''
                } ${tool.status === 'unavailable' ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => tool.status !== 'unavailable' && onToolSelect(tool.id, tool.models[0]?.id || '')}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getProviderColor(tool.provider)}`}>
                        {getProviderIcon(tool.provider)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={tool.status === 'available' ? 'default' : 'secondary'}
                        className={STATUS_COLORS[tool.status]}
                      >
                        {STATUS_LABELS[tool.status]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSettingsOpen(tool.id);
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Models */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Available Models</h4>
                    <div className="space-y-2">
                      {tool.models.slice(0, 3).map((model) => (
                        <div 
                          key={model.id}
                          className={`p-2 rounded border ${
                            selectedTool === tool.id && selectedModel === model.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{model.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {model.maxTokens.toLocaleString()} tokens
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {formatCost(model.costPerToken)}/token
                              </p>
                              {model.isAvailable ? (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-red-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {tool.models.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{tool.models.length - 3} more models
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {tool.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {tool.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{tool.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Usage Stats */}
                  {showUsageStats && (tool.totalUsage || tool.totalCost) && (
                    <div className="pt-2 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {tool.totalUsage && (
                          <div className="flex items-center space-x-1">
                            <Activity className="w-3 h-3" />
                            <span>{formatUsage(tool.totalUsage)} uses</span>
                          </div>
                        )}
                        {tool.totalCost && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>${tool.totalCost.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Last Used */}
                  {tool.lastUsed && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Last used {tool.lastUsed.toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Tool Details */}
      {selectedTool && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Selected Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getProviderColor(tools.find(t => t.id === selectedTool)?.provider || 'custom')}`}>
                  {getProviderIcon(tools.find(t => t.id === selectedTool)?.provider || 'custom')}
                </div>
                <div>
                  <p className="font-medium">
                    {tools.find(t => t.id === selectedTool)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tools.find(t => t.id === selectedTool)?.models.find(m => m.id === selectedModel)?.name}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => onSettingsOpen(selectedTool)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Star className="w-4 h-4 mr-2" />
              Compare Tools
            </Button>
            <Button variant="outline" className="justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Manage API Keys
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Model Comparison Component
export function ModelComparison({ 
  models, 
  className = '' 
}: {
  models: Array<{
    id: string;
    name: string;
    provider: string;
    maxTokens: number;
    costPerToken: number;
    capabilities: string[];
    performance: {
      speed: number;
      accuracy: number;
      creativity: number;
    };
  }>;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Model Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Model</th>
                <th className="text-left p-2">Provider</th>
                <th className="text-left p-2">Max Tokens</th>
                <th className="text-left p-2">Cost/Token</th>
                <th className="text-left p-2">Speed</th>
                <th className="text-left p-2">Accuracy</th>
                <th className="text-left p-2">Creativity</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id} className="border-b">
                  <td className="p-2 font-medium">{model.name}</td>
                  <td className="p-2">
                    <Badge variant="outline">{model.provider}</Badge>
                  </td>
                  <td className="p-2">{model.maxTokens.toLocaleString()}</td>
                  <td className="p-2">${model.costPerToken.toFixed(6)}</td>
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${model.performance.speed}%` }}
                        />
                      </div>
                      <span className="text-sm">{model.performance.speed}%</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${model.performance.accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm">{model.performance.accuracy}%</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${model.performance.creativity}%` }}
                        />
                      </div>
                      <span className="text-sm">{model.performance.creativity}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export { AIToolSelector };

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Zap, Copy, RotateCcw, Settings } from "lucide-react"

export function AIPromptTester() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTestPrompt = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/test-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      setResponse("Error: Failed to test prompt. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Prompt Playground
          </CardTitle>
          <CardDescription>Test your prompts in real-time and see how different AI models respond</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="test" className="space-y-4">
            <TabsList>
              <TabsTrigger value="test">Test Prompt</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="test" className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Your Prompt:</label>
                <Textarea
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex gap-2">
                  <Button onClick={handleTestPrompt} disabled={!prompt.trim() || isLoading} className="gap-2">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                    {isLoading ? "Testing..." : "Test Prompt"}
                  </Button>
                  <Button variant="outline" onClick={() => setPrompt("")} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>

              {response && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">AI Response:</label>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{response}</pre>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <div className="grid gap-4">
                {[
                  {
                    title: "Code Explanation",
                    prompt:
                      "You are a senior developer. Explain this JavaScript function to a junior developer:\n\nfunction debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}",
                    category: "Code Review",
                  },
                  {
                    title: "Creative Writing",
                    prompt:
                      "Write a short story about a developer who discovers their code has gained consciousness. Keep it under 200 words and make it humorous.",
                    category: "Creative",
                  },
                  {
                    title: "Problem Solving",
                    prompt:
                      "I'm building a React app and getting 'Cannot read property of undefined' errors. Walk me through a systematic debugging approach. Provide specific steps and tools I should use.",
                    category: "Debugging",
                  },
                ].map((example, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{example.title}</h4>
                          <Badge variant="outline">{example.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">{example.prompt}</p>
                        <Button variant="ghost" size="sm" onClick={() => setPrompt(example.prompt)} className="w-full">
                          Use This Example
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Model Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">AI Model</label>
                    <select className="w-full p-2 border rounded-md bg-background">
                      <option>GPT-4 (Recommended)</option>
                      <option>GPT-3.5 Turbo</option>
                      <option>Claude 3</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Temperature: 0.7</label>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      Lower values make responses more focused, higher values more creative
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

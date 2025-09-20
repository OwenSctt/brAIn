"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LessonCompleteDialog } from "@/components/lesson-complete-dialog"
import {
  Play,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  Target,
  Zap,
  ArrowRight,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { AIPromptTester } from "@/components/ai-prompt-tester"

interface ModuleContentProps {
  moduleId: string
}

export function ModuleContent({ moduleId }: ModuleContentProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userPrompt, setUserPrompt] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)

  const steps = [
    {
      type: "theory",
      title: "Understanding Prompt Structure",
      content:
        "A well-structured prompt typically contains three key components: context, instruction, and format specification.",
    },
    {
      type: "example",
      title: "Example Analysis",
      content:
        "Let's analyze this effective prompt: 'You are a senior developer. Explain how React hooks work to a junior developer. Use simple language and provide code examples.'",
    },
    {
      type: "practice",
      title: "Hands-on Practice",
      content: "Now it's your turn! Create a prompt that asks an AI to help debug a JavaScript function.",
    },
    {
      type: "feedback",
      title: "AI Feedback",
      content: "Great work! Your prompt structure shows good understanding of context and clear instructions.",
    },
  ]

  const currentStepData = steps[currentStep]

  const handleCompleteLesson = () => {
    const score = Math.floor(Math.random() * 30) + 70 // Random score between 70-100
    setShowCompletionDialog(true)
  }

  const handleNextLesson = () => {
    // Navigate to next lesson logic would go here
    console.log("Navigate to next lesson")
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Lesson Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Hands-on: Your First Prompt</h1>
            <p className="text-muted-foreground">Learn by doing - create and test your first AI prompt</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Target className="h-3 w-3" />
            Lesson 4 of 8
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Lesson Progress</span>
            <span>
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="lesson" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lesson">Interactive Lesson</TabsTrigger>
          <TabsTrigger value="playground">AI Playground</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="lesson" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{currentStep + 1}</span>
                </div>
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStepData.type === "theory" && (
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">{currentStepData.content}</p>

                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pro Tip:</strong> Always provide context before giving instructions. This helps the AI
                      understand the role it should take and the audience it's addressing.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">The Three Components:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Context:</strong> "You are a senior developer..."
                      </li>
                      <li>
                        <strong>Instruction:</strong> "Explain how React hooks work..."
                      </li>
                      <li>
                        <strong>Format:</strong> "Use simple language and provide examples..."
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStepData.type === "example" && (
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">{currentStepData.content}</p>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Example Prompt</h4>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Copy className="h-3 w-3" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-background p-3 rounded border text-sm font-mono">
                          "You are a senior developer. Explain how React hooks work to a junior developer. Use simple
                          language and provide code examples."
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <Badge variant="secondary">Context</Badge>
                          <Badge variant="secondary">Instruction</Badge>
                          <Badge variant="secondary">Format</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStepData.type === "practice" && (
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">{currentStepData.content}</p>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Your Prompt:</label>
                    <Textarea
                      placeholder="Write your prompt here... Remember to include context, clear instructions, and format specifications!"
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        className="gap-2"
                        disabled={!userPrompt.trim()}
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        <Zap className="h-4 w-4" />
                        Test Prompt
                      </Button>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {currentStepData.type === "feedback" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-accent">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Excellent work!</span>
                  </div>

                  <p className="text-foreground leading-relaxed">{currentStepData.content}</p>

                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Your Prompt Analysis:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>Clear context provided ✓</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>Specific instructions given ✓</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>Output format specified ✓</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button className="gap-2" onClick={handleCompleteLesson}>
                      <ArrowRight className="h-4 w-4" />
                      Complete Lesson
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <ThumbsDown className="h-4 w-4" />
                      Needs Improvement
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {currentStepData.type !== "feedback" && (
                <div className="flex justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={currentStep === steps.length - 1}>
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playground">
          <AIPromptTester />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>Deepen your understanding with these curated materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-10 w-10 bg-primary/20 rounded flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Prompt Engineering Guide</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive guide to advanced prompting techniques
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="h-10 w-10 bg-accent/20 rounded flex items-center justify-center">
                    <Play className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Video: Prompt Patterns</h4>
                    <p className="text-sm text-muted-foreground">Learn common patterns used by experts</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Watch
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lesson Completion Dialog */}
      <LessonCompleteDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        moduleId={moduleId}
        lessonId="lesson-4"
        lessonTitle="Hands-on: Your First Prompt"
        score={Math.floor(Math.random() * 30) + 70}
        onNext={handleNextLesson}
      />
    </div>
  )
}

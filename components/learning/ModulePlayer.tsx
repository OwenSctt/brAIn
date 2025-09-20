'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Play, CheckCircle, Clock, Star, Bookmark, MessageSquare } from 'lucide-react';
import { ModuleContentStructure, LessonContent } from '@/lib/database/schema';

interface ModulePlayerProps {
  moduleId: string;
  moduleTitle: string;
  moduleDescription: string;
  contentStructure: ModuleContentStructure;
  lessons: Array<{
    id: string;
    title: string;
    description?: string;
    lesson_type: 'video' | 'exercise' | 'sandbox' | 'assessment' | 'reading';
    content: LessonContent;
    order_index: number;
    estimated_duration?: number;
    is_required: boolean;
  }>;
  userProgress?: {
    completed_lessons: string[];
    current_lesson?: string;
    progress_percentage: number;
  };
  onLessonComplete: (lessonId: string, score?: number) => void;
  onProgressUpdate: (lessonId: string, progress: number) => void;
}

export default function ModulePlayer({
  moduleId,
  moduleTitle,
  moduleDescription,
  contentStructure,
  lessons,
  userProgress = { completed_lessons: [], progress_percentage: 0 },
  onLessonComplete,
  onProgressUpdate,
}: ModulePlayerProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const currentLesson = lessons[currentLessonIndex];
  const completedLessons = userProgress.completed_lessons || [];
  const totalLessons = lessons.length;
  const completedCount = completedLessons.length;
  const overallProgress = userProgress.progress_percentage || 0;

  // Initialize current lesson from user progress
  useEffect(() => {
    if (userProgress.current_lesson) {
      const lessonIndex = lessons.findIndex(l => l.id === userProgress.current_lesson);
      if (lessonIndex !== -1) {
        setCurrentLessonIndex(lessonIndex);
      }
    }
  }, [userProgress.current_lesson, lessons]);

  const handleLessonComplete = useCallback((score?: number) => {
    if (currentLesson) {
      onLessonComplete(currentLesson.id, score);
      setLessonProgress(100);
      
      // Auto-advance to next lesson if not the last one
      if (currentLessonIndex < totalLessons - 1) {
        setTimeout(() => {
          setCurrentLessonIndex(prev => prev + 1);
          setLessonProgress(0);
        }, 1000);
      }
    }
  }, [currentLesson, currentLessonIndex, totalLessons, onLessonComplete]);

  const handleProgressUpdate = useCallback((progress: number) => {
    setLessonProgress(progress);
    if (currentLesson) {
      onProgressUpdate(currentLesson.id, progress);
    }
  }, [currentLesson, onProgressUpdate]);

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setLessonProgress(0);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setLessonProgress(0);
    }
  };

  const toggleBookmark = (lessonId: string) => {
    setBookmarkedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const updateNotes = (lessonId: string, note: string) => {
    setNotes(prev => ({ ...prev, [lessonId]: note }));
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'exercise': return <CheckCircle className="w-4 h-4" />;
      case 'sandbox': return <BookOpen className="w-4 h-4" />;
      case 'assessment': return <Star className="w-4 h-4" />;
      case 'reading': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLessonStatus = (lessonId: string, index: number) => {
    if (completedLessons.includes(lessonId)) {
      return 'completed';
    }
    if (index === currentLessonIndex) {
      return 'current';
    }
    if (index < currentLessonIndex) {
      return 'available';
    }
    return 'locked';
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar - Lesson Navigation */}
      <div className="w-80 border-r bg-muted/50 p-4 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{moduleTitle}</h2>
          <p className="text-sm text-muted-foreground">{moduleDescription}</p>
          
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedCount}/{totalLessons} lessons</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">{Math.round(overallProgress)}% complete</p>
          </div>
        </div>

        {/* Lesson List */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Lessons</h3>
          <div className="space-y-1">
            {lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson.id, index);
              const isCompleted = status === 'completed';
              const isCurrent = status === 'current';
              const isLocked = status === 'locked';

              return (
                <div
                  key={lesson.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isCurrent 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : isCompleted
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : isLocked
                      ? 'bg-muted border-muted text-muted-foreground cursor-not-allowed'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => !isLocked && setCurrentLessonIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getLessonIcon(lesson.lesson_type)}
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {lesson.estimated_duration && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.estimated_duration}m</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {lesson.description && (
                    <p className="text-xs text-muted-foreground mt-1">{lesson.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentLesson && (
          <>
            {/* Lesson Header */}
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {getLessonIcon(currentLesson.lesson_type)}
                    <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                    {currentLesson.is_required && (
                      <Badge variant="secondary">Required</Badge>
                    )}
                  </div>
                  {currentLesson.description && (
                    <p className="text-muted-foreground">{currentLesson.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleBookmark(currentLesson.id)}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedLessons.includes(currentLesson.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Open notes modal */}}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Lesson Progress */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Lesson Progress</span>
                  <span>{Math.round(lessonProgress)}%</span>
                </div>
                <Progress value={lessonProgress} className="h-2" />
              </div>
            </div>

            {/* Lesson Content */}
            <div className="flex-1 p-6">
              <Tabs defaultValue="content" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="h-full">
                  <LessonContentRenderer
                    lesson={currentLesson}
                    onProgressUpdate={handleProgressUpdate}
                    onComplete={handleLessonComplete}
                  />
                </TabsContent>

                <TabsContent value="notes" className="h-full">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Notes</h3>
                    <textarea
                      className="w-full h-64 p-4 border rounded-lg resize-none"
                      placeholder="Add your notes for this lesson..."
                      value={notes[currentLesson.id] || ''}
                      onChange={(e) => updateNotes(currentLesson.id, e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="h-full">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Resources</h3>
                    <div className="grid gap-4">
                      {contentStructure.sections?.map((section, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-base">{section}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Additional resources and materials for this section will be available here.
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Navigation Footer */}
            <div className="border-t p-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Lesson {currentLessonIndex + 1} of {totalLessons}
                  </span>
                </div>

                <Button
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === totalLessons - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Lesson Content Renderer Component
interface LessonContentRendererProps {
  lesson: {
    id: string;
    title: string;
    lesson_type: 'video' | 'exercise' | 'sandbox' | 'assessment' | 'reading';
    content: LessonContent;
  };
  onProgressUpdate: (progress: number) => void;
  onComplete: (score?: number) => void;
}

function LessonContentRenderer({ lesson, onProgressUpdate, onComplete }: LessonContentRendererProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    onProgressUpdate(progress);
  }, [progress, onProgressUpdate]);

  const handleProgressChange = (newProgress: number) => {
    setProgress(newProgress);
  };

  const handleComplete = (score?: number) => {
    setProgress(100);
    onComplete(score);
  };

  switch (lesson.lesson_type) {
    case 'video':
      return (
        <VideoLessonContent
          content={lesson.content}
          onProgressChange={handleProgressChange}
          onComplete={handleComplete}
        />
      );
    case 'exercise':
      return (
        <ExerciseLessonContent
          content={lesson.content}
          onProgressChange={handleProgressChange}
          onComplete={handleComplete}
        />
      );
    case 'sandbox':
      return (
        <SandboxLessonContent
          content={lesson.content}
          onProgressChange={handleProgressChange}
          onComplete={handleComplete}
        />
      );
    case 'assessment':
      return (
        <AssessmentLessonContent
          content={lesson.content}
          onProgressChange={handleProgressChange}
          onComplete={handleComplete}
        />
      );
    case 'reading':
      return (
        <ReadingLessonContent
          content={lesson.content}
          onProgressChange={handleProgressChange}
          onComplete={handleComplete}
        />
      );
    default:
      return <div>Unsupported lesson type</div>;
  }
}

// Individual lesson type components (simplified for now)
function VideoLessonContent({ content, onProgressChange, onComplete }: any) {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Video content would be displayed here</p>
          <p className="text-sm text-muted-foreground mt-2">
            URL: {content.video_url || 'No video URL provided'}
          </p>
        </div>
      </div>
      {content.transcript && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Transcript</h4>
          <p className="text-sm">{content.transcript}</p>
        </div>
      )}
    </div>
  );
}

function ExerciseLessonContent({ content, onProgressChange, onComplete }: any) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Instructions</h4>
        <p className="text-sm">{content.instructions}</p>
      </div>
      {content.scenarios?.map((scenario: any, index: number) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-base">Scenario {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">{scenario.task}</p>
            {scenario.hints && (
              <div className="text-xs text-muted-foreground">
                <strong>Hints:</strong> {scenario.hints.join(', ')}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SandboxLessonContent({ content, onProgressChange, onComplete }: any) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">AI Sandbox</h4>
        <p className="text-sm">Interactive AI playground would be displayed here</p>
        <p className="text-xs text-muted-foreground mt-2">
          Available models: {content.ai_models?.join(', ') || 'None specified'}
        </p>
      </div>
    </div>
  );
}

function AssessmentLessonContent({ content, onProgressChange, onComplete }: any) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Assessment</h4>
        <p className="text-sm">Assessment questions would be displayed here</p>
        <p className="text-xs text-muted-foreground mt-2">
          Questions: {content.questions?.length || 0}
        </p>
      </div>
    </div>
  );
}

function ReadingLessonContent({ content, onProgressChange, onComplete }: any) {
  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content.content || 'No content provided' }} />
      </div>
      {content.key_concepts && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Key Concepts</h4>
          <ul className="text-sm space-y-1">
            {content.key_concepts.map((concept: string, index: number) => (
              <li key={index}>• {concept}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { ModulePlayer };

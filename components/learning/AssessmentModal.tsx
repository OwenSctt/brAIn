'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AssessmentQuestions, AssessmentQuestion } from '@/lib/database/schema';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: {
    id: string;
    title: string;
    description?: string;
    questions: AssessmentQuestions;
    time_limit?: number;
    max_attempts: number;
  };
  onComplete: (score: number, maxScore: number, answers: any) => void;
  userAttempts?: number;
}

interface Answer {
  questionId: string;
  answer: string | number | string[];
  isCorrect?: boolean;
  points?: number;
}

export default function AssessmentModal({
  isOpen,
  onClose,
  assessment,
  onComplete,
  userAttempts = 0,
}: AssessmentModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(assessment.time_limit || 0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);

  const currentQuestion = assessment.questions.questions[currentQuestionIndex];
  const totalQuestions = assessment.questions.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    if (!isOpen || !assessment.time_limit || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, assessment.time_limit, timeRemaining]);

  // Initialize answers
  useEffect(() => {
    if (isOpen) {
      const initialAnswers = assessment.questions.questions.map(q => ({
        questionId: q.id,
        answer: q.type === 'multiple_choice' ? -1 : '',
        isCorrect: false,
        points: 0,
      }));
      setAnswers(initialAnswers);
      setTimeRemaining(assessment.time_limit || 0);
      setCurrentQuestionIndex(0);
      setIsSubmitted(false);
      setShowResults(false);
    }
  }, [isOpen, assessment]);

  const handleAnswerChange = (questionId: string, answer: string | number | string[]) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId 
        ? { ...a, answer }
        : a
    ));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    
    // Calculate score
    let totalScore = 0;
    let maxPossibleScore = 0;
    const updatedAnswers = answers.map(answer => {
      const question = assessment.questions.questions.find(q => q.id === answer.questionId);
      if (!question) return answer;

      maxPossibleScore += question.points;
      
      let isCorrect = false;
      let points = 0;

      if (question.type === 'multiple_choice') {
        isCorrect = answer.answer === question.correct_answer;
        points = isCorrect ? question.points : 0;
      } else if (question.type === 'practical' || question.type === 'coding') {
        // For practical/coding questions, we'd need server-side evaluation
        // For now, give partial credit based on answer length/completeness
        const answerLength = String(answer.answer).length;
        points = Math.min(question.points, Math.round((answerLength / 100) * question.points));
        isCorrect = points >= question.points * 0.8;
      }

      totalScore += points;

      return {
        ...answer,
        isCorrect,
        points,
      };
    });

    setAnswers(updatedAnswers);
    setAssessmentScore(totalScore);
    setMaxScore(maxPossibleScore);
    setShowResults(true);
  }, [answers, assessment.questions.questions, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'default';
    if (percentage >= 70) return 'secondary';
    return 'destructive';
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{assessment.title}</span>
            {assessment.time_limit && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className={`font-mono ${timeRemaining < 60 ? 'text-red-600' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </DialogTitle>
          {assessment.description && (
            <p className="text-muted-foreground">{assessment.description}</p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {!showResults ? (
            /* Assessment Questions */
            <div className="space-y-6">
              {currentQuestion && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Question {currentQuestionIndex + 1}</span>
                      <Badge variant="outline">{currentQuestion.points} points</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg">{currentQuestion.question}</p>

                    {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                      <RadioGroup
                        value={answers.find(a => a.questionId === currentQuestion.id)?.answer.toString() || ''}
                        onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
                      >
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {(currentQuestion.type === 'practical' || currentQuestion.type === 'coding') && (
                      <div className="space-y-2">
                        <Label htmlFor={`answer-${currentQuestion.id}`}>Your Answer</Label>
                        <Textarea
                          id={`answer-${currentQuestion.id}`}
                          placeholder="Enter your answer here..."
                          value={answers.find(a => a.questionId === currentQuestion.id)?.answer.toString() || ''}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="min-h-[200px]"
                        />
                      </div>
                    )}

                    {currentQuestion.evaluation_criteria && (
                      <div className="p-3 bg-muted rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Evaluation Criteria</h4>
                        <ul className="text-sm space-y-1">
                          {currentQuestion.evaluation_criteria.map((criteria, index) => (
                            <li key={index}>• {criteria}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <Button onClick={handleNextQuestion}>
                      Next Question
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                      Submit Assessment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span>Assessment Complete</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">
                        <span className={getScoreColor(assessmentScore, maxScore)}>
                          {assessmentScore}
                        </span>
                        <span className="text-muted-foreground"> / {maxScore}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((assessmentScore / maxScore) * 100)}% Score
                      </p>
                    </div>
                    <Badge 
                      variant={getScoreBadgeVariant(assessmentScore, maxScore)}
                      className="text-lg px-4 py-2"
                    >
                      {Math.round((assessmentScore / maxScore) * 100) >= 70 ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Correct Answers</p>
                      <p className="text-lg font-semibold">
                        {answers.filter(a => a.isCorrect).length} / {totalQuestions}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Time Used</p>
                      <p className="text-lg font-semibold">
                        {formatTime((assessment.time_limit || 0) - timeRemaining)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Review */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question Review</h3>
                {assessment.questions.questions.map((question, index) => {
                  const answer = answers.find(a => a.questionId === question.id);
                  return (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                          <span>Question {index + 1}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{question.points} pts</Badge>
                            {answer?.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p>{question.question}</p>
                        
                        {question.type === 'multiple_choice' && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded ${
                                  optionIndex === question.correct_answer
                                    ? 'bg-green-100 border border-green-300'
                                    : answer?.answer === optionIndex
                                    ? 'bg-red-100 border border-red-300'
                                    : 'bg-muted'
                                }`}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}

                        {(question.type === 'practical' || question.type === 'coding') && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Your Answer:</p>
                            <div className="p-3 bg-muted rounded">
                              <p className="text-sm">{answer?.answer || 'No answer provided'}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between text-sm">
                          <span>Points Earned: {answer?.points || 0} / {question.points}</span>
                          <span className={answer?.isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {answer?.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    onComplete(assessmentScore, maxScore, answers);
                    onClose();
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { AssessmentModal };

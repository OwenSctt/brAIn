"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy, Star, ArrowRight } from "lucide-react"
import { progressTracker } from "@/lib/progress"

interface LessonCompleteDialogProps {
  isOpen: boolean
  onClose: () => void
  moduleId: string
  lessonId: string
  lessonTitle: string
  score?: number
  onNext?: () => void
}

export function LessonCompleteDialog({
  isOpen,
  onClose,
  moduleId,
  lessonId,
  lessonTitle,
  score,
  onNext,
}: LessonCompleteDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [xpGained, setXpGained] = useState<number | null>(null)

  const handleComplete = async () => {
    setIsProcessing(true)
    try {
      const result = await progressTracker.markLessonComplete(moduleId, lessonId, score)
      setXpGained(result.xpGained)
    } catch (error) {
      console.error("Failed to mark lesson complete:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = () => {
    onClose()
    if (onNext) {
      onNext()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl text-slate-100">Lesson Complete!</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">{lessonTitle}</h3>
            {score && (
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-slate-300">Score: {score}/100</span>
              </div>
            )}
          </div>

          {xpGained && (
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">+{xpGained} XP</div>
              <p className="text-sm text-slate-400">Experience gained</p>
            </div>
          )}

          <div className="flex gap-3">
            {!xpGained ? (
              <Button
                onClick={handleComplete}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? "Processing..." : "Mark Complete"}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent"
                >
                  Close
                </Button>
                {onNext && (
                  <Button onClick={handleContinue} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Next Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

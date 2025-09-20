import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, Bookmark, Copy, ThumbsUp, ThumbsDown, Star, ArrowLeft, Send } from "lucide-react"

interface PostDetailProps {
  postId: string
}

const comments = [
  {
    id: 1,
    author: { name: "Alex Kim", avatar: "AK", level: 4 },
    timestamp: "1 hour ago",
    content: "This is exactly what I was looking for! The structure is perfect for code reviews.",
    likes: 8,
    isLiked: false,
  },
  {
    id: 2,
    author: { name: "Emma Davis", avatar: "ED", level: 6 },
    timestamp: "2 hours ago",
    content:
      "Great prompt! I've been using a similar approach but your version is much more comprehensive. Thanks for sharing!",
    likes: 12,
    isLiked: true,
  },
  {
    id: 3,
    author: { name: "Tom Wilson", avatar: "TW", level: 3 },
    timestamp: "3 hours ago",
    content: "Would this work for reviewing Python code as well, or is it specifically for JavaScript?",
    likes: 3,
    isLiked: false,
    replies: [
      {
        author: { name: "Sarah Chen", avatar: "SC", level: 5 },
        content: "It works great for any language! I've used it for Python, Java, and even SQL.",
        likes: 5,
      },
    ],
  },
]

export function PostDetail({ postId }: PostDetailProps) {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Community
      </Button>

      {/* Main Post */}
      <Card>
        <CardHeader className="space-y-4">
          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Sarah Chen</p>
                  <Badge variant="outline" className="text-xs">
                    Level 5
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Prompt Master
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <Badge variant="outline">Prompt Sharing</Badge>
          </div>

          {/* Post Content */}
          <div className="space-y-4">
            <CardTitle className="text-2xl">Perfect prompt for code reviews</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              I've been experimenting with this prompt for getting better code reviews from AI. It's been incredibly
              effective! The key is being specific about what you want the AI to focus on, and providing clear structure
              for the feedback.
            </CardDescription>

            {/* Prompt Display */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Shared Prompt:</h4>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Copy className="h-3 w-3" />
                  Copy Prompt
                </Button>
              </div>
              <div className="bg-muted p-6 rounded-lg border">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {`You are a senior software engineer conducting a thorough code review. 

Analyze the following code for:
- Logic errors and potential bugs
- Performance optimizations
- Code readability and maintainability
- Security vulnerabilities
- Best practices adherence

Provide specific, actionable feedback with examples where possible.

[CODE TO REVIEW]`}
                </pre>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span>4.8</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">18 found this helpful</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Used 47 times</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {["code-review", "development", "best-practices"].map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Actions */}
          <div className="flex items-center justify-between py-4 border-t">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2 text-red-500">
                <Heart className="h-4 w-4 fill-current" />
                24
              </Button>

              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />8
              </Button>

              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1">
                <ThumbsUp className="h-3 w-3" />
                Helpful
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <ThumbsDown className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-accent">
                <Bookmark className="h-4 w-4 fill-current" />
                12
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment */}
          <div className="space-y-3">
            <Textarea placeholder="Share your thoughts or ask a question..." className="min-h-[80px]" />
            <div className="flex justify-end">
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{comment.author.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{comment.author.name}</p>
                      <Badge variant="outline" className="text-xs">
                        Level {comment.author.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="gap-1 h-7 px-2">
                        <ThumbsUp className="h-3 w-3" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && (
                  <div className="ml-11 space-y-3">
                    {comment.replies.map((reply, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{reply.author.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-xs">{reply.author.name}</p>
                            <Badge variant="outline" className="text-xs">
                              Level {reply.author.level}
                            </Badge>
                          </div>
                          <p className="text-xs leading-relaxed">{reply.content}</p>
                          <Button variant="ghost" size="sm" className="gap-1 h-6 px-2 text-xs">
                            <ThumbsUp className="h-2 w-2" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

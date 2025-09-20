import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, Bookmark, Copy, ThumbsUp, ThumbsDown, MoreHorizontal, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const posts = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      avatar: "SC",
      level: 5,
      badge: "Prompt Master",
    },
    timestamp: "2 hours ago",
    category: "Prompt Sharing",
    title: "Perfect prompt for code reviews",
    content:
      "I've been experimenting with this prompt for getting better code reviews from AI. It's been incredibly effective!",
    prompt: `You are a senior software engineer conducting a thorough code review. 

Analyze the following code for:
- Logic errors and potential bugs
- Performance optimizations
- Code readability and maintainability
- Security vulnerabilities
- Best practices adherence

Provide specific, actionable feedback with examples where possible.

[CODE TO REVIEW]`,
    tags: ["code-review", "development", "best-practices"],
    likes: 24,
    comments: 8,
    bookmarks: 12,
    isLiked: false,
    isBookmarked: true,
    rating: 4.8,
    helpful: 18,
  },
  {
    id: 2,
    author: {
      name: "Mike Rodriguez",
      avatar: "MR",
      level: 3,
      badge: "AI Explorer",
    },
    timestamp: "4 hours ago",
    category: "Help & Questions",
    title: "How to make AI responses more creative?",
    content:
      "I'm struggling to get creative responses from AI models. My prompts seem to generate very generic outputs. Any tips?",
    tags: ["creativity", "prompting", "help"],
    likes: 15,
    comments: 12,
    bookmarks: 6,
    isLiked: true,
    isBookmarked: false,
    responses: [
      {
        author: "Alex Kim",
        content: "Try adding 'Think outside the box' or 'Be creative and unconventional' to your prompts!",
        likes: 8,
      },
      {
        author: "Emma Davis",
        content: "I use temperature settings around 0.8-0.9 for more creative outputs. Also, try role-playing prompts!",
        likes: 12,
      },
    ],
  },
  {
    id: 3,
    author: {
      name: "Lisa Wang",
      avatar: "LW",
      level: 7,
      badge: "Community Helper",
    },
    timestamp: "6 hours ago",
    category: "Success Stories",
    title: "From beginner to prompt expert in 30 days!",
    content:
      "Just wanted to share my journey. Started with zero AI knowledge and now I'm helping my team optimize their workflows with AI. This community has been amazing!",
    tags: ["success-story", "motivation", "journey"],
    likes: 45,
    comments: 16,
    bookmarks: 23,
    isLiked: true,
    isBookmarked: true,
    achievement: "30-Day Streak",
  },
  {
    id: 4,
    author: {
      name: "David Park",
      avatar: "DP",
      level: 4,
      badge: "Data Wizard",
    },
    timestamp: "8 hours ago",
    category: "Tips & Tricks",
    title: "Chain-of-thought prompting for complex problems",
    content:
      "Here's a technique that's dramatically improved my results for complex reasoning tasks. The key is breaking down the problem step by step.",
    prompt: `Let's solve this step by step:

1. First, let me understand what we're trying to achieve
2. Next, I'll identify the key components
3. Then, I'll work through each component systematically
4. Finally, I'll synthesize the results

Problem: [YOUR COMPLEX PROBLEM HERE]

Step 1: Understanding...`,
    tags: ["chain-of-thought", "reasoning", "advanced"],
    likes: 32,
    comments: 9,
    bookmarks: 28,
    isLiked: false,
    isBookmarked: false,
    rating: 4.9,
    helpful: 25,
  },
]

export function CommunityFeed() {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="space-y-4">
            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{post.author.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{post.author.name}</p>
                    <Badge variant="outline" className="text-xs">
                      Level {post.author.level}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {post.author.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{post.category}</Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Post Content */}
            <div className="space-y-3">
              <CardTitle className="text-lg">{post.title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">{post.content}</CardDescription>

              {/* Achievement Badge */}
              {post.achievement && (
                <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg border border-accent/20">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Achievement Unlocked: {post.achievement}</span>
                </div>
              )}

              {/* Prompt Display */}
              {post.prompt && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Shared Prompt:</h4>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-lg border">
                    <pre className="text-sm whitespace-pre-wrap font-mono">{post.prompt}</pre>
                  </div>
                  {post.rating && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span>{post.rating}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{post.helpful} found this helpful</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Responses Preview */}
            {post.responses && (
              <div className="space-y-3">
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Top Responses:</h4>
                  {post.responses.slice(0, 2).map((response, index) => (
                    <div key={index} className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{response.author}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ThumbsUp className="h-3 w-3" />
                          {response.likes}
                        </div>
                      </div>
                      <p className="text-sm">{response.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className={cn("gap-2", post.isLiked && "text-red-500")}>
                  <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                  {post.likes}
                </Button>

                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </Button>

                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {post.prompt && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      Helpful
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <Button variant="ghost" size="sm" className={cn("gap-2", post.isBookmarked && "text-accent")}>
                  <Bookmark className={cn("h-4 w-4", post.isBookmarked && "fill-current")} />
                  {post.bookmarks}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

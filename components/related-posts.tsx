import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Star } from "lucide-react"

interface RelatedPostsProps {
  postId: string
}

const relatedPosts = [
  {
    id: 2,
    title: "Advanced debugging prompts for complex issues",
    author: { name: "Mike Rodriguez", avatar: "MR" },
    category: "Tips & Tricks",
    likes: 18,
    comments: 5,
    rating: 4.6,
  },
  {
    id: 3,
    title: "How I improved my code quality with AI reviews",
    author: { name: "Lisa Wang", avatar: "LW" },
    category: "Success Stories",
    likes: 32,
    comments: 12,
    rating: 4.9,
  },
  {
    id: 4,
    title: "Best practices for prompt engineering in development",
    author: { name: "David Park", avatar: "DP" },
    category: "Prompt Sharing",
    likes: 25,
    comments: 8,
    rating: 4.7,
  },
]

export function RelatedPosts({ postId }: RelatedPostsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Posts</CardTitle>
        <CardDescription>Other posts you might find helpful</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedPosts.map((post) => (
          <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{post.author.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <h4 className="font-medium text-sm leading-tight">{post.title}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{post.author.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {post.likes}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {post.comments}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  {post.rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Hash, Users, MessageCircle } from "lucide-react"

const trendingTopics = [
  {
    tag: "prompt-engineering",
    posts: 45,
    growth: "+12%",
    description: "Advanced techniques for crafting effective prompts",
  },
  {
    tag: "code-generation",
    posts: 32,
    growth: "+8%",
    description: "Using AI to generate and optimize code",
  },
  {
    tag: "debugging-help",
    posts: 28,
    growth: "+15%",
    description: "Community support for troubleshooting",
  },
  {
    tag: "success-stories",
    posts: 24,
    growth: "+5%",
    description: "Celebrating learning achievements",
  },
  {
    tag: "ai-tools",
    posts: 19,
    growth: "+22%",
    description: "Discovering and sharing AI tools",
  },
]

const activeUsers = [
  { name: "Sarah Chen", avatar: "SC", contributions: 23 },
  { name: "Mike Rodriguez", avatar: "MR", contributions: 18 },
  { name: "Lisa Wang", avatar: "LW", contributions: 15 },
  { name: "David Park", avatar: "DP", contributions: 12 },
]

export function TrendingTopics() {
  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Trending Topics
          </CardTitle>
          <CardDescription>Popular discussions this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={topic.tag} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                  <Badge variant="secondary" className="gap-1">
                    <Hash className="h-3 w-3" />
                    {topic.tag}
                  </Badge>
                </div>
                <Badge variant="outline" className="text-xs text-green-600">
                  {topic.growth}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground pl-6">{topic.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground pl-6">
                <span>{topic.posts} posts</span>
                <span>•</span>
                <span>Active now</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Contributors
          </CardTitle>
          <CardDescription>Most helpful community members this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeUsers.map((user, index) => (
            <div key={user.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-4">#{index + 1}</span>
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xs font-medium">{user.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.contributions} contributions</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Community Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">1.2k</div>
              <p className="text-xs text-muted-foreground">Active Members</p>
            </div>
            <div>
              <div className="text-2xl font-bold">3.4k</div>
              <p className="text-xs text-muted-foreground">Posts Shared</p>
            </div>
            <div>
              <div className="text-2xl font-bold">8.7k</div>
              <p className="text-xs text-muted-foreground">Prompts Shared</p>
            </div>
            <div>
              <div className="text-2xl font-bold">15k</div>
              <p className="text-xs text-muted-foreground">Helpful Votes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

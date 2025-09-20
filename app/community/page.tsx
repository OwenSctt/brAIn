import { CommunityFeed } from "@/components/community-feed"
import { CommunityFilters } from "@/components/community-filters"
import { TrendingTopics } from "@/components/trending-topics"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <div className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-balance">Community</h1>
              <p className="text-muted-foreground text-pretty">
                Share prompts, get feedback, and learn from fellow AI enthusiasts
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Share Prompt
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search community posts..." className="pl-10" />
            </div>
            <CommunityFilters />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            <CommunityFeed />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TrendingTopics />
          </div>
        </div>
      </div>
    </div>
  )
}

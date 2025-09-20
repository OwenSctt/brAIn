import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, TrendingUp } from "lucide-react"

export function CommunityFilters() {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Sort By
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Most Recent</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Most Popular</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Most Helpful</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Most Discussed</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Category
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Post Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>All Posts</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Prompt Sharing</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Help & Questions</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Success Stories</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Tips & Tricks</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" className="gap-2 bg-transparent">
        <TrendingUp className="h-4 w-4" />
        Trending
      </Button>
    </div>
  )
}

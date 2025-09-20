import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

export function ModuleFilters() {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Difficulty
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Difficulty Level</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Beginner</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Intermediate</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Advanced</DropdownMenuCheckboxItem>
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
          <DropdownMenuLabel>Module Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Prompt Engineering</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>AI Tools</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Code Generation</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Data Analysis</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex gap-1">
        <Badge variant="secondary" className="cursor-pointer">
          Beginner
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          Prompt Engineering
        </Badge>
      </div>
    </div>
  )
}

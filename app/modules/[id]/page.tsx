import { ModuleContent } from "@/components/module-content"
import { ModuleSidebar } from "@/components/module-sidebar"

interface ModulePageProps {
  params: {
    id: string
  }
}

export default function ModulePage({ params }: ModulePageProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <ModuleSidebar moduleId={params.id} />
      <main className="flex-1 overflow-hidden">
        <ModuleContent moduleId={params.id} />
      </main>
    </div>
  )
}

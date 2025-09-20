import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Dashboard />
      </main>
    </div>
  )
}

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SettingsIcon } from "lucide-react"
import { DraggableCalculator } from "@/components/draggable-calculator"

export default function SettingsPage() {
  return (
    
          <div className="flex flex-1 flex-col">
            <div className="flex items-center border-b px-6 py-5">
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-6 w-6" />
                <h1 className="text-xl font-semibold">Settings</h1>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid gap-6">
                <div className="rounded-lg border">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold">System Settings</h2>
                    <p className="text-sm text-muted-foreground">Configure your system preferences and application settings.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}
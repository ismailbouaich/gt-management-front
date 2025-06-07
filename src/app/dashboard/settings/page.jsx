import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SettingsIcon } from "lucide-react"
import { DraggableCalculator } from "@/components/draggable-calculator"
import { SettingsPanel } from "@/components/settings-panel"

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
              <SettingsPanel />
            </div>
          </div>
  )
}
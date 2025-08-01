import { ReportsManager } from "@/components/reports-manager"
import { BarChartIcon } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <BarChartIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Reports</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
         <ReportsManager />
        </div>
      </div>
    </div>
  )
}

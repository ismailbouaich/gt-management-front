import { RulerIcon } from "lucide-react"
import UnitsList from "@/components/units-list"

export default function UnitsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <RulerIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Units</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <UnitsList />
      </div>
    </div>
  )
}
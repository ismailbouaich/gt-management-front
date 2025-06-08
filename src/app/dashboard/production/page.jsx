import { FactoryIcon } from "lucide-react"
import { ProductionManager } from "@/components/production-manager"

export default function ProductionPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <FactoryIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Production Management</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <ProductionManager />
      </div>
    </div>
  )
}

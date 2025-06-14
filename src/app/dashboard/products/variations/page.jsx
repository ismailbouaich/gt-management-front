import { VariationManager } from "@/components/variation-manager"

export default function VariationsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <VariationManager />
      </div>
    </div>
  )
}
import UnitDetailView from "@/components/unit-detail-view"
import { ArrowLeft, RulerIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UnitDetailPage({ params }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products/units">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <RulerIcon className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Unit Details</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <UnitDetailView unitId={params.id} />
      </div>
    </div>
  )
}

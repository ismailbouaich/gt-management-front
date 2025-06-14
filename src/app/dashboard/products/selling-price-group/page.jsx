import { DollarSignIcon } from "lucide-react"
import SellingPriceGroupsList from "@/components/selling-price-groups-list"

export default function SellingPriceGroupPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <DollarSignIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Selling Price Groups</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <SellingPriceGroupsList />
      </div>
    </div>
  )
}
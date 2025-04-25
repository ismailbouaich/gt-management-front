import { ClipboardIcon } from "lucide-react"

export default function PurchaseOrderPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <ClipboardIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Purchase Order</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          <div className="rounded-lg border">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Purchase Order Management</h2>
              <p className="text-sm text-muted-foreground">Create and manage purchase orders for suppliers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
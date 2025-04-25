import { ShieldIcon } from "lucide-react"

export default function CustomerGuaranteeChequesPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <ShieldIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Customer Guarantee Cheques</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          <div className="rounded-lg border">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Customer Guarantee Cheques</h2>
              <p className="text-sm text-muted-foreground">Manage guarantee cheques received from customers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
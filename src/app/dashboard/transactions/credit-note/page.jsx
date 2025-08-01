import { ReceiptIcon } from "lucide-react"
import { CreditNoteManager } from "@/components/credit-note-manager"

export default function CreditNotePage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Credit Note</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          <CreditNoteManager />
        </div>
      </div>
    </div>
  )
}
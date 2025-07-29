"use client"

import { ReceiptIcon } from "lucide-react"
import { CreateCreditNoteTransaction } from "@/components/create-credit-note-transaction"

export default function CreditNoteCreatePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Create Credit Note</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <CreateCreditNoteTransaction />
      </div>
    </div>
  )
}

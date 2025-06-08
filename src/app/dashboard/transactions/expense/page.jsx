"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { WalletIcon } from "lucide-react"
import { ExpenseManager } from "@/components/expense-manager"

function ExpensePageContent() {
  const searchParams = useSearchParams()
  const isQuickCreate = searchParams.get("quick") === "true"
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <WalletIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Expense Management</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <ExpenseManager quickCreate={isQuickCreate} />
      </div>
    </div>
  )
}

export default function ExpensePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpensePageContent />
    </Suspense>
  )
}

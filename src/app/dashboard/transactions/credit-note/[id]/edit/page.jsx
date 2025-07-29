"use client"

import { ReceiptIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { use } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreateCreditNoteTransaction } from "@/components/create-credit-note-transaction"
import { getMockDataById } from "@/utils/mock-data"

export default function CreditNoteEditPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [initial, setInitial] = useState(null)

  useEffect(() => {
    const found = getMockDataById('creditNotes', id)
    setInitial(found || null)
  }, [id])

  if (!initial) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Credit Note not found</CardTitle>
            <CardDescription>The requested credit note could not be located.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Edit Credit Note #{initial.reference}</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <CreateCreditNoteTransaction initialData={initial} />
      </div>
    </div>
  )
}

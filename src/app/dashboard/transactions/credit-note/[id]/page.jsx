"use client"

import { CornerUpLeft } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect, useState, use } from "react"
import { Button } from "@/components/ui/button"

const mockCredits = [
  {
    id: 1,
    reference: "CN-001",
    date: "2025-06-07",
    customer: "John Doe",
    reason: "Damaged items",
    amount: 120.5,
    status: "Issued",
    lines: [
      { id: "l1", product: "Notebooks", qty: 5, unit: 4.5 },
      { id: "l2", product: "Markers", qty: 2, unit: 3 },
    ],
  },
  {
    id: 2,
    reference: "CN-002",
    date: "2025-06-13",
    customer: "Acme Corp",
    reason: "Order cancelled",
    amount: 89.99,
    status: "Draft",
    lines: [{ id: "l3", product: "Paper", qty: 10, unit: 2.5 }],
  },
]

export default function CreditNoteShowPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [note, setNote] = useState(null)

  useEffect(() => {
    const found = mockCredits.find((n) => n.id.toString() === id)
    setNote(found || null)
  }, [id])

  if (!note) {
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

  const statusVariant = {
    Draft: "secondary",
    Issued: "warning",
    Refunded: "success",
  }[note.status] || "secondary"

  const currency = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v)

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <CornerUpLeft className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Credit Note {note.reference}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Credit Note Details</CardTitle>
            <CardDescription>Overview</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p>{note.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p>{note.customer}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={statusVariant}>{note.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p>{currency(note.amount)}</p>
            </div>
            {note.reason && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Reason</p>
                <p>{note.reason}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {note.lines.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>{l.product}</TableCell>
                      <TableCell className="text-right">{l.qty}</TableCell>
                      <TableCell className="text-right">{currency(l.unit)}</TableCell>
                      <TableCell className="text-right">{currency(l.qty * l.unit)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

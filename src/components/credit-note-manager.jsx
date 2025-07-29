"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, RefreshCw, Search, Edit, Trash2, Eye, CornerUpLeft } from "lucide-react"
import { toast } from "sonner"

const mockCredits = [
  { id: 1, date: "2025-06-07", reference: "CN-001", customer: "John Doe", amount: 120.5, status: "Issued" },
  { id: 2, date: "2025-06-13", reference: "CN-002", customer: "Acme Corp", amount: 89.99, status: "Draft" },
]

const statusOptions = ["all", "Draft", "Issued", "Refunded"]

export function CreditNoteManager() {
  const router = useRouter()
  const [notes, setNotes] = useState(mockCredits)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = notes.filter((n) => {
    const s = search.toLowerCase()
    const matchSearch = n.reference.toLowerCase().includes(s) || n.customer.toLowerCase().includes(s)
    const matchStatus = statusFilter === "all" || n.status === statusFilter
    return matchSearch && matchStatus
  })

  const getStatusBadge = (status) => {
    const variants = { Issued: "warning", Refunded: "success", Draft: "secondary" }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const handleRefresh = () => toast.message("Data refreshed")
  const handleCreate = () => router.push("/dashboard/transactions/credit-note/create")
  const handleView = (id) => router.push(`/dashboard/transactions/credit-note/${id}`)
  const handleEdit = (id) => router.push(`/dashboard/transactions/credit-note/${id}/edit`)
  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    toast.success("Credit note deleted")
  }

  const total = notes.length
  const issued = notes.filter((n) => n.status === "Issued").length
  const draft = notes.filter((n) => n.status === "Draft").length

  const formatCurrency = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Credit Notes</h2>
          <p className="text-muted-foreground">Manage customer credit notes and refunds</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" /> New Credit Note
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Notes</CardDescription>
            <CardTitle className="text-2xl">{total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Issued</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{issued}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Draft</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{draft}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Credit Notes List</CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "All Status" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell>{n.date}</TableCell>
                    <TableCell>{n.reference}</TableCell>
                    <TableCell>{n.customer}</TableCell>
                    <TableCell className="text-right">{formatCurrency(n.amount)}</TableCell>
                    <TableCell>{getStatusBadge(n.status)}</TableCell>
                    <TableCell className="text-right w-32 space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => handleView(n.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(n.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(n.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

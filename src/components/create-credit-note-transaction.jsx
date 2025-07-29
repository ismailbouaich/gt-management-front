"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function CreateCreditNoteTransaction({ initialData }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    reference: initialData?.reference || "",
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    customer: initialData?.customer || "",
    reason: initialData?.reason || "",
    status: initialData?.status || "Draft",
    amount: initialData?.amount || 0,
  })

  const [customers] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Acme Corp" },
    { id: 3, name: "Jane Smith" },])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically make an API call to save the credit note
    toast.success(initialData ? "Credit note updated successfully" : "Credit note created successfully")
    router.push("/dashboard/transactions/credit-note")
  }

  const handleDateSelect = (date) => {
    setFormData((prev) => ({ ...prev, date }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Credit Note Information</CardTitle>
          <CardDescription>Enter the details for this credit note</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
                placeholder="CN-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Credit Note Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <DatePicker
                    selected={formData.date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select
              value={formData.customer}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, customer: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.name}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: parseFloat(e.target.value) }))}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for credit note"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Issued">Issued</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Void">Void</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Credit Note" : "Create Credit Note"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
} 
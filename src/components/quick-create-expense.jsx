"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircleIcon, CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function QuickCreateExpense({ children }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    vendor: "",
    notes: ""
  })

  const expenseCategories = [
    "Office Supplies",
    "Travel & Transportation", 
    "Meals & Entertainment",
    "Utilities",
    "Rent",
    "Marketing",
    "Software & Subscriptions",
    "Professional Services",
    "Equipment",
    "Insurance",
    "Other"
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.description || !formData.amount || !formData.category) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const expenseData = {
        ...formData,
        date: date.toISOString(),
        amount: parseFloat(formData.amount),
        id: Date.now().toString()
      }
      
      console.log("Creating expense:", expenseData)
      
      toast.success(`Expense "${formData.description}" has been created successfully!`)
      
      // Reset form
      setFormData({
        description: "",
        amount: "",
        category: "",
        vendor: "",
        notes: ""
      })
      setDate(new Date())
      setOpen(false)
      
    } catch (error) {
      toast.error("Failed to create expense. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircleIcon className="h-5 w-5" />
            Quick Create Expense
          </DialogTitle>
          <DialogDescription>
            Create a new expense entry quickly. You can add more details later in the Expense Manager.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Enter expense description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor/Supplier</Label>
            <Input
              id="vendor"
              placeholder="Enter vendor name"
              value={formData.vendor}
              onChange={(e) => handleInputChange("vendor", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes (optional)"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

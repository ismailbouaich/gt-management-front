"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  Receipt,
  Wallet
} from "lucide-react"
import { format } from "date-fns"

export function ExpenseManager({ quickCreate = false }) {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: new Date(),
      category: "Office Supplies",
      description: "Stationery and office materials",
      amount: 150.00,
      paymentMethod: "Cash",
      vendor: "Office Depot",
      status: "Approved",
      receipt: "RCP-001"
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000),
      category: "Utilities",
      description: "Monthly electricity bill",
      amount: 320.50,
      paymentMethod: "Bank Transfer",
      vendor: "City Electric Company",
      status: "Pending",
      receipt: "RCP-002"
    },
    {
      id: 3,
      date: new Date(Date.now() - 172800000),
      category: "Travel",
      description: "Business trip to client meeting",
      amount: 85.25,
      paymentMethod: "Credit Card",
      vendor: "Uber",
      status: "Approved",
      receipt: "RCP-003"
    }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  // Auto-open dialog for quick create mode
  useEffect(() => {
    if (quickCreate) {
      setIsDialogOpen(true)
      setEditingExpense(null)
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        category: "",
        description: "",
        amount: "",
        paymentMethod: "",
        vendor: "",
        status: "Pending"
      })
    }
  }, [quickCreate])

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: "",
    description: "",
    amount: "",
    paymentMethod: "",
    vendor: "",
    status: "Pending"
  })

  const categories = [
    "Office Supplies",
    "Utilities",
    "Travel",
    "Marketing",
    "Equipment",
    "Software",
    "Rent",
    "Insurance",
    "Legal",
    "Other"
  ]

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Check",
    "Digital Wallet"
  ]

  const statusOptions = [
    "Pending",
    "Approved",
    "Rejected",
    "Paid"
  ]
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || filterCategory === "all" || expense.category === filterCategory
    const matchesStatus = !filterStatus || filterStatus === "all" || expense.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!newExpense.category || newExpense.category === "placeholder") {
      alert("Please select a category")
      return
    }
    if (!newExpense.paymentMethod || newExpense.paymentMethod === "placeholder") {
      alert("Please select a payment method")
      return
    }
    
    if (editingExpense) {
      setExpenses(prev => prev.map(expense => 
        expense.id === editingExpense.id 
          ? { 
              ...editingExpense, 
              ...newExpense, 
              amount: parseFloat(newExpense.amount),
              date: new Date(newExpense.date)
            }
          : expense
      ))
      setEditingExpense(null)
    } else {
      const expense = {
        id: Math.max(...expenses.map(e => e.id), 0) + 1,
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        date: new Date(newExpense.date),
        receipt: `RCP-${String(Math.max(...expenses.map(e => e.id), 0) + 1).padStart(3, '0')}`
      }
      setExpenses(prev => [...prev, expense])
    }
    
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: "",
      description: "",
      amount: "",
      paymentMethod: "",
      vendor: "",
      status: "Pending"
    })
    setIsDialogOpen(false)
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setNewExpense({
      date: format(expense.date, 'yyyy-MM-dd'),
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      paymentMethod: expense.paymentMethod,
      vendor: expense.vendor,
      status: expense.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Rejected": return "bg-red-100 text-red-800"
      case "Paid": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const exportExpenses = () => {
    const csvContent = [
      ["Date", "Category", "Description", "Amount", "Payment Method", "Vendor", "Status", "Receipt"],
      ...filteredExpenses.map(expense => [
        format(expense.date, 'yyyy-MM-dd'),
        expense.category,
        expense.description,
        expense.amount,
        expense.paymentMethod,
        expense.vendor,
        expense.status,
        expense.receipt
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredExpenses.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredExpenses.filter(e => e.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredExpenses.filter(e => e.status === "Approved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredExpenses
                .filter(e => e.date.getMonth() === new Date().getMonth())
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current month total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Expense Management
              </CardTitle>
              <CardDescription>
                Track and manage your business expenses
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportExpenses}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingExpense(null)
                    setNewExpense({
                      date: new Date().toISOString().split('T')[0],
                      category: "",
                      description: "",
                      amount: "",
                      paymentMethod: "",
                      vendor: "",
                      status: "Pending"
                    })
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingExpense ? "Edit Expense" : "Add New Expense"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingExpense 
                        ? "Update the expense details below." 
                        : "Enter the details for the new expense."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newExpense.category || "placeholder"}
                            onValueChange={(value) => setNewExpense({...newExpense, category: value === "placeholder" ? "" : value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentMethod">Payment Method</Label>
                          <Select
                            value={newExpense.paymentMethod || "placeholder"}
                            onValueChange={(value) => setNewExpense({...newExpense, paymentMethod: value === "placeholder" ? "" : value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vendor">Vendor</Label>
                          <Input
                            id="vendor"
                            value={newExpense.vendor}
                            onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                            required
                          />
                        </div>                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={newExpense.status}
                            onValueChange={(value) => setNewExpense({...newExpense, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newExpense.description}
                          onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingExpense ? "Update" : "Add"} Expense
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>            <Select value={filterCategory || "all"} onValueChange={(value) => setFilterCategory(value === "all" ? "" : value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus || "all"} onValueChange={(value) => setFilterStatus(value === "all" ? "" : value)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expenses Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {format(expense.date, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {expense.description}
                    </TableCell>
                    <TableCell>{expense.vendor}</TableCell>
                    <TableCell className="font-medium">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{expense.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(expense.status)}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expenses found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

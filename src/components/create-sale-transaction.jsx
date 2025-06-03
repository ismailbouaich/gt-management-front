"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Calendar,
  Trash2,
  Plus,
  Save,
  Search,
  CreditCard,
  BarcodeIcon,
  UserPlus,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Mock data for products with more details
const mockProducts = [
  {
    id: 1,
    name: "Premium T-Shirt",
    sell_price: 29.99,
    tax_rate: 10,
    sku: "TS-001",
    image: "/placeholder.svg?height=50&width=50",
    description: "High-quality cotton t-shirt",
    stock_quantity: 45,
    category: "Apparel",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    sell_price: 199.99,
    tax_rate: 10,
    sku: "WH-100",
    image: "/placeholder.svg?height=50&width=50",
    description: "Noise-cancelling wireless headphones",
    stock_quantity: 12,
    category: "Electronics",
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    sell_price: 249.99,
    tax_rate: 5,
    sku: "FN-200",
    image: "/placeholder.svg?height=50&width=50",
    description: "Adjustable office chair with lumbar support",
    stock_quantity: 8,
    category: "Furniture",
  },
  {
    id: 4,
    name: "Smartphone Case",
    sell_price: 19.99,
    tax_rate: 10,
    sku: "AC-300",
    image: "/placeholder.svg?height=50&width=50",
    description: "Protective case for smartphones",
    stock_quantity: 120,
    category: "Accessories",
  },
  {
    id: 5,
    name: "Laptop Backpack",
    sell_price: 59.99,
    tax_rate: 10,
    sku: "BP-100",
    image: "/placeholder.svg?height=50&width=50",
    description: "Water-resistant backpack with laptop compartment",
    stock_quantity: 25,
    category: "Bags",
  },
  {
    id: 6,
    name: "Smart Watch",
    sell_price: 299.99,
    tax_rate: 10,
    sku: "SW-200",
    image: "/placeholder.svg?height=50&width=50",
    description: "Fitness and health tracking smartwatch",
    stock_quantity: 15,
    category: "Electronics",
  },
]

export function CreateSaleTransaction() {
  const [activeTab, setActiveTab] = useState("products")
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [locations, setLocations] = useState([])
  const [items, setItems] = useState([])
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    shipping: 0,
    total: 0,
  })
  const [formData, setFormData] = useState({
    business_id: 1,
    location_id: "",
    type: "sell",
    status: "completed",
    payment_status: "due",
    contact_id: "",
    transaction_date: new Date().toISOString().split("T")[0],
    total_before_tax: 0,
    tax_amount: 0,
    discount_type: "fixed",
    discount_amount: 0,
    shipping_charges: 0,
    shipping_details: "",
    shipping_address: "",
    shipping_status: "pending",
    final_total: 0,
    additional_notes: "",
    staff_note: "",
    payment_method: "cash",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openProductSearch, setOpenProductSearch] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [scannedBarcode, setScannedBarcode] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isFormValid, setIsFormValid] = useState(false)

  // Mock data fetching
  useEffect(() => {
    // Fetch customers
    setCustomers([
      { id: 1, name: "John Doe", email: "john@example.com", phone: "555-1234", balance: 0 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "555-5678", balance: 120.5 },
      { id: 3, name: "Acme Corporation", email: "info@acme.com", phone: "555-9012", balance: 2500.75 },
      { id: 4, name: "Tech Solutions Inc.", email: "contact@techsolutions.com", phone: "555-3456", balance: 0 },
      { id: 5, name: "Global Enterprises", email: "sales@globalent.com", phone: "555-7890", balance: 750.25 },
    ])

    // Fetch products
    setProducts(mockProducts)

    // Fetch locations
    setLocations([
      { id: 1, name: "Main Store", address: "123 Main St, Anytown, USA" },
      { id: 2, name: "Warehouse", address: "456 Industrial Pkwy, Anytown, USA" },
      { id: 3, name: "Downtown Branch", address: "789 Center Ave, Anytown, USA" },
    ])

    // Set recent products (normally would be fetched from API)
    setRecentProducts(mockProducts.slice(0, 3))
  }, [])

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [products, searchQuery])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Recalculate totals if discount or shipping changes
    if (name === "discount_amount" || name === "shipping_charges") {
      calculateTotals(items, {
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })

    // If customer changes, update selected customer
    if (name === "contact_id") {
      const customer = customers.find((c) => c.id.toString() === value)
      setSelectedCustomer(customer || null)
    }

    // Recalculate totals if discount type changes
    if (name === "discount_type") {
      calculateTotals(items, {
        ...formData,
        [name]: value,
      })
    }
  }

  // Add new line item
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        product_id: "",
        variation_id: null,
        quantity: 1,
        unit_price: 0,
        item_tax: 0,
        discount_type: "fixed",
        discount_amount: 0,
        subtotal: 0,
        searchTerm: "",
      },
    ])
  }

  // Remove line item
  const removeItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId))
    calculateTotals(
      items.filter((item) => item.id !== itemId),
      formData,
    )
  }

  // Handle line item change
  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // If product_id changed, update price, tax, and set the search term to the product name
        if (field === "product_id") {
          const product = products.find((p) => p.id === Number.parseInt(value))
          if (product) {
            updatedItem.unit_price = product.sell_price
            updatedItem.item_tax = ((product.sell_price * product.tax_rate) / 100) * updatedItem.quantity
            updatedItem.subtotal = product.sell_price * updatedItem.quantity
            updatedItem.product = product

            // If search term isn't already set to product name, update it
            if (updatedItem.searchTerm !== product.name) {
              updatedItem.searchTerm = product.name
            }
          }
        }

        // If quantity or unit_price changed, recalculate subtotal and tax
        if (
          field === "quantity" ||
          field === "unit_price" ||
          field === "discount_amount" ||
          field === "discount_type"
        ) {
          const product = products.find((p) => p.id === Number.parseInt(updatedItem.product_id))
          if (product) {
            // Calculate item discount
            let itemDiscount = 0
            if (updatedItem.discount_type === "fixed") {
              itemDiscount = updatedItem.discount_amount || 0
            } else if (updatedItem.discount_type === "percentage") {
              const basePrice = updatedItem.unit_price * updatedItem.quantity
              itemDiscount = basePrice * ((updatedItem.discount_amount || 0) / 100)
            }

            const baseSubtotal = updatedItem.unit_price * updatedItem.quantity
            updatedItem.subtotal = baseSubtotal - itemDiscount
            updatedItem.item_tax = (updatedItem.subtotal * product.tax_rate) / 100
          }
        }

        return updatedItem
      }
      return item
    })

    setItems(updatedItems)
    calculateTotals(updatedItems, formData)
  }

  // Calculate totals
  const calculateTotals = (itemsList, currentFormData) => {
    const subtotal = itemsList.reduce((sum, item) => sum + (item.subtotal || 0), 0)
    const tax = itemsList.reduce((sum, item) => sum + (item.item_tax || 0), 0)

    // Calculate transaction discount
    let transactionDiscount = 0
    if (currentFormData.discount_type === "fixed") {
      transactionDiscount = currentFormData.discount_amount || 0
    } else if (currentFormData.discount_type === "percentage") {
      transactionDiscount = subtotal * ((currentFormData.discount_amount || 0) / 100)
    }

    const shipping = currentFormData.shipping_charges || 0
    const total = subtotal + tax - transactionDiscount + shipping

    setTotals({
      subtotal,
      tax,
      discount: transactionDiscount,
      shipping,
      total,
    })
  }

  // Validate the form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.contact_id) {
      newErrors.contact_id = "Customer is required"
    }

    if (!formData.location_id) {
      newErrors.location_id = "Location is required"
    }

    if (!formData.transaction_date) {
      newErrors.transaction_date = "Date is required"
    }

    if (items.length === 0) {
      newErrors.items = "At least one product must be added"
    } else {
      const invalidItems = items.filter((item) => !item.product_id || item.quantity <= 0)
      if (invalidItems.length > 0) {
        newErrors.items = "All products must have valid product and quantity"
      }
    }

    if (formData.shipping_charges > 0 && !formData.shipping_address) {
      newErrors.shipping_address = "Shipping address is required when shipping charges are applied"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check form validity on changes
  useEffect(() => {
    const isValid =
      formData.contact_id &&
      formData.location_id &&
      formData.transaction_date &&
      items.length > 0 &&
      !items.some((item) => !item.product_id || item.quantity <= 0) &&
      !(formData.shipping_charges > 0 && !formData.shipping_address)

    setIsFormValid(isValid)
  }, [formData, items])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix the errors in the form before submitting.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare the final data for submission
      const submitData = {
        ...formData,
        total_before_tax: totals.subtotal,
        tax_amount: totals.tax,
        discount_amount: totals.discount,
        shipping_charges: totals.shipping,
        final_total: totals.total,
        lines: items.map((item) => ({
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_type: item.discount_type,
          discount_amount: item.discount_amount,
          item_tax: item.item_tax,
          subtotal: item.subtotal,
        })),
      }

      console.log("Form data to submit:", submitData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      toast.success("Sale Created Successfully", {
        description: `Sale #${Math.floor(Math.random() * 10000)} has been created.`,
      })

      // Reset form or redirect
      // For demo purposes, we'll just show the payment dialog
      if (formData.payment_status !== "paid") {
        setShowPaymentDialog(true)
      }
    } catch (error) {
      console.error("Error creating sale:", error)
      toast.error("Error", {
        description: "Failed to create sale. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding a new customer
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Validation Error", {
        description: "Name and phone are required for new customers.",
      })
      return
    }

    // Simulate adding a new customer
    const newCustomerId = customers.length + 1
    const customerToAdd = {
      id: newCustomerId,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      balance: 0,
    }

    setCustomers([...customers, customerToAdd])
    setFormData({
      ...formData,
      contact_id: newCustomerId.toString(),
    })
    setSelectedCustomer(customerToAdd)
    setShowAddCustomer(false)
    setNewCustomer({ name: "", email: "", phone: "", address: "" })

    toast.success("Customer Added", {
      description: `${newCustomer.name} has been added successfully.`,
    })
  }

  // Handle barcode scanning
  const handleBarcodeSubmit = () => {
    if (!scannedBarcode) return

    // Find product by SKU (simulating barcode)
    const product = products.find((p) => p.sku === scannedBarcode)

    if (product) {
      // Check if product is already in the cart
      const existingItemIndex = items.findIndex((item) => item.product_id === product.id.toString())

      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        const updatedItems = [...items]
        updatedItems[existingItemIndex].quantity += 1

        // Recalculate subtotal and tax
        const item = updatedItems[existingItemIndex]
        item.subtotal = item.unit_price * item.quantity
        item.item_tax = ((item.unit_price * product.tax_rate) / 100) * item.quantity

        setItems(updatedItems)
        calculateTotals(updatedItems, formData)
      } else {
        // Add new item
        const newItem = {
          id: Date.now(),
          product_id: product.id.toString(),
          variation_id: null,
          quantity: 1,
          unit_price: product.sell_price,
          item_tax: (product.sell_price * product.tax_rate) / 100,
          discount_type: "fixed",
          discount_amount: 0,
          subtotal: product.sell_price,
          searchTerm: product.name,
          product,
        }

        const updatedItems = [...items, newItem]
        setItems(updatedItems)
        calculateTotals(updatedItems, formData)
      }

      toast.success("Product Added", {
        description: `${product.name} has been added to the cart.`,
      })
    } else {
      toast.error("Product Not Found", {
        description: `No product found with barcode/SKU: ${scannedBarcode}`,
      })
    }

    setScannedBarcode("")
    setShowBarcodeScanner(false)
  }

  // Handle payment processing
  const handleProcessPayment = () => {
    const amount = Number.parseFloat(paymentAmount)

    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid Amount", {
        description: "Please enter a valid payment amount.",
      })
      return
    }

    if (amount < totals.total) {
      setFormData({
        ...formData,
        payment_status: "partial",
      })

      toast.success("Partial Payment Received", {
        description: `$${amount.toFixed(2)} has been received. Remaining: $${(totals.total - amount).toFixed(2)}`,
      })
    } else {
      setFormData({
        ...formData,
        payment_status: "paid",
      })

      toast.success("Payment Complete", {
        description: `Full payment of $${amount.toFixed(2)} has been received.`,
      })
    }

    setShowPaymentDialog(false)
  }

  // Add product from recent/quick add section
  const addRecentProduct = (product) => {
    // Check if product is already in the cart
    const existingItemIndex = items.findIndex((item) => item.product_id === product.id.toString())

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      const updatedItems = [...items]
      updatedItems[existingItemIndex].quantity += 1

      // Recalculate subtotal and tax
      const item = updatedItems[existingItemIndex]
      item.subtotal = item.unit_price * item.quantity
      item.item_tax = ((item.unit_price * product.tax_rate) / 100) * item.quantity

      setItems(updatedItems)
      calculateTotals(updatedItems, formData)
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        product_id: product.id.toString(),
        variation_id: null,
        quantity: 1,
        unit_price: product.sell_price,
        item_tax: (product.sell_price * product.tax_rate) / 100,
        discount_type: "fixed",
        discount_amount: 0,
        subtotal: product.sell_price,
        searchTerm: product.name,
        product,
      }

      const updatedItems = [...items, newItem]
      setItems(updatedItems)
      calculateTotals(updatedItems, formData)
    }

    toast.success("Product Added", {
      description: `${product.name} has been added to the cart.`,
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customer">Customer & Shipping</TabsTrigger>
            <TabsTrigger value="summary">Summary & Payment</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarcodeIcon className="mr-2 h-4 w-4" />
                  Scan Barcode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan Product Barcode</DialogTitle>
                  <DialogDescription>Enter the barcode or SKU to quickly add a product.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter barcode/SKU..."
                      value={scannedBarcode}
                      onChange={(e) => setScannedBarcode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleBarcodeSubmit}>
                      <Search className="h-4 w-4 mr-2" />
                      Find
                    </Button>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>For demo purposes, try these SKUs:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {products.slice(0, 3).map((product) => (
                        <Badge
                          key={product.sku}
                          variant="outline"
                          className="cursor-pointer"
                          onClick={() => setScannedBarcode(product.sku || "")}
                        >
                          {product.sku}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="default" onClick={handleSubmit} disabled={isSubmitting || !isFormValid}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Sale"}
            </Button>
          </div>
        </div>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Add products to this sale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Line Items</h3>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {errors.items && <p className="mb-2 text-sm text-destructive">{errors.items}</p>}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No items added. Click "Add Item" to add products.
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Popover
                                open={openProductSearch === item.id}
                                onOpenChange={(open) => {
                                  setOpenProductSearch(open ? item.id : null)
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <div className="relative flex items-center">
                                    <Input
                                      placeholder="Search products..."
                                      value={item.searchTerm}
                                      onChange={(e) => {
                                        handleItemChange(item.id, "searchTerm", e.target.value)
                                      }}
                                      className="w-full"
                                    />
                                    <Search className="absolute right-2 h-4 w-4 text-muted-foreground" />
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-80" align="start" side="bottom" sideOffset={5}>
                                  <Command>
                                    <CommandInput placeholder="Search products..." />
                                    <CommandList>
                                      <CommandEmpty>No products found</CommandEmpty>
                                      <CommandGroup>
                                        {products
                                          .filter((product) =>
                                            product.name.toLowerCase().includes((item.searchTerm || "").toLowerCase()),
                                          )
                                          .map((product) => (
                                            <CommandItem
                                              key={product.id}
                                              onSelect={() => {
                                                handleItemChange(item.id, "product_id", product.id.toString())
                                                handleItemChange(item.id, "searchTerm", product.name)
                                                setOpenProductSearch(null)
                                              }}
                                              className="flex items-center gap-2 p-2"
                                            >
                                              {product.image && (
                                                <img
                                                  src={product.image || "/placeholder.svg"}
                                                  alt={product.name}
                                                  className="h-8 w-8 rounded object-cover"
                                                />
                                              )}
                                              <div className="flex flex-col">
                                                <span>{product.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                  ${product.sell_price.toFixed(2)} • SKU: {product.sku}
                                                </span>
                                              </div>
                                            </CommandItem>
                                          ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(item.id, "quantity", Number.parseInt(e.target.value) || 1)
                                }
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unit_price}
                                onChange={(e) =>
                                  handleItemChange(item.id, "unit_price", Number.parseFloat(e.target.value) || 0)
                                }
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={item.discount_type}
                                  onValueChange={(value) => handleItemChange(item.id, "discount_type", value)}
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                    <SelectItem value="percentage">%</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  type="number"
                                  min="0"
                                  step={item.discount_type === "percentage" ? "1" : "0.01"}
                                  value={item.discount_amount}
                                  onChange={(e) =>
                                    handleItemChange(item.id, "discount_amount", Number.parseFloat(e.target.value) || 0)
                                  }
                                  className="w-20"
                                />
                              </div>
                            </TableCell>
                            <TableCell>${item.item_tax.toFixed(2)}</TableCell>
                            <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove item</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Quick Add Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="flex items-center p-4">
                        {product.image && (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-12 w-12 rounded object-cover mr-3"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">${product.sell_price.toFixed(2)}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => addRecentProduct(product)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer & Shipping</CardTitle>
              <CardDescription>Select customer and enter shipping details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contact_id">
                      Customer <span className="text-destructive">*</span>
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddCustomer(true)}
                      className="h-8 px-2 text-xs"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      New Customer
                    </Button>
                  </div>
                  <Select
                    value={formData.contact_id}
                    onValueChange={(value) => handleSelectChange("contact_id", value)}
                  >
                    <SelectTrigger
                      id="contact_id"
                      className={cn(errors.contact_id && "border-destructive ring-destructive")}
                    >
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.contact_id && <p className="text-sm text-destructive">{errors.contact_id}</p>}

                  {selectedCustomer && (
                    <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                      <div className="font-medium">{selectedCustomer.name}</div>
                      {selectedCustomer.email && <div>{selectedCustomer.email}</div>}
                      {selectedCustomer.phone && <div>{selectedCustomer.phone}</div>}
                      {selectedCustomer.balance > 0 && (
                        <div className="mt-1 text-destructive">
                          Outstanding Balance: ${selectedCustomer.balance.toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Location Selection */}
                <div className="space-y-2">
                  <Label htmlFor="location_id">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.location_id}
                    onValueChange={(value) => handleSelectChange("location_id", value)}
                  >
                    <SelectTrigger
                      id="location_id"
                      className={cn(errors.location_id && "border-destructive ring-destructive")}
                    >
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id.toString()}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location_id && <p className="text-sm text-destructive">{errors.location_id}</p>}
                </div>

                {/* Transaction Date */}
                <div className="space-y-2">
                  <Label htmlFor="transaction_date">
                    Date <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      id="transaction_date"
                      name="transaction_date"
                      value={formData.transaction_date}
                      onChange={handleInputChange}
                      className={cn(errors.transaction_date && "border-destructive ring-destructive")}
                    />
                    <Calendar className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.transaction_date && <p className="text-sm text-destructive">{errors.transaction_date}</p>}
                </div>

                {/* Status Selection */}
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Shipping Details</h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="shipping-toggle"
                      checked={formData.shipping_charges > 0}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          shipping_charges: checked ? 10 : 0,
                        })
                        calculateTotals(items, {
                          ...formData,
                          shipping_charges: checked ? 10 : 0,
                        })
                      }}
                    />
                    <Label htmlFor="shipping-toggle">Add Shipping</Label>
                  </div>
                </div>

                {formData.shipping_charges > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="shipping_address">
                        Shipping Address <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="shipping_address"
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={handleInputChange}
                        placeholder="Enter shipping address"
                        className={cn(errors.shipping_address && "border-destructive ring-destructive")}
                      />
                      {errors.shipping_address && <p className="text-sm text-destructive">{errors.shipping_address}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping_details">Shipping Details</Label>
                      <Textarea
                        id="shipping_details"
                        name="shipping_details"
                        value={formData.shipping_details}
                        onChange={handleInputChange}
                        placeholder="Enter shipping instructions or details"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping_charges">Shipping Charges ($)</Label>
                      <Input
                        type="number"
                        id="shipping_charges"
                        name="shipping_charges"
                        min="0"
                        step="0.01"
                        value={formData.shipping_charges}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping_status">Shipping Status</Label>
                      <Select
                        value={formData.shipping_status}
                        onValueChange={(value) => handleSelectChange("shipping_status", value)}
                      >
                        <SelectTrigger id="shipping_status">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="packed">Packed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add Customer Dialog */}
          <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>Enter customer details to create a new customer record.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-customer-name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="new-customer-name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-customer-email">Email</Label>
                  <Input
                    id="new-customer-email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  />
                  
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-customer-phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="new-customer-phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-customer-address">Address</Label>
                  <Textarea
                    id="new-customer-address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddCustomer(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomer}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary & Payment</CardTitle>
              <CardDescription>Review and finalize your sale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sale Summary</h3>

                  {/* Items Summary */}
                  <div className="rounded-md border mb-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No items added.
                            </TableCell>
                          </TableRow>
                        ) : (
                          items.map((item) => {
                            const product = products.find((p) => p.id.toString() === item.product_id)
                            return (
                              <TableRow key={item.id}>
                                <TableCell>{item.searchTerm}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Customer & Location Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Customer</h4>
                      {selectedCustomer ? (
                        <div className="text-sm">
                          <p>{selectedCustomer.name}</p>
                          {selectedCustomer.phone && <p>{selectedCustomer.phone}</p>}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No customer selected</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Location</h4>
                      {formData.location_id ? (
                        <p className="text-sm">
                          {locations.find((l) => l.id.toString() === formData.location_id)?.name}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No location selected</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Date</h4>
                      <p className="text-sm">{formData.transaction_date}</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Status</h4>
                      <div className="flex items-center">
                        {formData.status === "completed" ? (
                          <Badge className="bg-green-500">Completed</Badge>
                        ) : formData.status === "pending" ? (
                          <Badge className="bg-yellow-500">Pending</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {formData.shipping_charges > 0 && (
                    <div className="mb-4 p-3 bg-muted rounded-md">
                      <h4 className="text-sm font-medium mb-1">Shipping Information</h4>
                      <p className="text-sm">{formData.shipping_address}</p>
                      {formData.shipping_details && (
                        <p className="text-sm text-muted-foreground mt-1">{formData.shipping_details}</p>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {(formData.additional_notes || formData.staff_note) && (
                    <div className="space-y-3">
                      {formData.additional_notes && (
                        <div>
                          <h4 className="text-sm font-medium">Customer Notes</h4>
                          <p className="text-sm text-muted-foreground">{formData.additional_notes}</p>
                        </div>
                      )}

                      {formData.staff_note && (
                        <div>
                          <h4 className="text-sm font-medium">Staff Notes</h4>
                          <p className="text-sm text-muted-foreground">{formData.staff_note}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Details</h3>

                  {/* Payment Method */}
                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <RadioGroup
                        value={formData.payment_method}
                        onValueChange={(value) => handleSelectChange("payment_method", value)}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="payment-cash" />
                          <Label htmlFor="payment-cash" className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <rect width="20" height="12" x="2" y="6" rx="2" />
                              <circle cx="12" cy="12" r="2" />
                              <path d="M6 12h.01M18 12h.01" />
                            </svg>
                            Cash
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="payment-card" />
                          <Label htmlFor="payment-card" className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank_transfer" id="payment-bank" />
                          <Label htmlFor="payment-bank" className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-2"
                            >
                              <rect width="20" height="14" x="2" y="5" rx="2" />
                              <line x1="2" x2="22" y1="10" y2="10" />
                            </svg>
                            Bank Transfer
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment_status">Payment Status</Label>
                      <Select
                        value={formData.payment_status}
                        onValueChange={(value) => handleSelectChange("payment_status", value)}
                      >
                        <SelectTrigger id="payment_status">
                          <SelectValue placeholder="Select Payment Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="due">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-amber-500" />
                              <span>Due</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="partial">
                            <div className="flex items-center">
                              <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                              <span>Partial</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="paid">
                            <div className="flex items-center">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                              <span>Paid</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Transaction Discount */}
                  <div className="space-y-2 mb-6">
                    <Label>Transaction Discount</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={formData.discount_type}
                        onValueChange={(value) => handleSelectChange("discount_type", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        name="discount_amount"
                        min="0"
                        step={formData.discount_type === "percentage" ? "1" : "0.01"}
                        value={formData.discount_amount}
                        onChange={handleInputChange}
                        className="w-32"
                      />
                    </div>
                  </div>

                  {/* Totals */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax:</span>
                          <span>${totals.tax.toFixed(2)}</span>
                        </div>
                        {totals.discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount:</span>
                            <span>-${totals.discount.toFixed(2)}</span>
                          </div>
                        )}
                        {totals.shipping > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Shipping:</span>
                            <span>${totals.shipping.toFixed(2)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>${totals.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("products")}>
                Back to Products
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !isFormValid}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Creating..." : "Create Sale"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Enter payment details to complete this transaction.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between font-medium text-lg">
              <span>Total Amount:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-amount">Payment Amount</Label>
              <Input
                id="payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => handleSelectChange("payment_method", value)}
              >
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Skip Payment
            </Button>
            <Button onClick={handleProcessPayment}>
              <Receipt className="mr-2 h-4 w-4" />
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

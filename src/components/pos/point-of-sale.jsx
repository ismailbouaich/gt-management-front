"use client"

import { useState, useEffect } from "react"
import {
  SearchIcon,
  ShoppingCartIcon,
  PlusIcon,
  TrashIcon,
  PercentIcon,
  LayoutGridIcon,
  ListIcon as ListViewIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ProductGrid } from "./product-grid"
import { CartItem } from "./cart-item"
import { PaymentModal } from "./payment-modal"
import { CustomerSelect } from "./customer-select"

// Sample product data
const sampleProducts = [
  { id: 1, name: "T-Shirt", price: 19.99, category: "Clothing", image: "/placeholder.svg?height=80&width=80" },
  { id: 2, name: "Jeans", price: 49.99, category: "Clothing", image: "/placeholder.svg?height=80&width=80" },
  { id: 3, name: "Sneakers", price: 79.99, category: "Footwear", image: "/placeholder.svg?height=80&width=80" },
  { id: 4, name: "Backpack", price: 39.99, category: "Accessories", image: "/placeholder.svg?height=80&width=80" },
  { id: 5, name: "Watch", price: 129.99, category: "Accessories", image: "/placeholder.svg?height=80&width=80" },
  { id: 6, name: "Laptop", price: 999.99, category: "Electronics", image: "/placeholder.svg?height=80&width=80" },
  { id: 7, name: "Smartphone", price: 699.99, category: "Electronics", image: "/placeholder.svg?height=80&width=80" },
  { id: 8, name: "Headphones", price: 149.99, category: "Electronics", image: "/placeholder.svg?height=80&width=80" },
  { id: 9, name: "Coffee Mug", price: 9.99, category: "Home", image: "/placeholder.svg?height=80&width=80" },
  { id: 10, name: "Plant Pot", price: 14.99, category: "Home", image: "/placeholder.svg?height=80&width=80" },
  { id: 11, name: "Desk Lamp", price: 29.99, category: "Home", image: "/placeholder.svg?height=80&width=80" },
  { id: 12, name: "Notebook", price: 4.99, category: "Stationery", image: "/placeholder.svg?height=80&width=80" },
]

// Sample categories
const categories = ["All", "Clothing", "Footwear", "Accessories", "Electronics", "Home", "Stationery"]

export function PointOfSale() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [cart, setCart] = useState([])
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [customer, setCustomer] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Filter products based on search term and category
  const filteredProducts = sampleProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }

    // On mobile, show the cart after adding an item
    if (isMobile) {
      setCartOpen(true)
    }
  }

  // Update item quantity in cart
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calculate discount amount
  const discountAmount = (subtotal * discount) / 100

  // Calculate tax (assuming 10% tax rate)
  const taxRate = 0.1
  const taxAmount = (subtotal - discountAmount) * taxRate

  // Calculate total
  const total = subtotal - discountAmount + taxAmount

  // Clear cart
  const clearCart = () => {
    setCart([])
    setDiscount(0)
    setCustomer(null)
  }

  // Handle payment completion
  const handlePaymentComplete = () => {
    // Here you would typically send the transaction to your backend
    console.log("Payment completed", {
      customer,
      items: cart,
      subtotal,
      discount,
      discountAmount,
      tax: taxAmount,
      total,
      timestamp: new Date(),
    })

    // Clear the cart and reset
    clearCart()
    setIsPaymentModalOpen(false)
    setCartOpen(false)
  }

  // Cart summary component for reuse
  const CartSummary = () => (
    <>
      <div className="p-4 bg-muted flex items-center justify-between">
        <div className="flex items-center">
          <ShoppingCartIcon className="mr-2 h-5 w-5" />
          <h2 className="text-lg font-medium">Current Sale</h2>
          <Badge variant="outline" className="ml-2">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </Badge>
        </div>
        {cart.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart}>
            <TrashIcon className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <ShoppingCartIcon className="h-12 w-12 mb-2" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add products to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        {/* Discount row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <PercentIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Discount (%)</span>
          </div>
          <div className="flex items-center">
            <Input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number.parseFloat(e.target.value) || 0)))}
              className="w-16 h-8 text-right"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-1 text-sm mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discount}%)</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium text-base">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full"
            disabled={cart.length === 0}
            onClick={() => console.log("Hold sale")}
          >
            Hold
          </Button>
          <Button className="w-full" disabled={cart.length === 0} onClick={() => setIsPaymentModalOpen(true)}>
            Pay
          </Button>
        </div>
      </div>
    </>
  )

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
        {/* Top bar with search and cart button */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="relative flex-1 mr-2">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <ShoppingCartIcon className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
              <CartSummary />
            </SheetContent>
          </Sheet>
        </div>

        {/* Category filters */}
        <ScrollArea className="whitespace-nowrap p-2 border-b">
          <div className="flex gap-2 pb-1">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </ScrollArea>

        {/* Products */}
        <Tabs defaultValue="grid" className="flex-1 flex flex-col">
          <div className="flex justify-between items-center p-2 border-b">
            <TabsList>
              <TabsTrigger value="grid">
                <LayoutGridIcon className="h-4 w-4 mr-1" /> Grid
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListViewIcon className="h-4 w-4 mr-1" /> List
              </TabsTrigger>
            </TabsList>

            <CustomerSelect customer={customer} onSelectCustomer={setCustomer} />
          </div>

          <TabsContent value="grid" className="flex-1 p-2 overflow-auto">
            <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
          </TabsContent>

          <TabsContent value="list" className="flex-1 p-2 overflow-auto">
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="flex items-center p-2">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">${product.price.toFixed(2)}</div>
                  </div>
                  <Button size="sm" onClick={() => addToCart(product)}>
                    <PlusIcon className="h-4 w-4 mr-1" /> Add
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onComplete={handlePaymentComplete}
          total={total}
        />
      </div>
    )
  }

  // Desktop view
  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Left side - Products */}
      <div className="flex flex-col w-2/3 p-4 border-r">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <CustomerSelect customer={customer} onSelectCustomer={setCustomer} />
        </div>

        <Tabs defaultValue="grid" className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="grid">
                <LayoutGridIcon className="h-4 w-4 mr-1" /> Grid
              </TabsTrigger>
              <TabsTrigger value="list">
                <ListViewIcon className="h-4 w-4 mr-1" /> List
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <TabsContent value="grid" className="flex-1 mt-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="list" className="flex-1 mt-0">
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="flex items-center p-2">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">${product.price.toFixed(2)}</div>
                    </div>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <PlusIcon className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right side - Cart */}
      <div className="flex flex-col w-1/3 bg-muted/30">
        <CartSummary />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onComplete={handlePaymentComplete}
        total={total}
      />
    </div>
  )
}

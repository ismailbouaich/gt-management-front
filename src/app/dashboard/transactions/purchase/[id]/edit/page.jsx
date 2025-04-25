import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ShoppingBagIcon, PlusCircleIcon, TrashIcon } from "lucide-react"
import { DraggableCalculator } from "@/components/draggable-calculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePicker } from "@/components/ui/calendar"

export default function PurchaseEditPage({ params }) {
  // In a real app, you would fetch the purchase data using the ID from params
  const purchaseId = params.id;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)"
      }}>
      <div className="flex h-full">
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-col w-full">
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="flex items-center border-b px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="h-6 w-6" />
                <h1 className="text-xl font-semibold">Edit Purchase #{purchaseId}</h1>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase Information</CardTitle>
                    <CardDescription>Update the details for this purchase.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="supplier">Supplier</Label>
                        <Select defaultValue="supplier1">
                          <SelectTrigger id="supplier">
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supplier1">ABC Supplies</SelectItem>
                            <SelectItem value="supplier2">XYZ Corporation</SelectItem>
                            <SelectItem value="supplier3">Main Distributors</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reference">Reference No.</Label>
                        <Input id="reference" placeholder="Enter reference number" defaultValue="PO-00123" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Purchase Date</Label>
                        <DatePicker className="w-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="warehouse">Warehouse</Label>
                        <Select defaultValue="main">
                          <SelectTrigger id="warehouse">
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="main">Main Warehouse</SelectItem>
                            <SelectItem value="secondary">Secondary Storage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue="received">
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="ordered">Ordered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentStatus">Payment Status</Label>
                        <Select defaultValue="paid">
                          <SelectTrigger id="paymentStatus">
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="partial">Partially Paid</SelectItem>
                            <SelectItem value="due">Due</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Discount</TableHead>
                          <TableHead>Tax</TableHead>
                          <TableHead>Subtotal</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Select defaultValue="product1">
                              <SelectTrigger id="product">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="product1">Product 1</SelectItem>
                                <SelectItem value="product2">Product 2</SelectItem>
                                <SelectItem value="product3">Product 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0" defaultValue="5" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0.00" defaultValue="99.99" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0.00" defaultValue="0.00" />
                          </TableCell>
                          <TableCell>
                            <Select defaultValue="vat">
                              <SelectTrigger id="tax">
                                <SelectValue placeholder="Tax" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="vat">VAT (15%)</SelectItem>
                                <SelectItem value="gst">GST (10%)</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>$499.95</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Select defaultValue="product2">
                              <SelectTrigger id="product2">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="product1">Product 1</SelectItem>
                                <SelectItem value="product2">Product 2</SelectItem>
                                <SelectItem value="product3">Product 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0" defaultValue="2" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0.00" defaultValue="149.99" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="0.00" defaultValue="10.00" />
                          </TableCell>
                          <TableCell>
                            <Select defaultValue="none">
                              <SelectTrigger id="tax2">
                                <SelectValue placeholder="Tax" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="vat">VAT (15%)</SelectItem>
                                <SelectItem value="gst">GST (10%)</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>$299.98</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <PlusCircleIcon className="h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Input 
                            id="notes" 
                            placeholder="Enter any notes about this purchase" 
                            defaultValue="Regular monthly order from ABC Supplies." 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>$799.93</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>$74.99</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>$25.00</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>$899.92</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <div className="flex justify-end gap-4 w-full">
                      <Button variant="outline">Cancel</Button>
                      <Button>Update Purchase</Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
      <DraggableCalculator />
    </SidebarProvider>
  )
}
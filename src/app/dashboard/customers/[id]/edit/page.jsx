import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { UserIcon } from "lucide-react"
import { DraggableCalculator } from "@/components/draggable-calculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CustomerEditPage({ params }) {
  // In a real app, you would fetch the customer data using the ID from params
  const customerId = params.id;

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
                <UserIcon className="h-6 w-6" />
                <h1 className="text-xl font-semibold">Edit Customer</h1>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Customer Information</CardTitle>
                  <CardDescription>Update the details for customer #{customerId}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter customer name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerType">Customer Type</Label>
                      <Select defaultValue="individual">
                        <SelectTrigger id="customerType">
                          <SelectValue placeholder="Select customer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email address" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter phone number" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      placeholder="Enter customer address" 
                      defaultValue="123 Main St, Anytown, Anystate 12345"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Credit Limit</Label>
                      <Input id="creditLimit" type="number" placeholder="0.00" defaultValue="5000.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">Tax Number</Label>
                      <Input id="taxNumber" placeholder="Enter tax number" defaultValue="TAX-123456" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Enter additional notes" 
                      defaultValue="Preferred customer, always pays on time."
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex justify-end gap-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Update Customer</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
      <DraggableCalculator />
    </SidebarProvider>
  )
}
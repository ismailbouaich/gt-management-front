import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CreditCardIcon } from "lucide-react"
import { DraggableCalculator } from "@/components/draggable-calculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"

export default function CustomerChequeEditPage({ params }) {
  // In a real app, you would fetch the cheque data using the ID from params
  const chequeId = params.id;

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
                <CreditCardIcon className="h-6 w-6" />
                <h1 className="text-xl font-semibold">Edit Customer Cheque #{chequeId}</h1>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cheque Information</CardTitle>
                  <CardDescription>Update the details for this customer cheque.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer</Label>
                      <Select defaultValue="john-doe">
                        <SelectTrigger id="customer">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john-doe">John Doe</SelectItem>
                          <SelectItem value="jane-smith">Jane Smith</SelectItem>
                          <SelectItem value="acme-inc">Acme Inc.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input id="amount" type="number" placeholder="0.00" defaultValue="1500.00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chequeNo">Cheque Number</Label>
                      <Input id="chequeNo" placeholder="Enter cheque number" defaultValue="CHQ-10054" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bank">Bank</Label>
                      <Input id="bank" placeholder="Enter bank name" defaultValue="ABC Bank" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chequeDate">Cheque Date</Label>
                      <DatePicker className="w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depositDate">Deposit Date</Label>
                      <DatePicker className="w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="deposited">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="deposited">Deposited</SelectItem>
                        <SelectItem value="cleared">Cleared</SelectItem>
                        <SelectItem value="bounced">Bounced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Enter notes or additional information" 
                      defaultValue="Monthly payment for invoice #INV-2023-04-15"
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex justify-end gap-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Update Cheque</Button>
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
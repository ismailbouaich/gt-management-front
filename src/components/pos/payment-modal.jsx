"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCardIcon, BanknoteIcon, QrCodeIcon, CheckIcon } from "lucide-react"

export function PaymentModal({ isOpen, onClose, onComplete, total }) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountPaid, setAmountPaid] = useState(total.toFixed(2))
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Update amount paid when total changes
  useEffect(() => {
    setAmountPaid(total.toFixed(2))
  }, [total])

  const handlePayment = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onComplete()
    }, 1500)
  }

  const change = Number.parseFloat(amountPaid) - total

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw] rounded-lg p-4" : "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="cash" value={paymentMethod} onValueChange={setPaymentMethod}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="cash">
              <BanknoteIcon className="h-4 w-4 mr-2" />
              Cash
            </TabsTrigger>
            <TabsTrigger value="card">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Card
            </TabsTrigger>
            <TabsTrigger value="mobile">
              <QrCodeIcon className="h-4 w-4 mr-2" />
              Mobile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cash" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Total</div>
                <div className="text-2xl font-bold">${total.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Amount Paid</div>
                <Input
                  type="number"
                  min={total}
                  step="0.01"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="text-lg font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 20, 50, 100, 200].map((amount) => (
                <Button key={amount} variant="outline" onClick={() => setAmountPaid(amount.toFixed(2))}>
                  ${amount}
                </Button>
              ))}
            </div>

            {Number.parseFloat(amountPaid) >= total && (
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium">Change</div>
                <div className="text-xl font-bold">${change.toFixed(2)}</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="card" className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <CreditCardIcon className="h-12 w-12 mx-auto mb-2 text-primary" />
              <p className="text-lg font-medium">Card Payment</p>
              <p className="text-sm text-muted-foreground">Process card payment on your terminal</p>
            </div>

            <div className="text-center">
              <div className="text-sm font-medium mb-1">Total Amount</div>
              <div className="text-2xl font-bold">${total.toFixed(2)}</div>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="bg-white p-4 rounded-lg mx-auto w-48 h-48 flex items-center justify-center mb-2">
                <QrCodeIcon className="h-32 w-32" />
              </div>
              <p className="text-lg font-medium">Scan to Pay</p>
              <p className="text-sm text-muted-foreground">Use your mobile payment app to scan</p>
            </div>

            <div className="text-center">
              <div className="text-sm font-medium mb-1">Total Amount</div>
              <div className="text-2xl font-bold">${total.toFixed(2)}</div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={Number.parseFloat(amountPaid) < total || isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Complete Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

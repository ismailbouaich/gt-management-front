"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { UserIcon, CheckIcon } from "lucide-react"

// Sample customers
const customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "555-1234" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "555-5678" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", phone: "555-9012" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", phone: "555-3456" },
  { id: 5, name: "Michael Wilson", email: "michael@example.com", phone: "555-7890" },
]

export function CustomerSelect({ customer, onSelectCustomer }) {
  const [open, setOpen] = useState(false)
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center justify-between w-[200px] max-w-full">
          <div className="flex items-center truncate">
            <UserIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{customer ? customer.name : "Select Customer"}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end" side={isMobile ? "bottom" : "right"}>
        <Command>
          <CommandInput placeholder="Search customers..." />
          <CommandList>
            <CommandEmpty>No customers found.</CommandEmpty>
            <CommandGroup>
              {customers.map((c) => (
                <CommandItem
                  key={c.id}
                  onSelect={() => {
                    onSelectCustomer(c)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    {customer?.id === c.id && <CheckIcon className="mr-2 h-4 w-4" />}
                    <span className={customer?.id === c.id ? "font-medium" : ""}>{c.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground ml-6">{c.phone}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

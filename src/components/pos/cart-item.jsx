"use client"

import { PlusIcon, MinusIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center p-2 bg-card rounded-lg border">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.name}</div>
        <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
      </div>

      <div className="flex items-center ml-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          <MinusIcon className="h-3 w-3" />
        </Button>

        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
          className="w-12 h-7 mx-1 text-center"
        />

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <PlusIcon className="h-3 w-3" />
        </Button>

        <Button variant="ghost" size="icon" className="h-7 w-7 ml-1 text-destructive" onClick={() => onRemove(item.id)}>
          <TrashIcon className="h-3 w-3" />
        </Button>
      </div>

      <div className="ml-2 text-right min-w-[60px]">${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  )
}

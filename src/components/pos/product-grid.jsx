"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export function ProductGrid({ products, onAddToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-card rounded-lg border overflow-hidden flex flex-col">
          <div className="relative h-32 bg-muted flex items-center justify-center p-4">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="p-3 flex-1 flex flex-col">
            <div className="font-medium line-clamp-1">{product.name}</div>
            <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-medium">${product.price.toFixed(2)}</span>
              <Button size="sm" onClick={() => onAddToCart(product)}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

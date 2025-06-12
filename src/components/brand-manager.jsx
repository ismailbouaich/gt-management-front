"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { productService } from "@/services/productService"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function BrandManager({ onBrandSelect = null, selectedBrand = null }) {
  const [brands, setBrands] = useState([])
  const [newBrand, setNewBrand] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadBrands()
  }, [])
    const loadBrands = async () => {
    setIsLoading(true)
    try {
      const response = await productService.getBrandsWithDetails()
      setBrands(response.data)
    } catch (error) {
      console.error('Error loading brands:', error)
      toast.error('Failed to load brands')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBrand = async () => {
    if (!newBrand.trim()) {
      toast.error('Brand name is required')
      return
    }

    if (brands.some(brand => brand.name.toLowerCase() === newBrand.toLowerCase())) {
      toast.error('Brand already exists')
      return
    }

    try {
      const response = await productService.createBrand({
        name: newBrand.trim(),
        description: `${newBrand.trim()} brand products`
      })
      
      setBrands(prev => [...prev, response.data])
      setNewBrand('')
      toast.success('Brand added successfully')
    } catch (error) {
      console.error('Error adding brand:', error)
      toast.error(error.message || 'Failed to add brand')
    }
  }

  const handleEditBrand = async (id) => {
    if (!editValue.trim()) {
      toast.error('Brand name is required')
      return
    }

    if (brands.some(brand => brand.id !== id && brand.name.toLowerCase() === editValue.toLowerCase())) {
      toast.error('Brand already exists')
      return
    }

    try {
      setBrands(prev => prev.map(brand => 
        brand.id === id ? { ...brand, name: editValue.trim() } : brand
      ))
      setEditingId(null)
      setEditValue('')
      toast.success('Brand updated successfully')
    } catch (error) {
      console.error('Error updating brand:', error)
      toast.error('Failed to update brand')
    }
  }

  const handleDeleteBrand = async (id, name) => {
    try {
      setBrands(prev => prev.filter(brand => brand.id !== id))
      toast.success(`Brand "${name}" deleted successfully`)
    } catch (error) {
      console.error('Error deleting brand:', error)
      toast.error('Failed to delete brand')
    }
  }

  const startEdit = (brand) => {
    setEditingId(brand.id)
    setEditValue(brand.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action()
    } else if (e.key === 'Escape') {
      if (editingId) {
        cancelEdit()
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Management</CardTitle>
        <CardDescription>
          Manage product brands. {onBrandSelect && "Click on a brand to select it."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new brand */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-brand" className="sr-only">New Brand</Label>
            <Input
              id="new-brand"
              placeholder="Enter new brand name"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddBrand)}
            />
          </div>
          <Button onClick={handleAddBrand} disabled={!newBrand.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Brands list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading brands...
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No brands found
            </div>
          ) : (
            brands.map((brand) => (
              <div
                key={brand.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  selectedBrand === brand.name ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                } ${onBrandSelect ? 'cursor-pointer' : ''}`}
                onClick={() => onBrandSelect && onBrandSelect(brand.name)}
              >
                <div className="flex items-center gap-3 flex-1">
                  {editingId === brand.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, () => handleEditBrand(brand.id))}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleEditBrand(brand.id)}
                        disabled={!editValue.trim()}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{brand.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {brand.productCount} products
                      </Badge>
                    </>
                  )}
                </div>
                
                {editingId !== brand.id && !onBrandSelect && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(brand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{brand.name}"? 
                            {brand.productCount > 0 && (
                              <span className="text-orange-600">
                                {" "}This will affect {brand.productCount} products.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteBrand(brand.id, brand.name)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

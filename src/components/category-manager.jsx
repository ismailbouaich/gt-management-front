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

export function CategoryManager({ onCategorySelect = null, selectedCategory = null }) {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])  
  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const response = await productService.getCategoriesWithDetails()
      setCategories(response.data)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Category name is required')
      return
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      toast.error('Category already exists')
      return
    }

    try {
      const response = await productService.createCategory({
        name: newCategory.trim(),
        description: `Products in ${newCategory.trim()} category`
      })
      
      setCategories(prev => [...prev, response.data])
      setNewCategory('')
      toast.success('Category added successfully')
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error(error.message || 'Failed to add category')
    }
  }

  const handleEditCategory = async (id) => {
    if (!editValue.trim()) {
      toast.error('Category name is required')
      return
    }

    if (categories.some(cat => cat.id !== id && cat.name.toLowerCase() === editValue.toLowerCase())) {
      toast.error('Category already exists')
      return
    }

    try {
      setCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, name: editValue.trim() } : cat
      ))
      setEditingId(null)
      setEditValue('')
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const handleDeleteCategory = async (id, name) => {
    try {
      setCategories(prev => prev.filter(cat => cat.id !== id))
      toast.success(`Category "${name}" deleted successfully`)
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const startEdit = (category) => {
    setEditingId(category.id)
    setEditValue(category.name)
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
        <CardTitle>Category Management</CardTitle>
        <CardDescription>
          Manage product categories. {onCategorySelect && "Click on a category to select it."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new category */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-category" className="sr-only">New Category</Label>
            <Input
              id="new-category"
              placeholder="Enter new category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddCategory)}
            />
          </div>
          <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Categories list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No categories found
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  selectedCategory === category.name ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                } ${onCategorySelect ? 'cursor-pointer' : ''}`}
                onClick={() => onCategorySelect && onCategorySelect(category.name)}
              >
                <div className="flex items-center gap-3 flex-1">
                  {editingId === category.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, () => handleEditCategory(category.id))}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleEditCategory(category.id)}
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
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.productCount} products
                      </Badge>
                    </>
                  )}
                </div>
                
                {editingId !== category.id && !onCategorySelect && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(category)}
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
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"? 
                            {category.productCount > 0 && (
                              <span className="text-orange-600">
                                {" "}This will affect {category.productCount} products.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category.id, category.name)}
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

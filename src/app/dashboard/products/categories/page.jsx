"use client"

import { useState, useEffect } from "react"
import { FolderIcon, Plus, Search, RefreshCw, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { productService } from "@/services/productService"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])
  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await productService.getCategoriesWithDetails()
      setCategories(response.data)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (categories.some(cat => cat.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error('Category already exists')
      return
    }    try {
      const response = await productService.createCategory({
        name: formData.name.trim(),
        description: formData.description.trim()
      })
      
      setCategories(prev => [...prev, response.data])
      setFormData({ name: '', description: '' })
      setIsCreateDialogOpen(false)
      toast.success('Category created successfully')
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error.message || 'Failed to create category')
    }
  }

  const handleEditCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (categories.some(cat => cat.id !== editingCategory.id && cat.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error('Category already exists')
      return
    }

    try {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { 
              ...cat, 
              name: formData.name.trim(),
              description: formData.description.trim(),
              updatedAt: new Date().toISOString()
            }
          : cat
      ))
      setFormData({ name: '', description: '' })
      setEditingCategory(null)
      setIsEditDialogOpen(false)
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
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description
    })
    setIsEditDialogOpen(true)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <FolderIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Categories</h1>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({ name: '', description: '' })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new product category to organize your inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name *</Label>
                <Input
                  id="category-name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-description">Description</Label>
                <Input
                  id="category-description"
                  placeholder="Enter category description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Categories</CardDescription>
              <CardTitle className="text-2xl">{categories.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-2xl">{categories.reduce((sum, cat) => sum + cat.productCount, 0)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Products per Category</CardDescription>
              <CardTitle className="text-2xl">
                {categories.length > 0 ? Math.round(categories.reduce((sum, cat) => sum + cat.productCount, 0) / categories.length) : 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Category List</CardTitle>
              <Button variant="outline" size="sm" onClick={loadCategories}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Categories Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Loading categories...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {searchTerm ? 'No categories found matching your search' : 'No categories found'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {category.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {category.productCount} products
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(category.createdAt)}</TableCell>
                        <TableCell>{formatDate(category.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
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
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Category Name *</Label>
              <Input
                id="edit-category-name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-description">Description</Label>
              <Input
                id="edit-category-description"
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

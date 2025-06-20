"use client"

import { useState, useEffect } from "react"
import { TagIcon, Plus, Search, RefreshCw, Edit, Trash2 } from "lucide-react"
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

export default function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadBrands()
  }, [])
  const loadBrands = async () => {
    setLoading(true)
    try {
      const response = await productService.getBrandsWithDetails()
      setBrands(response.data)
    } catch (error) {
      console.error('Error loading brands:', error)
      toast.error('Failed to load brands')
    } finally {
      setLoading(false)
    }
  }
  const handleCreateBrand = async () => {
    if (!formData.name.trim()) {
      toast.error('Brand name is required')
      return
    }

    if (brands.some(brand => brand.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error('Brand already exists')
      return
    }

    try {
      const response = await productService.createBrand({
        name: formData.name.trim(),
        description: formData.description.trim()
      })
      
      setBrands(prev => [...prev, response.data])
      setFormData({ name: '', description: '' })
      setIsCreateDialogOpen(false)
      toast.success('Brand created successfully')
    } catch (error) {
      console.error('Error creating brand:', error)
      toast.error(error.message || 'Failed to create brand')
    }
  }

  const handleEditBrand = async () => {
    if (!formData.name.trim()) {
      toast.error('Brand name is required')
      return
    }

    if (brands.some(brand => brand.id !== editingBrand.id && brand.name.toLowerCase() === formData.name.toLowerCase())) {
      toast.error('Brand already exists')
      return
    }

    try {
      setBrands(prev => prev.map(brand => 
        brand.id === editingBrand.id 
          ? { 
              ...brand, 
              name: formData.name.trim(),
              description: formData.description.trim(),
              updatedAt: new Date().toISOString()
            }
          : brand
      ))
      setFormData({ name: '', description: '' })
      setEditingBrand(null)
      setIsEditDialogOpen(false)
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
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description
    })
    setIsEditDialogOpen(true)
  }

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <TagIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Brands</h1>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({ name: '', description: '' })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
              <DialogDescription>
                Add a new brand to organize your products.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand-name">Brand Name *</Label>
                <Input
                  id="brand-name"
                  placeholder="Enter brand name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand-description">Description</Label>
                <Input
                  id="brand-description"
                  placeholder="Enter brand description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBrand}>
                Create Brand
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
              <CardDescription>Total Brands</CardDescription>
              <CardTitle className="text-2xl">{brands.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-2xl">{brands.reduce((sum, brand) => sum + brand.productCount, 0)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Products per Brand</CardDescription>
              <CardTitle className="text-2xl">
                {brands.length > 0 ? Math.round(brands.reduce((sum, brand) => sum + brand.productCount, 0) / brands.length) : 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Brand List</CardTitle>
              <Button variant="outline" size="sm" onClick={loadBrands}>
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
                    placeholder="Search brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Brands Table */}
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
                          Loading brands...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredBrands.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {searchTerm ? 'No brands found matching your search' : 'No brands found'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBrands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell className="font-medium">{brand.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {brand.description || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {brand.productCount} products
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(brand.createdAt)}</TableCell>
                        <TableCell>{formatDate(brand.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(brand)}
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
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>
              Update the brand information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-brand-name">Brand Name *</Label>
              <Input
                id="edit-brand-name"
                placeholder="Enter brand name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-brand-description">Description</Label>
              <Input
                id="edit-brand-description"
                placeholder="Enter brand description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBrand}>
              Update Brand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
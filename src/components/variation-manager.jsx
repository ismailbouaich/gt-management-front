"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  Palette,
  Layers,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Copy,
  Download,
  Upload
} from 'lucide-react'

export function VariationManager() {
  const [variations, setVariations] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  
  // Form states for new variation
  const [newVariation, setNewVariation] = useState({
    productId: '',
    productName: '',
    baseProductSku: '',
    variationType: '',
    variations: []
  })

  // Load variations data
  useEffect(() => {
    loadVariations()
  }, [])

  const loadVariations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products/variations')
      const data = await response.json()
      
      if (data.success) {
        setVariations(data.variations || [])
      }
    } catch (error) {
      console.error('Error loading variations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter variations based on search and filters
  const filteredVariations = useMemo(() => {
    return variations.filter(variation => {
      const matchesSearch = searchTerm === '' || 
        variation.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variation.baseProductSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variation.variationType.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesProduct = selectedProduct === 'all' || 
        variation.productId.toString() === selectedProduct
      
      const matchesStatus = selectedStatus === 'all' || 
        (selectedStatus === 'active' && variation.variations.some(v => v.isActive)) ||
        (selectedStatus === 'inactive' && variation.variations.some(v => !v.isActive))
      
      return matchesSearch && matchesProduct && matchesStatus
    })
  }, [variations, searchTerm, selectedProduct, selectedStatus])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalVariations = variations.reduce((sum, group) => sum + group.variations.length, 0)
    const activeVariations = variations.reduce((sum, group) => 
      sum + group.variations.filter(v => v.isActive).length, 0
    )
    const totalStock = variations.reduce((sum, group) => 
      sum + group.variations.reduce((varSum, variation) => varSum + variation.stock, 0), 0
    )
    const totalValue = variations.reduce((sum, group) => 
      sum + group.variations.reduce((varSum, variation) => varSum + (variation.price * variation.stock), 0), 0
    )
    
    return {
      totalGroups: variations.length,
      totalVariations,
      activeVariations,
      totalStock,
      totalValue
    }
  }, [variations])

  const getVariationTypeColor = (type) => {
    const colors = {
      'Color': 'bg-blue-100 text-blue-800',
      'Size': 'bg-green-100 text-green-800',
      'Size & Color': 'bg-purple-100 text-purple-800',
      'Model & Material': 'bg-orange-100 text-orange-800',
      'Material': 'bg-yellow-100 text-yellow-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-800', text: 'Out of Stock' }
    if (stock < 10) return { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' }
    return { color: 'bg-green-100 text-green-800', text: 'In Stock' }
  }

  const handleViewDetails = (variation) => {
    setSelectedVariation(variation)
    setShowDetailsDialog(true)
  }

  const addNewVariationItem = () => {
    setNewVariation(prev => ({
      ...prev,
      variations: [...prev.variations, {
        id: `temp-${Date.now()}`,
        name: '',
        sku: '',
        price: 0,
        cost: 0,
        stock: 0,
        isDefault: false,
        isActive: true
      }]
    }))
  }

  const removeVariationItem = (index) => {
    setNewVariation(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }))
  }

  const updateVariationItem = (index, field, value) => {
    setNewVariation(prev => ({
      ...prev,
      variations: prev.variations.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Variations</h1>
          <p className="text-muted-foreground">
            Manage product variations including colors, sizes, and other attributes
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Variation Group
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">
              Variation groups
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Variations</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVariations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeVariations} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Units in stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by product name, SKU, or variation type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="1">Wireless Headphones</SelectItem>
                <SelectItem value="3">T-Shirt</SelectItem>
                <SelectItem value="4">Smartphone Case</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Variations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Variation Groups</CardTitle>
          <CardDescription>
            {filteredVariations.length} of {variations.length} variation groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading variations...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Variation Type</TableHead>
                  <TableHead>Variations Count</TableHead>
                  <TableHead>Total Stock</TableHead>
                  <TableHead>Value Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVariations.map((variationGroup) => {
                  const totalStock = variationGroup.variations.reduce((sum, v) => sum + v.stock, 0)
                  const prices = variationGroup.variations.map(v => v.price)
                  const minPrice = Math.min(...prices)
                  const maxPrice = Math.max(...prices)
                  const activeCount = variationGroup.variations.filter(v => v.isActive).length
                  
                  return (
                    <TableRow key={variationGroup.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{variationGroup.productName}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {variationGroup.baseProductSku}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getVariationTypeColor(variationGroup.variationType)}>
                          {variationGroup.variationType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{variationGroup.variations.length}</div>
                          <div className="text-sm text-muted-foreground">
                            {activeCount} active
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{totalStock}</div>
                          <Badge className={getStockStatus(totalStock).color}>
                            {getStockStatus(totalStock).text}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {minPrice === maxPrice ? 
                            `$${minPrice}` : 
                            `$${minPrice} - $${maxPrice}`
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {activeCount > 0 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {activeCount > 0 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(variationGroup)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Variation Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Variation Group</DialogTitle>
            <DialogDescription>
              Add a new variation group for a product with multiple options
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  value={newVariation.productId}
                  onChange={(e) => setNewVariation(prev => ({ ...prev, productId: e.target.value }))}
                  placeholder="Enter product ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newVariation.productName}
                  onChange={(e) => setNewVariation(prev => ({ ...prev, productName: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseProductSku">Base SKU</Label>
                <Input
                  id="baseProductSku"
                  value={newVariation.baseProductSku}
                  onChange={(e) => setNewVariation(prev => ({ ...prev, baseProductSku: e.target.value }))}
                  placeholder="Enter base SKU"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variationType">Variation Type</Label>
                <Select 
                  value={newVariation.variationType} 
                  onValueChange={(value) => setNewVariation(prev => ({ ...prev, variationType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select variation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Color">Color</SelectItem>
                    <SelectItem value="Size">Size</SelectItem>
                    <SelectItem value="Size & Color">Size & Color</SelectItem>
                    <SelectItem value="Material">Material</SelectItem>
                    <SelectItem value="Model & Material">Model & Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Variations</Label>
                <Button type="button" onClick={addNewVariationItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variation
                </Button>
              </div>
              
              {newVariation.variations.map((variation, index) => (
                <div key={variation.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Variation {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariationItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={variation.name}
                        onChange={(e) => updateVariationItem(index, 'name', e.target.value)}
                        placeholder="e.g., Red, Large, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input
                        value={variation.sku}
                        onChange={(e) => updateVariationItem(index, 'sku', e.target.value)}
                        placeholder="Unique SKU"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={variation.stock}
                        onChange={(e) => updateVariationItem(index, 'stock', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variation.price}
                        onChange={(e) => updateVariationItem(index, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cost ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variation.cost}
                        onChange={(e) => updateVariationItem(index, 'cost', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={variation.isActive}
                          onCheckedChange={(checked) => updateVariationItem(index, 'isActive', checked)}
                        />
                        <span className="text-sm">{variation.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Handle create variation
                console.log('Creating variation group:', newVariation)
                setShowCreateDialog(false)
              }}
            >
              Create Variation Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variation Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedVariation?.productName} - Variations</DialogTitle>
            <DialogDescription>
              Detailed view of all variations for this product
            </DialogDescription>
          </DialogHeader>
          
          {selectedVariation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Product ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedVariation.productId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Base SKU</Label>
                  <p className="text-sm text-muted-foreground">{selectedVariation.baseProductSku}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Variation Type</Label>
                <div className="mt-1">
                  <Badge className={getVariationTypeColor(selectedVariation.variationType)}>
                    {selectedVariation.variationType}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Variations ({selectedVariation.variations.length})</Label>
                <div className="mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedVariation.variations.map((variation) => (
                        <TableRow key={variation.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {variation.color && (
                                <div 
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: variation.color }}
                                />
                              )}
                              <span className="font-medium">{variation.name}</span>
                              {variation.isDefault && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{variation.sku}</TableCell>
                          <TableCell>${variation.price}</TableCell>
                          <TableCell>${variation.cost}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{variation.stock}</span>
                              <Badge className={getStockStatus(variation.stock).color}>
                                {getStockStatus(variation.stock).text}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {variation.isActive ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">
                                {variation.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Variations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

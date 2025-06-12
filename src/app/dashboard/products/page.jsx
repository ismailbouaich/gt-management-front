"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, Plus, Search, Filter, RefreshCw, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })    
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    brand: 'all',
    page: 1,
    limit: 10
  })
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [filters])

  const loadInitialData = async () => {
    try {
      const [categoriesResponse, brandsResponse, statsResponse] = await Promise.all([
        productService.getCategories(),
        productService.getBrands(),
        productService.getProductStats()
      ])
      
      setCategories(categoriesResponse.data)
      setBrands(brandsResponse.data)
      setStats(statsResponse.data)
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Failed to load page data')
    }
  }
  
  const loadProducts = async () => {
    setLoading(true)
    try {
      // Convert 'all' values to empty strings for API call
      const apiFilters = {
        ...filters,
        category: filters.category === 'all' ? '' : filters.category,
        status: filters.status === 'all' ? '' : filters.status,
        brand: filters.brand === 'all' ? '' : filters.brand
      }
      
      const response = await productService.getProducts(apiFilters)
      setProducts(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const handleSearch = (value) => {
    handleFilterChange('search', value)
  }

  const handleRefresh = () => {
    loadProducts()
    loadInitialData()
  }

  const handleCreateProduct = () => {
    router.push('/dashboard/products/create')
  }

  const handleEditProduct = (id) => {
    router.push(`/dashboard/products/${id}/edit`)
  }

  const handleViewProduct = (id) => {
    router.push(`/dashboard/products/${id}`)
  }

  const handleDeleteProduct = async (id, name) => {
    try {
      await productService.deleteProduct(id)
      toast.success(`Product "${name}" deleted successfully`)
      loadProducts() // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'In Stock': 'success',
      'Low Stock': 'warning',
      'Out of Stock': 'destructive'
    }
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Products</h1>
        </div>
        <Button onClick={handleCreateProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-2xl">{stats.totalProducts || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Stock</CardDescription>
              <CardTitle className="text-2xl text-green-600">{stats.inStock || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Low Stock</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">{stats.lowStock || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Out of Stock</CardDescription>
              <CardTitle className="text-2xl text-red-600">{stats.outOfStock || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product List</CardTitle>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
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
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.brand}
                onValueChange={(value) => handleFilterChange('brand', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Loading products...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="text-muted-foreground">
                          No products found
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-48">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{product.currentStock}</div>
                            <div className="text-muted-foreground">
                              Min: {product.minStock}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatPrice(product.purchasePrice)}</TableCell>
                        <TableCell>{formatPrice(product.sellingPrice)}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProduct(product.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product.id)}
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
                                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} products
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === pagination.currentPage ? 'solid' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

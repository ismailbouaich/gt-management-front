"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BoxIcon, Loader2, Settings, ChevronDown, ChevronUp } from "lucide-react"
import { DraggableCalculator } from "@/components/draggable-calculator"
import { CategoryManager } from "@/components/category-manager"
import { BrandManager } from "@/components/brand-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "sonner"
import { productService } from "@/services/productService"

export default function ProductCreatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [showBrandManager, setShowBrandManager] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    purchasePrice: '',
    sellingPrice: '',
    description: ''
  })

  // Load categories and brands on component mount
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        productService.getCategories(),
        productService.getBrands()
      ])
      
      setCategories(categoriesResponse.data)
      setBrands(brandsResponse.data)
    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Failed to load form data')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6)
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `PRD-${timestamp}${randomNum}`
  }

  const handleGenerateSKU = () => {
    const newSKU = generateSKU()
    handleInputChange('sku', newSKU)
  }

  const validateForm = () => {
    const required = ['name', 'sku', 'category', 'purchasePrice', 'sellingPrice']
    const missing = required.filter(field => !formData[field])
    
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(', ')}`)
      return false
    }

    if (parseFloat(formData.purchasePrice) <= 0) {
      toast.error('Purchase price must be greater than 0')
      return false
    }

    if (parseFloat(formData.sellingPrice) <= 0) {
      toast.error('Selling price must be greater than 0')
      return false
    }

    if (parseFloat(formData.sellingPrice) <= parseFloat(formData.purchasePrice)) {
      toast.error('Selling price should be higher than purchase price')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const productData = {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice),
        sellingPrice: parseFloat(formData.sellingPrice)
      }

      const response = await productService.createProduct(productData)
      
      toast.success(response.message || 'Product created successfully!')
      
      // Reset form
      setFormData({
        name: '',
        sku: '',
        category: '',
        brand: '',
        purchasePrice: '',
        sellingPrice: '',
        description: ''
      })

      // Navigate to products list after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/products')
      }, 2000)

    } catch (error) {
      console.error('Error creating product:', error)
      toast.error(error.message || 'Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/products')
  }

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, category }))
    setShowCategoryManager(false)
    toast.success(`Category "${category}" selected`)
  }

  const handleBrandSelect = (brand) => {
    setFormData(prev => ({ ...prev, brand }))
    setShowBrandManager(false)
    toast.success(`Brand "${brand}" selected`)
  }

  const refreshCategories = async () => {
    try {
      const response = await productService.getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error('Error refreshing categories:', error)
    }
  }

  const refreshBrands = async () => {
    try {
      const response = await productService.getBrands()
      setBrands(response.data)
    } catch (error) {
      console.error('Error refreshing brands:', error)
    }
  }

  return (          <div className="flex flex-1 flex-col">
            <div className="flex items-center border-b px-6 py-5">
              <div className="flex items-center gap-2">
                <BoxIcon className="h-6 w-6" />
                <h1 className="text-xl font-semibold">Create Product</h1>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                    <CardDescription>Enter the details for the new product.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input 
                          id="name" 
                          placeholder="Enter product name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU *</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="sku" 
                            placeholder="Enter SKU"
                            value={formData.sku}
                            onChange={(e) => handleInputChange('sku', e.target.value)}
                            required
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleGenerateSKU}
                            className="whitespace-nowrap"
                          >
                            Generate
                          </Button>
                        </div>
                      </div>
                    </div>                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="category">Category *</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowCategoryManager(!showCategoryManager)
                              if (!showCategoryManager) refreshCategories()
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        </div>
                        <Select 
                          value={formData.category}
                          onValueChange={(value) => handleInputChange('category', value)}
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="brand">Brand</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowBrandManager(!showBrandManager)
                              if (!showBrandManager) refreshBrands()
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        </div>
                        <Select 
                          value={formData.brand}
                          onValueChange={(value) => handleInputChange('brand', value)}
                        >
                          <SelectTrigger id="brand">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map(brand => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purchase-price">Purchase Price * ($)</Label>
                        <Input 
                          id="purchase-price" 
                          type="number" 
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.purchasePrice}
                          onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="selling-price">Selling Price * ($)</Label>
                        <Input 
                          id="selling-price" 
                          type="number" 
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.sellingPrice}
                          onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                          required
                        />
                      </div>
                    </div>                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Enter product description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Category Manager */}
                    {showCategoryManager && (
                      <div className="mt-4">
                        <CategoryManager 
                          onCategorySelect={handleCategorySelect}
                          selectedCategory={formData.category}
                        />
                      </div>
                    )}

                    {/* Brand Manager */}
                    {showBrandManager && (
                      <div className="mt-4">
                        <BrandManager 
                          onBrandSelect={handleBrandSelect}
                          selectedBrand={formData.brand}
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <div className="flex justify-end gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Creating...
                          </>
                        ) : (
                          'Create Product'
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </form>
            </div>
          </div>
    
  )
}
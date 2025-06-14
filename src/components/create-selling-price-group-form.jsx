"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Save, 
  ArrowLeft, 
  DollarSign,
  Percent,
  Calculator,
  Info,
  Calendar,
  Users,
  Target,
  Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

const priceGroupTypes = [
  { value: 'percentage', label: 'Percentage', description: 'Price based on percentage markup/discount' },
  { value: 'fixed', label: 'Fixed Amount', description: 'Price based on fixed amount markup/discount' }
]

const markupTypes = [
  { value: 'cost', label: 'Cost Price', description: 'Calculate markup based on cost price' },
  { value: 'retail', label: 'Retail Price', description: 'Calculate markup based on retail price' }
]

const discountTypes = [
  { value: 'none', label: 'No Discount', description: 'No discount applied' },
  { value: 'percentage', label: 'Percentage', description: 'Discount as percentage' },
  { value: 'fixed', label: 'Fixed Amount', description: 'Discount as fixed amount' }
]

const roundingRules = [
  { value: 'nearest', label: 'Round to Nearest', description: 'Round to nearest value' },
  { value: 'up', label: 'Round Up', description: 'Always round up' },
  { value: 'down', label: 'Round Down', description: 'Always round down' }
]

const customerGroups = [
  'walk-in',
  'regular',
  'wholesale',
  'distributor',
  'vip',
  'premium',
  'employee',
  'staff',
  'online',
  'bulk',
  'all'
]

const currencies = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CAD',
  'AUD'
]

export default function CreateSellingPriceGroupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: 'percentage',
    markupType: 'cost',
    markupValue: 0,
    discountType: 'none',
    discountValue: 0,
    isDefault: false,
    isActive: true,
    priority: 100,
    minimumQuantity: 1,
    maximumQuantity: '',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '',
    applicableProducts: 'all',
    applicableCategories: [],
    customerGroups: [],
    currency: 'USD',
    taxIncluded: false,
    roundingRule: 'nearest',
    roundingPrecision: 2
  })
  const [errors, setErrors] = useState({})

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }

    // Auto-generate code from name if not manually set
    if (field === 'name' && !formData.code) {
      const generatedCode = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10)
      setFormData(prev => ({
        ...prev,
        code: generatedCode
      }))
    }

    // Reset discount value when changing discount type to none
    if (field === 'discountType' && value === 'none') {
      setFormData(prev => ({
        ...prev,
        discountValue: 0
      }))
    }
  }

  // Handle customer group selection
  const handleCustomerGroupChange = (group, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        customerGroups: [...prev.customerGroups, group]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        customerGroups: prev.customerGroups.filter(g => g !== group)
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Price group name is required'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Price group code is required'
    }

    if (!formData.type) {
      newErrors.type = 'Price group type is required'
    }

    if (!formData.markupType) {
      newErrors.markupType = 'Markup type is required'
    }

    if (formData.markupValue < 0) {
      newErrors.markupValue = 'Markup value cannot be negative'
    }

    if (formData.discountType !== 'none' && formData.discountValue < 0) {
      newErrors.discountValue = 'Discount value cannot be negative'
    }

    if (formData.minimumQuantity < 1) {
      newErrors.minimumQuantity = 'Minimum quantity must be at least 1'
    }

    if (formData.maximumQuantity && formData.maximumQuantity < formData.minimumQuantity) {
      newErrors.maximumQuantity = 'Maximum quantity must be greater than minimum quantity'
    }

    if (formData.validTo && formData.validTo <= formData.validFrom) {
      newErrors.validTo = 'Valid to date must be after valid from date'
    }

    if (formData.customerGroups.length === 0) {
      newErrors.customerGroups = 'At least one customer group must be selected'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please correct the errors in the form')
      return
    }

    setLoading(true)

    try {
      const submitData = {
        ...formData,
        maximumQuantity: formData.maximumQuantity ? parseInt(formData.maximumQuantity) : null,
        validTo: formData.validTo || null
      }

      const response = await fetch('/api/products/selling-price-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Price group created successfully!')
        router.push('/dashboard/products/selling-price-group')
      } else {
        toast.error(result.error || 'Failed to create price group')
      }
    } catch (error) {
      console.error('Error creating price group:', error)
      toast.error('An error occurred while creating the price group')
    } finally {
      setLoading(false)
    }
  }

  // Calculate example price
  const calculateExamplePrice = () => {
    const baseCost = 100 // Example base cost
    let price = baseCost
    
    // Apply markup
    if (formData.type === 'percentage') {
      price = baseCost * (1 + formData.markupValue / 100)
    } else {
      price = baseCost + formData.markupValue
    }
    
    // Apply discount
    if (formData.discountType === 'percentage') {
      price = price * (1 - formData.discountValue / 100)
    } else if (formData.discountType === 'fixed') {
      price = price - formData.discountValue
    }
    
    return price.toFixed(formData.roundingPrecision)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Price Group Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Wholesale Price, VIP Pricing"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Price Group Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                    placeholder="e.g., WHOLESALE, VIP"
                    className={errors.code ? 'border-destructive' : ''}
                  />
                  {errors.code && (
                    <p className="text-sm text-destructive">{errors.code}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of the price group..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                    placeholder="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roundingPrecision">Decimal Places</Label>
                  <Input
                    id="roundingPrecision"
                    type="number"
                    min="0"
                    max="4"
                    value={formData.roundingPrecision}
                    onChange={(e) => handleChange('roundingPrecision', parseInt(e.target.value))}
                    placeholder="2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Pricing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Price Group Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceGroupTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="markupType">Markup Base *</Label>
                  <Select value={formData.markupType} onValueChange={(value) => handleChange('markupType', value)}>
                    <SelectTrigger className={errors.markupType ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select markup type" />
                    </SelectTrigger>
                    <SelectContent>
                      {markupTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.markupType && (
                    <p className="text-sm text-destructive">{errors.markupType}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="markupValue">
                    Markup Value {formData.type === 'percentage' ? '(%)' : '($)'}
                  </Label>
                  <Input
                    id="markupValue"
                    type="number"
                    step="0.01"
                    value={formData.markupValue}
                    onChange={(e) => handleChange('markupValue', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.markupValue ? 'border-destructive' : ''}
                  />
                  {errors.markupValue && (
                    <p className="text-sm text-destructive">{errors.markupValue}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roundingRule">Rounding Rule</Label>
                  <Select value={formData.roundingRule} onValueChange={(value) => handleChange('roundingRule', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rounding rule" />
                    </SelectTrigger>
                    <SelectContent>
                      {roundingRules.map((rule) => (
                        <SelectItem key={rule.value} value={rule.value}>
                          <div>
                            <div className="font-medium">{rule.label}</div>
                            <div className="text-xs text-muted-foreground">{rule.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select value={formData.discountType} onValueChange={(value) => handleChange('discountType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      {discountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.discountType !== 'none' && (
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">
                      Discount Value {formData.discountType === 'percentage' ? '(%)' : '($)'}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      step="0.01"
                      value={formData.discountValue}
                      onChange={(e) => handleChange('discountValue', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className={errors.discountValue ? 'border-destructive' : ''}
                    />
                    {errors.discountValue && (
                      <p className="text-sm text-destructive">{errors.discountValue}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Example Calculation */}
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">Example Calculation (Base Cost: $100)</div>
                    <div className="text-sm">
                      Final Price: ${calculateExamplePrice()}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Quantity & Validity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quantity & Validity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimumQuantity">Minimum Quantity *</Label>
                  <Input
                    id="minimumQuantity"
                    type="number"
                    min="1"
                    value={formData.minimumQuantity}
                    onChange={(e) => handleChange('minimumQuantity', parseInt(e.target.value) || 1)}
                    className={errors.minimumQuantity ? 'border-destructive' : ''}
                  />
                  {errors.minimumQuantity && (
                    <p className="text-sm text-destructive">{errors.minimumQuantity}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maximumQuantity">Maximum Quantity</Label>
                  <Input
                    id="maximumQuantity"
                    type="number"
                    value={formData.maximumQuantity}
                    onChange={(e) => handleChange('maximumQuantity', e.target.value)}
                    placeholder="Leave empty for unlimited"
                    className={errors.maximumQuantity ? 'border-destructive' : ''}
                  />
                  {errors.maximumQuantity && (
                    <p className="text-sm text-destructive">{errors.maximumQuantity}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => handleChange('validFrom', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validTo">Valid To</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => handleChange('validTo', e.target.value)}
                    className={errors.validTo ? 'border-destructive' : ''}
                  />
                  {errors.validTo && (
                    <p className="text-sm text-destructive">{errors.validTo}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Groups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {customerGroups.map((group) => (
                  <div key={group} className="flex items-center space-x-2">
                    <Checkbox
                      id={group}
                      checked={formData.customerGroups.includes(group)}
                      onCheckedChange={(checked) => handleCustomerGroupChange(group, checked)}
                    />
                    <Label htmlFor={group} className="text-sm capitalize">
                      {group}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.customerGroups && (
                <p className="text-sm text-destructive">{errors.customerGroups}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => handleChange('isDefault', checked)}
                />
                <Label htmlFor="isDefault">Set as Default</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="taxIncluded"
                  checked={formData.taxIncluded}
                  onCheckedChange={(checked) => handleChange('taxIncluded', checked)}
                />
                <Label htmlFor="taxIncluded">Tax Included</Label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Price Group
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/dashboard/products/selling-price-group')}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.name && formData.code && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Code:</strong> {formData.code}</div>
                  <div><strong>Type:</strong> {formData.type}</div>
                  <div><strong>Markup:</strong> {formData.markupValue}{formData.type === 'percentage' ? '%' : '$'}</div>
                  {formData.discountType !== 'none' && (
                    <div><strong>Discount:</strong> {formData.discountValue}{formData.discountType === 'percentage' ? '%' : '$'}</div>
                  )}
                  <div><strong>Min Qty:</strong> {formData.minimumQuantity}</div>
                  <div><strong>Status:</strong> {formData.isActive ? 'Active' : 'Inactive'}</div>
                  {formData.isDefault && <div><strong>Default Group</strong></div>}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}

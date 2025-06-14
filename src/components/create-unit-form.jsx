"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Save, 
  ArrowLeft, 
  Package, 
  Scale, 
  Volume2, 
  Ruler, 
  Square,
  Calculator,
  Info
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
import { toast } from "sonner"

const unitTypes = [
  { value: 'count', label: 'Count', icon: Package, description: 'Discrete quantities (pieces, items)' },
  { value: 'weight', label: 'Weight', icon: Scale, description: 'Mass measurements (kg, g, lb)' },
  { value: 'volume', label: 'Volume', icon: Volume2, description: 'Volume measurements (L, mL, gal)' },
  { value: 'length', label: 'Length', icon: Ruler, description: 'Linear measurements (m, cm, ft)' },
  { value: 'area', label: 'Area', icon: Square, description: 'Surface measurements (m², cm², sq ft)' },
  { value: 'package', label: 'Package', icon: Package, description: 'Packaging units (box, carton, pallet)' }
]

const unitCategories = [
  'Quantity',
  'Weight', 
  'Volume',
  'Length',
  'Area',
  'Packaging',
  'Custom'
]

export default function CreateUnitForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [baseUnits, setBaseUnits] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    abbreviation: '',
    type: '',
    category: '',
    description: '',
    baseUnit: '',
    conversionFactor: 1,
    isBaseUnit: false,
    isActive: true,
    sortOrder: 100
  })
  const [errors, setErrors] = useState({})

  // Fetch base units for conversion
  const fetchBaseUnits = async () => {
    try {
      const response = await fetch('/api/products/units')
      const data = await response.json()
      
      if (data.success) {
        setBaseUnits(data.units.filter(unit => unit.isBaseUnit))
      }
    } catch (error) {
      console.error('Error fetching base units:', error)
    }
  }

  useEffect(() => {
    fetchBaseUnits()
  }, [])

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

    // Auto-generate abbreviation from symbol if not manually set
    if (field === 'symbol' && !formData.abbreviation) {
      setFormData(prev => ({
        ...prev,
        abbreviation: value
      }))
    }

    // Clear base unit and conversion when switching to base unit
    if (field === 'isBaseUnit' && value) {
      setFormData(prev => ({
        ...prev,
        baseUnit: '',
        conversionFactor: 1
      }))
    }

    // Set conversion factor to 1 when selecting base unit
    if (field === 'isBaseUnit' && value) {
      setFormData(prev => ({
        ...prev,
        conversionFactor: 1
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Unit name is required'
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Unit symbol is required'
    }

    if (!formData.type) {
      newErrors.type = 'Unit type is required'
    }

    if (!formData.category) {
      newErrors.category = 'Unit category is required'
    }

    if (!formData.isBaseUnit) {
      if (!formData.baseUnit) {
        newErrors.baseUnit = 'Base unit is required for derived units'
      }
      
      if (!formData.conversionFactor || formData.conversionFactor <= 0) {
        newErrors.conversionFactor = 'Conversion factor must be greater than 0'
      }
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
      const response = await fetch('/api/products/units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Unit created successfully!')
        router.push('/dashboard/products/units')
      } else {
        toast.error(result.error || 'Failed to create unit')
      }
    } catch (error) {
      console.error('Error creating unit:', error)
      toast.error('An error occurred while creating the unit')
    } finally {
      setLoading(false)
    }
  }

  // Filter base units by type for conversion
  const availableBaseUnits = baseUnits.filter(unit => 
    unit.type === formData.type && unit.id !== formData.id
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Unit Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Kilogram, Piece, Box"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol *</Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) => handleChange('symbol', e.target.value)}
                    placeholder="e.g., kg, pcs, box"
                    className={errors.symbol ? 'border-destructive' : ''}
                  />
                  {errors.symbol && (
                    <p className="text-sm text-destructive">{errors.symbol}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="abbreviation">Abbreviation</Label>
                  <Input
                    id="abbreviation"
                    value={formData.abbreviation}
                    onChange={(e) => handleChange('abbreviation', e.target.value)}
                    placeholder="e.g., kg, pc, bx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => handleChange('sortOrder', parseInt(e.target.value))}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of the unit..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Unit Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                  <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitTypes.map((type) => {
                      const IconComponent = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Conversion Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isBaseUnit"
                  checked={formData.isBaseUnit}
                  onCheckedChange={(checked) => handleChange('isBaseUnit', checked)}
                />
                <Label htmlFor="isBaseUnit">This is a base unit</Label>
              </div>

              {formData.isBaseUnit && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Base units are the fundamental units for their type. Other units can be derived from base units using conversion factors.
                  </AlertDescription>
                </Alert>
              )}

              {!formData.isBaseUnit && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseUnit">Base Unit *</Label>
                    <Select 
                      value={formData.baseUnit} 
                      onValueChange={(value) => handleChange('baseUnit', value)}
                      disabled={!formData.type}
                    >
                      <SelectTrigger className={errors.baseUnit ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select base unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBaseUnits.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name} ({unit.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.baseUnit && (
                      <p className="text-sm text-destructive">{errors.baseUnit}</p>
                    )}
                    {formData.type && availableBaseUnits.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No base units available for this type. Consider creating a base unit first.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conversionFactor">Conversion Factor *</Label>
                    <Input
                      id="conversionFactor"
                      type="number"
                      step="0.001"
                      value={formData.conversionFactor}
                      onChange={(e) => handleChange('conversionFactor', parseFloat(e.target.value))}
                      placeholder="1.0"
                      className={errors.conversionFactor ? 'border-destructive' : ''}
                    />
                    {errors.conversionFactor && (
                      <p className="text-sm text-destructive">{errors.conversionFactor}</p>
                    )}
                    {formData.baseUnit && formData.conversionFactor && (
                      <p className="text-sm text-muted-foreground">
                        1 {formData.symbol || 'unit'} = {formData.conversionFactor} {
                          baseUnits.find(u => u.id === formData.baseUnit)?.symbol || 'base unit'
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
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
                    Create Unit
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/dashboard/products/units')}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.name && formData.symbol && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Symbol:</strong> {formData.symbol}</div>
                  {formData.type && <div><strong>Type:</strong> {formData.type}</div>}
                  {formData.category && <div><strong>Category:</strong> {formData.category}</div>}
                  <div><strong>Status:</strong> {formData.isActive ? 'Active' : 'Inactive'}</div>
                  <div><strong>Base Unit:</strong> {formData.isBaseUnit ? 'Yes' : 'No'}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}

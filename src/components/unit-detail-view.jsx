"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Edit2, 
  Trash2, 
  Package, 
  Scale, 
  Volume2, 
  Ruler, 
  Square,
  CheckCircle2,
  XCircle,
  Calculator,
  Calendar,
  User,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const unitIcons = {
  count: Package,
  weight: Scale,
  volume: Volume2,
  length: Ruler,
  area: Square,
  package: Package
}

export default function UnitDetailView({ unitId }) {
  const router = useRouter()
  const [unit, setUnit] = useState(null)
  const [allUnits, setAllUnits] = useState([])
  const [relatedUnits, setRelatedUnits] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch unit details
  const fetchUnitDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/units/${unitId}`)
      const data = await response.json()
      
      if (data.success) {
        setUnit(data.unit)
      } else {
        toast.error('Unit not found')
        router.push('/dashboard/products/units')
      }
    } catch (error) {
      console.error('Error fetching unit details:', error)
      toast.error('Error loading unit details')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all units to find relationships
  const fetchAllUnits = async () => {
    try {
      const response = await fetch('/api/products/units')
      const data = await response.json()
      
      if (data.success) {
        setAllUnits(data.units)
      }
    } catch (error) {
      console.error('Error fetching units:', error)
    }
  }

  useEffect(() => {
    if (unitId) {
      fetchUnitDetails()
      fetchAllUnits()
    }
  }, [unitId])

  // Find related units when unit and allUnits are loaded
  useEffect(() => {
    if (unit && allUnits.length > 0) {
      // Find units that are derived from this unit or units this unit is derived from
      const related = allUnits.filter(u => 
        u.id !== unit.id && (
          u.baseUnit === unit.id || // Units derived from this unit
          (unit.baseUnit && u.baseUnit === unit.baseUnit) || // Sibling units
          (unit.baseUnit === u.id) // The base unit this unit derives from
        )
      )
      setRelatedUnits(related)
    }
  }, [unit, allUnits])

  // Delete unit
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/products/units/${unitId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success('Unit deleted successfully')
        router.push('/dashboard/products/units')
      } else {
        toast.error('Failed to delete unit')
      }
    } catch (error) {
      console.error('Error deleting unit:', error)
      toast.error('Error deleting unit')
    }
  }

  // Toggle unit status
  const toggleUnitStatus = async () => {
    try {
      const response = await fetch(`/api/products/units/${unitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !unit.isActive
        }),
      })
      
      if (response.ok) {
        toast.success(`Unit ${!unit.isActive ? 'activated' : 'deactivated'} successfully`)
        fetchUnitDetails() // Refresh the data
      } else {
        toast.error('Failed to update unit status')
      }
    } catch (error) {
      console.error('Error updating unit status:', error)
      toast.error('Error updating unit status')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBaseUnitName = (baseUnitId) => {
    const baseUnit = allUnits.find(u => u.id === baseUnitId)
    return baseUnit ? baseUnit.name : 'Unknown'
  }

  const getBaseUnitSymbol = (baseUnitId) => {
    const baseUnit = allUnits.find(u => u.id === baseUnitId)
    return baseUnit ? baseUnit.symbol : '?'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading unit details...</p>
        </div>
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unit not found.</p>
      </div>
    )
  }

  const IconComponent = unitIcons[unit.type] || Package

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <IconComponent className="h-8 w-8 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-bold">{unit.name}</h1>
            <p className="text-muted-foreground">
              Symbol: <code className="bg-muted px-2 py-1 rounded text-sm">{unit.symbol}</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={unit.isActive ? "default" : "secondary"}>
            {unit.isActive ? (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {unit.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/products/units/${unit.id}/edit`)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Unit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleUnitStatus}>
                {unit.isActive ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Unit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{unit.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Symbol</label>
                  <p className="text-sm">
                    <code className="bg-muted px-2 py-1 rounded">{unit.symbol}</code>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Abbreviation</label>
                  <p className="text-sm">{unit.abbreviation || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sort Order</label>
                  <p className="text-sm">{unit.sortOrder}</p>
                </div>
              </div>
              {unit.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm">{unit.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Classification */}
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="flex items-center gap-2 mt-1">
                    <IconComponent className="h-4 w-4" />
                    <Badge variant="outline">
                      {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="mt-1">
                    <Badge variant="secondary">{unit.category}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Conversion Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Base Unit</label>
                  <div className="flex items-center gap-2 mt-1">
                    {unit.isBaseUnit ? (
                      <Badge variant="default">This is a base unit</Badge>
                    ) : (
                      <p className="text-sm">
                        {unit.baseUnit ? getBaseUnitName(unit.baseUnit) : 'None'}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Conversion Factor</label>
                  <p className="text-sm">
                    {unit.isBaseUnit ? '1 (Base)' : unit.conversionFactor}
                  </p>
                </div>
              </div>
              {!unit.isBaseUnit && unit.baseUnit && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Conversion:</strong> 1 {unit.symbol} = {unit.conversionFactor} {getBaseUnitSymbol(unit.baseUnit)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Units */}
          {relatedUnits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Units</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedUnits.map((relatedUnit) => {
                    const RelatedIconComponent = unitIcons[relatedUnit.type] || Package
                    return (
                      <div 
                        key={relatedUnit.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => router.push(`/dashboard/products/units/${relatedUnit.id}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <RelatedIconComponent className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{relatedUnit.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {relatedUnit.symbol} • {relatedUnit.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={relatedUnit.isActive ? "default" : "secondary"} className="text-xs">
                            {relatedUnit.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {!relatedUnit.isBaseUnit && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Factor: {relatedUnit.conversionFactor}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push(`/dashboard/products/units/${unit.id}/edit`)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Unit
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={toggleUnitStatus}
              >
                {unit.isActive ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created
                </label>
                <p className="text-sm">{formatDate(unit.createdAt)}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Last Updated
                </label>
                <p className="text-sm">{formatDate(unit.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Unit Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{relatedUnits.length}</p>
                  <p className="text-xs text-muted-foreground">Related Units</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {unit.isBaseUnit ? '∞' : unit.conversionFactor}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {unit.isBaseUnit ? 'Base Factor' : 'Conv. Factor'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

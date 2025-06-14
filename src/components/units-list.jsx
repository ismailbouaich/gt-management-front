"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye,
  CheckCircle2,
  XCircle,
  Package,
  Ruler,
  Scale,
  Volume2,
  Square,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const unitIcons = {
  count: Package,
  weight: Scale,
  volume: Volume2,
  length: Ruler,
  area: Square,
  package: Package
}

const unitCategories = [
  'all',
  'Quantity',
  'Weight', 
  'Volume',
  'Length',
  'Area',
  'Packaging'
]

const unitTypes = [
  'all',
  'count',
  'weight',
  'volume', 
  'length',
  'area',
  'package'
]

export default function UnitsList() {
  const router = useRouter()
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [filteredUnits, setFilteredUnits] = useState([])

  // Fetch units from API
  const fetchUnits = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products/units')
      const data = await response.json()
      
      if (data.success) {
        setUnits(data.units)
        setFilteredUnits(data.units)
      } else {
        toast.error('Failed to fetch units')
      }
    } catch (error) {
      console.error('Error fetching units:', error)
      toast.error('Error loading units')
    } finally {
      setLoading(false)
    }
  }

  // Filter units based on search and filters
  useEffect(() => {
    let filtered = units

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(unit => 
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(unit => unit.category === selectedCategory)
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(unit => unit.type === selectedType)
    }

    setFilteredUnits(filtered)
  }, [units, searchQuery, selectedCategory, selectedType])

  // Delete unit
  const handleDelete = async (unitId) => {
    if (!confirm('Are you sure you want to delete this unit?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/units/${unitId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success('Unit deleted successfully')
        fetchUnits() // Refresh the list
      } else {
        toast.error('Failed to delete unit')
      }
    } catch (error) {
      console.error('Error deleting unit:', error)
      toast.error('Error deleting unit')
    }
  }

  // Toggle unit status
  const toggleUnitStatus = async (unitId, currentStatus) => {
    try {
      const response = await fetch(`/api/products/units/${unitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      })
      
      if (response.ok) {
        toast.success(`Unit ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        fetchUnits() // Refresh the list
      } else {
        toast.error('Failed to update unit status')
      }
    } catch (error) {
      console.error('Error updating unit status:', error)
      toast.error('Error updating unit status')
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  const formatConversionInfo = (unit) => {
    if (unit.isBaseUnit) {
      return "Base unit"
    } else if (unit.baseUnit && unit.conversionFactor) {
      const baseUnitName = units.find(u => u.id === unit.baseUnit)?.name || 'Unknown'
      return `1 ${unit.symbol} = ${unit.conversionFactor} ${baseUnitName}`
    }
    return "-"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading units...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Units</p>
                <p className="text-2xl font-bold">{units.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">{units.filter(u => u.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Ruler className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Base Units</p>
                <p className="text-2xl font-bold">{units.filter(u => u.isBaseUnit).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold">{new Set(units.map(u => u.category)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Units Management</CardTitle>
            <Button 
              onClick={() => router.push('/dashboard/products/units/create')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Unit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search units by name, symbol, abbreviation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {unitCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {unitTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Units Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Conversion</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => {
                    const IconComponent = unitIcons[unit.type] || Package
                    return (
                      <TableRow key={unit.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{unit.name}</div>
                              {unit.description && (
                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                  {unit.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {unit.symbol}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {unit.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatConversionInfo(unit)}
                          </span>
                          {unit.isBaseUnit && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Base
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={unit.isActive ? "default" : "secondary"}>
                            {unit.isActive ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {unit.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/products/units/${unit.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/products/units/${unit.id}/edit`)}
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit Unit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => toggleUnitStatus(unit.id, unit.isActive)}
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
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(unit.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Unit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
                          ? 'No units found matching your filters.'
                          : 'No units available. Create your first unit to get started.'}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredUnits.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredUnits.length} of {units.length} units
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

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
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Percent,
  MoreHorizontal,
  Users,
  Calendar,
  Target
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

const priceGroupTypes = [
  'all',
  'percentage',
  'fixed'
]

const markupTypes = [
  'all',
  'cost',
  'retail'
]

export default function SellingPriceGroupsList() {
  const router = useRouter()
  const [priceGroups, setPriceGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedMarkupType, setSelectedMarkupType] = useState("all")
  const [filteredGroups, setFilteredGroups] = useState([])
  const [statistics, setStatistics] = useState({})

  // Fetch price groups from API
  const fetchPriceGroups = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products/selling-price-groups')
      const data = await response.json()
      
      if (data.success) {
        setPriceGroups(data.priceGroups)
        setFilteredGroups(data.priceGroups)
        setStatistics(data.statistics)
      } else {
        toast.error('Failed to fetch price groups')
      }
    } catch (error) {
      console.error('Error fetching price groups:', error)
      toast.error('Error loading price groups')
    } finally {
      setLoading(false)
    }
  }

  // Filter price groups based on search and filters
  useEffect(() => {
    let filtered = priceGroups

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(group => group.type === selectedType)
    }

    // Apply markup type filter
    if (selectedMarkupType !== 'all') {
      filtered = filtered.filter(group => group.markupType === selectedMarkupType)
    }

    setFilteredGroups(filtered)
  }, [priceGroups, searchQuery, selectedType, selectedMarkupType])

  // Delete price group
  const handleDelete = async (groupId, isDefault) => {
    if (isDefault) {
      toast.error('Cannot delete the default price group')
      return
    }

    if (!confirm('Are you sure you want to delete this price group?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/selling-price-groups/${groupId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success('Price group deleted successfully')
        fetchPriceGroups() // Refresh the list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete price group')
      }
    } catch (error) {
      console.error('Error deleting price group:', error)
      toast.error('Error deleting price group')
    }
  }

  // Toggle price group status
  const toggleGroupStatus = async (groupId, currentStatus) => {
    try {
      const response = await fetch(`/api/products/selling-price-groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      })
      
      if (response.ok) {
        toast.success(`Price group ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        fetchPriceGroups() // Refresh the list
      } else {
        toast.error('Failed to update price group status')
      }
    } catch (error) {
      console.error('Error updating price group status:', error)
      toast.error('Error updating price group status')
    }
  }

  // Set as default price group
  const setAsDefault = async (groupId) => {
    try {
      const response = await fetch(`/api/products/selling-price-groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDefault: true
        }),
      })
      
      if (response.ok) {
        toast.success('Default price group updated successfully')
        fetchPriceGroups() // Refresh the list
      } else {
        toast.error('Failed to set default price group')
      }
    } catch (error) {
      console.error('Error setting default price group:', error)
      toast.error('Error setting default price group')
    }
  }

  useEffect(() => {
    fetchPriceGroups()
  }, [])

  const formatMarkupInfo = (group) => {
    const markup = group.markupValue > 0 ? `+${group.markupValue}%` : '0%'
    const discount = group.discountValue > 0 ? `-${group.discountValue}%` : '0%'
    return `${markup} markup, ${discount} discount`
  }

  const formatValidityPeriod = (validFrom, validTo) => {
    const from = new Date(validFrom).toLocaleDateString()
    if (!validTo) return `From ${from}`
    const to = new Date(validTo).toLocaleDateString()
    return `${from} - ${to}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading price groups...</p>
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
              <DollarSign className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Groups</p>
                <p className="text-2xl font-bold">{statistics.total || 0}</p>
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
                <p className="text-2xl font-bold">{statistics.active || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Default Group</p>
                <p className="text-sm font-semibold truncate">{statistics.defaultGroup || 'None'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Types</p>
                <p className="text-2xl font-bold">{statistics.types || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Selling Price Groups</CardTitle>
            <Button 
              onClick={() => router.push('/dashboard/products/selling-price-group/create')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Price Group
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search price groups by name, code, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {priceGroupTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMarkupType} onValueChange={setSelectedMarkupType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Markup Type" />
              </SelectTrigger>
              <SelectContent>
                {markupTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Markup Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Groups Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Quantity Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{group.name}</span>
                              {group.isDefault && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Default
                                </Badge>
                              )}
                            </div>
                            {group.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {group.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {group.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline">
                            {group.type.charAt(0).toUpperCase() + group.type.slice(1)}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {group.markupType} base
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span>+{group.markupValue}%</span>
                          </div>
                          {group.discountValue > 0 && (
                            <div className="flex items-center gap-1 text-sm">
                              <TrendingDown className="h-3 w-3 text-red-500" />
                              <span>-{group.discountValue}%</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Min: {group.minimumQuantity}</div>
                          <div>Max: {group.maximumQuantity || '∞'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={group.isActive ? "default" : "secondary"}>
                            {group.isActive ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {group.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {group.validTo && new Date(group.validTo) < new Date() && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                        </div>
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
                              onClick={() => router.push(`/dashboard/products/selling-price-group/${group.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/products/selling-price-group/${group.id}/edit`)}
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit Group
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!group.isDefault && (
                              <DropdownMenuItem
                                onClick={() => setAsDefault(group.id)}
                              >
                                <Star className="mr-2 h-4 w-4" />
                                Set as Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => toggleGroupStatus(group.id, group.isActive)}
                            >
                              {group.isActive ? (
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
                              onClick={() => handleDelete(group.id, group.isDefault)}
                              className="text-destructive"
                              disabled={group.isDefault}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Group
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchQuery || selectedType !== 'all' || selectedMarkupType !== 'all'
                          ? 'No price groups found matching your filters.'
                          : 'No price groups available. Create your first price group to get started.'}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredGroups.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredGroups.length} of {priceGroups.length} price groups
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

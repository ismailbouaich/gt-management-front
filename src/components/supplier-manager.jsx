"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Building2,
  DollarSign,
  Package,
  Phone,
  Mail,
  MapPin,
  Star,
  Truck
} from "lucide-react"
import { format } from "date-fns"
import { supplierService } from "@/services/supplierService"

export function SupplierManager({ quickCreate = false }) {
  const [suppliers, setSuppliers] = useState([])
  const [supplierTypes, setSupplierTypes] = useState([])
  const [statusOptions, setStatusOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Load data from API using supplier service
  useEffect(() => {
    fetchSuppliers()
    fetchMetadata()
  }, [])

  const fetchSuppliers = async (params = {}) => {
    try {
      setLoading(true)
      const response = await supplierService.getSuppliers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        type: filterType,
        status: filterStatus,
        ...params
      })
      
      setSuppliers(response.suppliers || [])
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }))
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }
  const fetchMetadata = async () => {
    try {
      const metadata = await supplierService.getSupplierMetadata()
      setSupplierTypes(metadata.types || [])
      setStatusOptions(metadata.statuses || [])
    } catch (error) {
      console.error('Error fetching supplier metadata:', error)
      // Fallback to default values
      setSupplierTypes(['Manufacturer', 'Distributor', 'Service Provider'])
      setStatusOptions(['Active', 'Inactive', 'Pending'])
    }
  }

  // Refetch when search or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuppliers({ page: 1 }) // Reset to page 1 when filtering
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, filterType, filterStatus])

  // Use the suppliers from API response instead of client-side filtering
  const filteredSuppliers = suppliers
  const totalSuppliers = pagination.total
  const totalOrderValue = suppliers.reduce((sum, supplier) => sum + (supplier.totalOrders || 0), 0)
  const averageRating = suppliers.length > 0 
    ? suppliers.reduce((sum, supplier) => sum + (parseFloat(supplier.rating) || 0), 0) / suppliers.length 
    : 0
    const handleDelete = async (id) => {
    try {
      await supplierService.deleteSupplier(id)
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id))
    } catch (error) {
      console.error('Error deleting supplier:', error)
      // You could show a toast notification here
    }
  }

  const handleEdit = (supplier) => {
    // For now, redirect to a supplier edit page (you can implement this later)
    // window.location.href = `/dashboard/suppliers/edit/${supplier.id}`
    console.log("Edit supplier:", supplier)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Inactive": return "bg-gray-100 text-gray-800"
      case "Suspended": return "bg-red-100 text-red-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }
  const exportSuppliers = async () => {
    try {
      await supplierService.exportSuppliers('csv', {
        search: searchTerm,
        type: filterType,
        status: filterStatus
      })
    } catch (error) {
      console.error('Error exporting suppliers:', error)
      // Fallback to manual export
      const csvContent = [
        ["Name", "Contact Person", "Email", "Phone", "Type", "Address", "Rating", "Total Orders", "Status", "Join Date"],
        ...filteredSuppliers.map(supplier => [
          supplier.name,
          supplier.contactPerson,
          supplier.email,
          supplier.phone,
          supplier.supplierType,
          supplier.address?.full || "",
          supplier.rating,
          supplier.totalOrderValue,
          supplier.status,
          format(new Date(supplier.joinDate || supplier.createdAt), 'yyyy-MM-dd')
        ])
      ].map(row => row.join(",")).join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `suppliers-${format(new Date(), 'yyyy-MM-dd')}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Active supplier network
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOrderValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total procurement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Supplier performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredSuppliers.filter(s => s.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Supplier Management
              </CardTitle>
              <CardDescription>
                Manage your suppliers and vendor relationships
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportSuppliers}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Link href="/dashboard/suppliers/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterType || "all"} onValueChange={(value) => setFilterType(value === "all" ? "" : value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {supplierTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus || "all"} onValueChange={(value) => setFilterStatus(value === "all" ? "" : value)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Suppliers Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Order Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan="8" className="text-center py-8">
                      Loading suppliers...
                    </TableCell>
                  </TableRow>
                ) : filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="8" className="text-center py-8">
                      No suppliers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-muted-foreground">{supplier.company}</div>
                        </div>
                      </TableCell><TableCell>
                      <Badge variant="outline">
                        {supplier.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="text-sm">{supplier.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span className="text-sm">{supplier.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="text-sm">{supplier.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getRatingStars(supplier.rating || 0)}
                        <span className="text-sm ml-1">({supplier.rating || 0})</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(supplier.totalOrders || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(supplier.status)}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(supplier.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>                      </div>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredSuppliers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No suppliers found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

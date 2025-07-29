"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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
  Users,
  DollarSign,
  CreditCard,
  Phone,  Mail
} from "lucide-react"
import { format } from "date-fns"
import { customerService } from "@/services/customerService"

export function CustomerManager({ quickCreate = false }) {
  const [customers, setCustomers] = useState([])
  const [customerTypes, setCustomerTypes] = useState([])
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
  })  // Load data from API using customer service
  useEffect(() => {
    fetchCustomers()
    fetchMetadata()
  }, [])

  const fetchCustomers = async (params = {}) => {
    try {
      setLoading(true)
      const response = await customerService.getCustomers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        type: filterType,
        status: filterStatus,
        ...params
      })
      
      setCustomers(response.customers || [])
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }))
    } catch (error) {
      console.error('Error fetching customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMetadata = async () => {
    try {
      const metadata = await customerService.getCustomerMetadata()
      setCustomerTypes(metadata.types || [])
      setStatusOptions(metadata.statuses || [])
    } catch (error) {
      console.error('Error fetching customer metadata:', error)
      // Fallback to default values
      setCustomerTypes(['Individual', 'Business', 'Corporate'])
      setStatusOptions(['Active', 'Inactive', 'Pending'])
    }
  }

  // Refetch when search or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers({ page: 1 }) // Reset to page 1 when filtering
    }, 300) // Debounce search    return () => clearTimeout(timeoutId)
  }, [searchTerm, filterType, filterStatus])  // Use the customers from API response instead of client-side filtering
  const filteredCustomers = customers
  const totalCustomers = pagination.total
  const totalCreditLimit = customers.reduce((sum, customer) => sum + (customer.creditLimit || 0), 0)
  const totalBalance = customers.reduce((sum, customer) => sum + (customer.currentBalance || 0), 0)
  
  const handleDelete = async (id) => {
    try {
      await customerService.deleteCustomer(id)
      setCustomers(prev => prev.filter(customer => customer.id !== id))
    } catch (error) {
      console.error('Error deleting customer:', error)
      // You could show a toast notification here
    }
  }

  const handleEdit = (customer) => {
    // For now, redirect to a customer edit page (you can implement this later)
    // window.location.href = `/dashboard/customers/edit/${customer.id}`
    console.log("Edit customer:", customer)
  }
  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700"
      case "Inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700"
      case "Suspended": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }
  const exportCustomers = async () => {
    try {
      await customerService.exportCustomers('csv', {
        search: searchTerm,
        type: filterType,
        status: filterStatus
      })
    } catch (error) {
      console.error('Error exporting customers:', error)
      // Fallback to manual export
      const csvContent = [
        ["Name", "Email", "Phone", "Type", "Address", "Credit Limit", "Current Balance", "Tax Number", "Status", "Join Date"],
        ...filteredCustomers.map(customer => [
          customer.name,
          customer.email,
          customer.phone,
          customer.customerType,
          customer.address,
          customer.creditLimit,
          customer.currentBalance,
          customer.taxNumber,
          customer.status,
          format(new Date(customer.joinDate), 'yyyy-MM-dd')
        ])
      ].map(row => row.join(",")).join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `customers-${format(new Date(), 'yyyy-MM-dd')}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ 
            scale: 1.01,
            y: -2,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.99 }}
        >          <Card className="relative overflow-hidden border transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-blue-500/5 group">
            {/* Progress Bar from Center on Hover */}
            <motion.div
              className="absolute bottom-0 left-1/2 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 opacity-0 group-hover:opacity-100"
              initial={{ width: 0, x: "-50%" }}
              whileHover={{
                width: "100%",
                transition: { duration: 0.6, ease: "easeOut" }
              }}
              transition={{ duration: 0.3 }}
            />
            

            
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20"
              animate={{ 
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <motion.div
                whileHover={{ 
                  rotate: 15,
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              >
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                className="text-2xl font-bold text-blue-700 dark:text-blue-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {totalCustomers}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                Active customer base
              </p>
            </CardContent>
          </Card>
        </motion.div>        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ 
            scale: 1.01,
            y: -2,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.99 }}
        >          <Card className="relative overflow-hidden border transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-green-500/5 group">
            {/* Progress Bar from Center on Hover */}
            <motion.div
              className="absolute bottom-0 left-1/2 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 opacity-0 group-hover:opacity-100"
              initial={{ width: 0, x: "-50%" }}
              whileHover={{
                width: "100%",
                transition: { duration: 0.6, ease: "easeOut" }
              }}
              transition={{ duration: 0.3 }}
            />
            

            
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20"
              animate={{ 
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Total Credit Limit</CardTitle>
              <motion.div
                whileHover={{ 
                  rotate: 15,
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              >
                <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                className="text-2xl font-bold text-green-700 dark:text-green-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                ${totalCreditLimit.toFixed(2)}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                Available credit
              </p>
            </CardContent>
          </Card>
        </motion.div>        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ 
            scale: 1.01,
            y: -2,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.99 }}
        >          <Card className="relative overflow-hidden border transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-amber-500/5 group">
            {/* Progress Bar from Center on Hover */}
            <motion.div
              className="absolute bottom-0 left-1/2 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 opacity-0 group-hover:opacity-100"
              initial={{ width: 0, x: "-50%" }}
              whileHover={{
                width: "100%",
                transition: { duration: 0.6, ease: "easeOut" }
              }}
              transition={{ duration: 0.3 }}
            />
            

            
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20"
              animate={{ 
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
              <motion.div
                whileHover={{ 
                  rotate: 15,
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              >
                <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                className="text-2xl font-bold text-amber-700 dark:text-amber-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                ${totalBalance.toFixed(2)}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                Total receivables
              </p>
            </CardContent>
          </Card>
        </motion.div>        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          whileHover={{ 
            scale: 1.01,
            y: -2,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.99 }}
        >          <Card className="relative overflow-hidden border transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-pink-500/5 group">
            {/* Progress Bar from Center on Hover */}
            <motion.div
              className="absolute bottom-0 left-1/2 h-1 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 opacity-0 group-hover:opacity-100"
              initial={{ width: 0, x: "-50%" }}
              whileHover={{
                width: "100%",
                transition: { duration: 0.6, ease: "easeOut" }
              }}
              transition={{ duration: 0.3 }}
            />
            

            
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-pink-100/30 dark:from-pink-950/30 dark:to-pink-900/20"
              animate={{ 
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 6 }}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <motion.div
                whileHover={{ 
                  rotate: 15,
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              >
                <Users className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                className="text-2xl font-bold text-pink-700 dark:text-pink-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                {filteredCustomers.filter(c => c.status === "Active").length}
              </motion.div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="relative overflow-hidden border transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-slate-500/5">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-blue-50/20 dark:from-slate-900/30 dark:to-blue-950/20"
            animate={{ 
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <CardHeader className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  Customer Management
                </CardTitle>
                <CardDescription>
                  Manage your customers and their information
                </CardDescription>
              </div>              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" onClick={exportCustomers}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </motion.div>
                <Link href="/dashboard/customers/create">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Customer
                    </Button>
                  </motion.div>
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
                  placeholder="Search customers..."
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
                {customerTypes.map((type) => (
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

          {/* Customers Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        Loading customers...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">No customers found matching your criteria.</p>
                    </TableCell>
                  </TableRow>                ) : (
                  <AnimatePresence mode="wait">
                    {filteredCustomers.map((customer, index) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.05,
                          type: "spring", 
                          stiffness: 100                        }}
                        whileHover={{ 
                          scale: 1.01,
                          transition: { duration: 0.2 }
                        }}
                        className="border-b transition-colors"
                      >
                        <TableCell className="font-medium">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <div>{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.taxNumber}</div>
                          </motion.div>
                        </TableCell>
                         <TableCell>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.25 }}
                        >                          <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-700 dark:text-blue-300">
                            {customer.customerType}
                          </Badge>
                        </motion.div>
                      </TableCell>
                       <TableCell>
                        <motion.div 
                          className="space-y-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.3 }}
                        >
                          <motion.div 
                            className="flex items-center gap-1"
                            whileHover={{ x: 5 }}
                          >
                            <Mail className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                            <span className="text-sm">{customer.email}</span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-1"
                            whileHover={{ x: 5 }}
                          >
                            <Phone className="h-3 w-3 text-green-500 dark:text-green-400" />
                            <span className="text-sm">{customer.phone}</span>
                          </motion.div>
                        </motion.div>
                      </TableCell>
                       <TableCell className="font-medium">
                      ${(customer.creditLimit || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(customer.currentBalance || 0).toFixed(2)}
                    </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                      {customer.joinDate ? format(new Date(customer.joinDate), 'MMM dd, yyyy') : 'N/A'}
                    </TableCell>
                     <TableCell>
                          <motion.div 
                            className="flex gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.4 }}
                          >
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(customer)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(customer.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </motion.div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </div>          {filteredCustomers.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No customers found matching your criteria.</p>
            </div>
          )}
        </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

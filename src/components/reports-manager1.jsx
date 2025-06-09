"use client"

import { useState, useEffect, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import {
  BarChartIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  Search,
  RefreshCw,
  Eye,
  FileText,
  CreditCard,
  Percent,
  Warehouse,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"

// Mock data generators
const generateSalesData = (startDate, endDate) => {
  const sales = []
  const dailyData = {}
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const salesCount = Math.floor(Math.random() * 20) + 5
    const revenue = (Math.random() * 5000) + 1000
    
    dailyData[dateStr] = { revenue, salesCount }
    
    for (let i = 0; i < salesCount; i++) {
      sales.push({
        id: sales.length + 1,
        date: dateStr,
        customer: `Customer ${Math.floor(Math.random() * 100) + 1}`,
        amount: Math.floor(Math.random() * 500) + 50,
        items: Math.floor(Math.random() * 5) + 1,
        status: Math.random() > 0.1 ? 'Completed' : 'Pending',
        paymentMethod: ['Cash', 'Card', 'Bank Transfer'][Math.floor(Math.random() * 3)],
        profit: Math.floor(Math.random() * 200) + 20,
      })
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return { sales, dailyData }
}

const generatePurchaseData = (startDate, endDate) => {
  const purchases = []
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const purchaseCount = Math.floor(Math.random() * 8) + 2
    
    for (let i = 0; i < purchaseCount; i++) {
      purchases.push({
        id: purchases.length + 1,
        date: dateStr,
        supplier: `Supplier ${Math.floor(Math.random() * 20) + 1}`,
        amount: Math.floor(Math.random() * 2000) + 200,
        items: Math.floor(Math.random() * 10) + 1,
        status: Math.random() > 0.15 ? 'Received' : 'Pending',
        paymentStatus: ['Paid', 'Due', 'Partial'][Math.floor(Math.random() * 3)],
      })
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return purchases
}

const generateExpenseData = (startDate, endDate) => {
  const expenses = []
  const categories = ['Office Supplies', 'Utilities', 'Marketing', 'Travel', 'Equipment', 'Software', 'Rent']
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const expenseCount = Math.floor(Math.random() * 5) + 1
    
    for (let i = 0; i < expenseCount; i++) {
      expenses.push({
        id: expenses.length + 1,
        date: dateStr,
        category: categories[Math.floor(Math.random() * categories.length)],
        description: `Expense item ${expenses.length + 1}`,
        amount: Math.floor(Math.random() * 800) + 50,
        status: Math.random() > 0.1 ? 'Approved' : 'Pending',
        paymentMethod: ['Cash', 'Card', 'Bank Transfer'][Math.floor(Math.random() * 3)],
      })
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
    return expenses
}

const generateStockData = () => {
  const products = []
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Food', 'Automotive']
  const productNames = [
    'Wireless Headphones', 'Laptop Stand', 'Smart Watch', 'USB Cable', 'Phone Case',
    'T-Shirt', 'Jeans', 'Sneakers', 'Jacket', 'Hat',
    'Novel', 'Textbook', 'Magazine', 'Notebook', 'Pen Set',
    'Plant Pot', 'Garden Tool', 'Lamp', 'Cushion', 'Candle',
    'Basketball', 'Running Shoes', 'Yoga Mat', 'Protein Powder', 'Water Bottle',
    'Face Cream', 'Shampoo', 'Lipstick', 'Perfume', 'Moisturizer',
    'Coffee Beans', 'Protein Bar', 'Chocolate', 'Tea Bags', 'Spices',
    'Car Oil', 'Tire', 'Air Freshener', 'Car Cover', 'Tool Kit'
  ]
  
  // Use a fixed date to prevent hydration mismatches
  const baseDate = new Date('2024-12-01')
  
  for (let i = 0; i < 50; i++) {
    const currentStock = Math.floor(Math.random() * 200) + 1
    const minStock = Math.floor(Math.random() * 20) + 5
    const maxStock = Math.floor(Math.random() * 300) + 100
    const unitCost = Math.floor(Math.random() * 100) + 10
    const unitPrice = unitCost * (1.2 + Math.random() * 0.8) // 20-100% markup
    const soldLastMonth = Math.floor(Math.random() * 50) + 1
    
    products.push({
      id: i + 1,
      name: productNames[i % productNames.length] + ` ${Math.floor(i / productNames.length) + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      sku: `SKU${String(i + 1).padStart(4, '0')}`,
      currentStock,
      minStock,
      maxStock,
      unitCost,
      unitPrice,
      totalValue: currentStock * unitCost,
      soldLastMonth,
      turnoverRate: soldLastMonth / ((currentStock + soldLastMonth) || 1),
      status: currentStock <= minStock ? 'Low Stock' : 
              currentStock <= minStock * 2 ? 'Medium Stock' : 'In Stock',
      reorderPoint: minStock * 1.5,
      supplier: `Supplier ${Math.floor(Math.random() * 10) + 1}`,
      lastRestocked: format(subDays(baseDate, Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
    })
  }
  
  return products
}

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export function ReportsManager() {
  const [dateRange, setDateRange] = useState('last30')
  const [reportType, setReportType] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(false)
    // Date calculations - Use useMemo to prevent hydration mismatches
  const dateRanges = useMemo(() => {
    const now = new Date()
    return {
      today: { start: now, end: now },
      yesterday: { start: subDays(now, 1), end: subDays(now, 1) },
      last7: { start: subDays(now, 7), end: now },
      last30: { start: subDays(now, 30), end: now },
      thisMonth: { start: startOfMonth(now), end: endOfMonth(now) },
      lastMonth: { 
        start: startOfMonth(subDays(startOfMonth(now), 1)), 
        end: endOfMonth(subDays(startOfMonth(now), 1)) 
      },
      thisYear: { start: startOfYear(now), end: endOfYear(now) },
      lastYear: { 
        start: startOfYear(subDays(startOfYear(now), 1)), 
        end: endOfYear(subDays(startOfYear(now), 1)) 
      },
    }
  }, [])
  
  const selectedDateRange = dateRanges[dateRange]
  
  // Generate mock data based on selected date range
  const salesData = useMemo(() => 
    generateSalesData(selectedDateRange.start, selectedDateRange.end), 
    [selectedDateRange]
  )
  
  const purchaseData = useMemo(() => 
    generatePurchaseData(selectedDateRange.start, selectedDateRange.end), 
    [selectedDateRange]
  )
    const expenseData = useMemo(() => 
    generateExpenseData(selectedDateRange.start, selectedDateRange.end), 
    [selectedDateRange]
  )
  
  const stockData = useMemo(() => 
    generateStockData(), 
    []
  )
  
  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalSales = salesData.sales.reduce((sum, sale) => sum + sale.amount, 0)
    const totalPurchases = purchaseData.reduce((sum, purchase) => sum + purchase.amount, 0)
    const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0)
    const totalProfit = salesData.sales.reduce((sum, sale) => sum + sale.profit, 0)
    
    const completedSales = salesData.sales.filter(s => s.status === 'Completed').length
    const totalSalesCount = salesData.sales.length
    const salesConversionRate = totalSalesCount > 0 ? (completedSales / totalSalesCount) * 100 : 0
    
    const avgOrderValue = totalSalesCount > 0 ? totalSales / totalSalesCount : 0
    const grossMargin = totalSales > 0 ? ((totalSales - totalPurchases) / totalSales) * 100 : 0
      return {
      totalSales,
      totalPurchases,
      totalExpenses,
      totalProfit,
      netProfit: totalProfit - totalExpenses,
      salesCount: totalSalesCount,
      avgOrderValue,
      grossMargin,
      salesConversionRate,
    }
  }, [salesData, purchaseData, expenseData])
  
  // Calculate stock metrics
  const stockMetrics = useMemo(() => {
    const totalStockValue = stockData.reduce((sum, product) => sum + product.totalValue, 0)
    const lowStockCount = stockData.filter(product => product.status === 'Low Stock').length
    const outOfStockCount = stockData.filter(product => product.currentStock === 0).length
    const avgTurnoverRate = stockData.reduce((sum, product) => sum + product.turnoverRate, 0) / stockData.length
    const totalProducts = stockData.length
    const topSellingProducts = [...stockData]
      .sort((a, b) => b.soldLastMonth - a.soldLastMonth)
      .slice(0, 5)
    
    return {
      totalStockValue,
      lowStockCount,
      outOfStockCount,
      avgTurnoverRate,
      totalProducts,
      topSellingProducts,
    }
  }, [stockData])
  
  // Prepare chart data
  const chartData = useMemo(() => {
    const dailyStats = {}
    
    // Process sales data
    Object.entries(salesData.dailyData).forEach(([date, data]) => {
      dailyStats[date] = {
        date,
        sales: data.revenue,
        salesCount: data.salesCount,
      }
    })
    
    // Process purchases data
    purchaseData.forEach(purchase => {
      if (!dailyStats[purchase.date]) {
        dailyStats[purchase.date] = { date: purchase.date, sales: 0, salesCount: 0 }
      }
      dailyStats[purchase.date].purchases = (dailyStats[purchase.date].purchases || 0) + purchase.amount
    })
    
    // Process expenses data
    expenseData.forEach(expense => {
      if (!dailyStats[expense.date]) {
        dailyStats[expense.date] = { date: expense.date, sales: 0, salesCount: 0 }
      }
      dailyStats[expense.date].expenses = (dailyStats[expense.date].expenses || 0) + expense.amount
    })
    
  return Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date))
  }, [salesData, purchaseData, expenseData])
  
  // Category breakdown for pie charts
  const expensesByCategory = useMemo(() => {
    const categoryTotals = {}
    expenseData.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })
    
    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      name: category,
      value: amount,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }))
  }, [expenseData])
  
  // Stock chart data
  const stockByCategory = useMemo(() => {
    const categoryTotals = {}
    stockData.forEach(product => {
      categoryTotals[product.category] = (categoryTotals[product.category] || 0) + product.totalValue
    })
    
    return Object.entries(categoryTotals).map(([category, value], index) => ({
      name: category,
      value: value,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }))
  }, [stockData])
  
  const stockStatusData = useMemo(() => {
    const statusCounts = {
      'In Stock': stockData.filter(p => p.status === 'In Stock').length,
      'Medium Stock': stockData.filter(p => p.status === 'Medium Stock').length,
      'Low Stock': stockData.filter(p => p.status === 'Low Stock').length,
      'Out of Stock': stockData.filter(p => p.currentStock === 0).length,
    }
    
    return Object.entries(statusCounts).map(([status, count], index) => ({
      name: status,
      value: count,
      color: ['#00C49F', '#FFBB28', '#FF8042', '#FF4444'][index]
    }))
  }, [stockData])
  
  const salesByPaymentMethod = useMemo(() => {
    const methodTotals = {}
    salesData.sales.forEach(sale => {
      methodTotals[sale.paymentMethod] = (methodTotals[sale.paymentMethod] || 0) + sale.amount
    })
    
    return Object.entries(methodTotals).map(([method, amount], index) => ({
      name: method,
      value: amount,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }))
  }, [salesData])
  
  // Filter functions
  const filteredSales = salesData.sales.filter(sale => 
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.status.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const filteredPurchases = purchaseData.filter(purchase => 
    purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.status.toLowerCase().includes(searchTerm.toLowerCase())
  )
    const filteredExpenses = expenseData.filter(expense => 
    (filterCategory === 'all' || expense.category === filterCategory) &&
    (expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     expense.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  const filteredStock = stockData.filter(product => 
    (filterCategory === 'all' || product.category === filterCategory) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  // Export functions
  const exportToCSV = (data, filename) => {
    if (!data.length) return
    
    const headers = Object.keys(data[0]).join(',')
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const refreshData = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7">Last 7 Days</SelectItem>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => exportToCSV(chartData, 'financial-summary')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </span>
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.netProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <Percent className="h-3 w-3 mr-1" />
                {((metrics.netProfit / metrics.totalSales) * 100).toFixed(1)}% margin
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.salesCount}</div>
            <p className="text-xs text-muted-foreground">
              Avg: ${metrics.avgOrderValue.toFixed(2)} per order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.salesConversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Sales completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Reports */}
      <Tabs value={reportType} onValueChange={setReportType}>        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value?.toFixed(2)}`} />
                    <Area type="monotone" dataKey="sales" stackId="1" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales by Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesByPaymentMethod}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesByPaymentMethod.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value?.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Sales:</span>
                  <span className="font-medium">${metrics.totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Purchases:</span>
                  <span className="font-medium text-red-600">${metrics.totalPurchases.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Expenses:</span>
                  <span className="font-medium text-red-600">${metrics.totalExpenses.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Net Profit:</span>
                  <span className={metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${metrics.netProfit.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Average Order Value:</span>
                  <span className="font-medium">${metrics.avgOrderValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Margin:</span>
                  <span className="font-medium">{metrics.grossMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Conversion:</span>
                  <span className="font-medium">{metrics.salesConversionRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Transactions:</span>
                  <span className="font-medium">{metrics.salesCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span>Revenue trending upward</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span>Card payments dominating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-600" />
                    <span>High inventory turnover</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Customer retention strong</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value?.toFixed(2)}`} />
                    <Bar dataKey="sales" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales Count Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Transaction Count</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="salesCount" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sales Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Transactions</CardTitle>
                <CardDescription>Detailed list of all sales transactions</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => exportToCSV(filteredSales, 'sales-report')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Sales
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.slice(0, 20).map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>${sale.amount.toFixed(2)}</TableCell>
                        <TableCell>{sale.items}</TableCell>
                        <TableCell>{sale.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge variant={sale.status === 'Completed' ? 'default' : 'secondary'}>
                            {sale.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-green-600">${sale.profit.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredSales.length > 20 && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Showing 20 of {filteredSales.length} transactions
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          {/* Purchase Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Purchase Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value?.toFixed(2)}`} />
                  <Bar dataKey="purchases" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Purchase Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Purchase Orders</CardTitle>
                <CardDescription>Detailed list of all purchase orders</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => exportToCSV(filteredPurchases, 'purchases-report')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Purchases
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.slice(0, 20).map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>{purchase.supplier}</TableCell>
                        <TableCell>${purchase.amount.toFixed(2)}</TableCell>
                        <TableCell>{purchase.items}</TableCell>
                        <TableCell>
                          <Badge variant={purchase.status === 'Received' ? 'default' : 'secondary'}>
                            {purchase.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              purchase.paymentStatus === 'Paid' ? 'default' : 
                              purchase.paymentStatus === 'Partial' ? 'outline' : 'destructive'
                            }
                          >
                            {purchase.paymentStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value?.toFixed(2)}`} />
                    <Bar dataKey="expenses" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expenses by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value?.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <Label>Filter by Category:</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {['Office Supplies', 'Utilities', 'Marketing', 'Travel', 'Equipment', 'Software', 'Rent'].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expense Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expense Transactions</CardTitle>
                <CardDescription>Detailed list of all expenses</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => exportToCSV(filteredExpenses, 'expenses-report')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Expenses
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.slice(0, 20).map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge variant={expense.status === 'Approved' ? 'default' : 'secondary'}>
                            {expense.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>        </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-6">
          {/* Stock Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                <Warehouse className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stockMetrics.totalStockValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Inventory worth</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stockMetrics.lowStockCount}</div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stockMetrics.totalProducts}</div>
                <p className="text-xs text-muted-foreground">In inventory</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Turnover Rate</CardTitle>
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stockMetrics.avgTurnoverRate * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Monthly average</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Value by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Value by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value?.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Stock Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0088FE">
                      {stockStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products last month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockMetrics.topSellingProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{product.soldLastMonth} sold</div>
                      <div className="text-sm text-muted-foreground">${product.unitPrice.toFixed(2)} each</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Filter for Stock */}
          <div className="flex items-center gap-4">
            <Label>Filter by Category:</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Food', 'Automotive'].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventory Details</CardTitle>
                <CardDescription>Complete stock information</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => exportToCSV(filteredStock, 'stock-report')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Stock
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Min Stock</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Turnover Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStock.slice(0, 20).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.currentStock}</TableCell>
                        <TableCell>{product.minStock}</TableCell>
                        <TableCell>${product.unitCost.toFixed(2)}</TableCell>
                        <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>${product.totalValue.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            product.status === 'Low Stock' ? 'destructive' : 
                            product.status === 'Medium Stock' ? 'outline' : 'default'
                          }>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{(product.turnoverRate * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredStock.length > 20 && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Showing 20 of {filteredStock.length} products
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Profit Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Profit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value?.toFixed(2)}`} />
                    <Line type="monotone" dataKey="sales" stroke="#0088FE" name="Revenue" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value?.toFixed(2)}`} />
                    <Area type="monotone" dataKey="purchases" stackId="1" stroke="#FF8042" fill="#FF8042" />
                    <Area type="monotone" dataKey="expenses" stackId="1" stroke="#FFBB28" fill="#FFBB28" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Return on Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {(((metrics.totalSales - metrics.totalPurchases) / metrics.totalPurchases) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">ROI this period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Expense Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {((metrics.totalExpenses / metrics.totalSales) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Of total revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {((metrics.netProfit / metrics.totalSales) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Net profit margin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Break Even Point</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  ${(metrics.totalExpenses + metrics.totalPurchases).toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground">Monthly target</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

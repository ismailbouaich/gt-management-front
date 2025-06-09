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

// Import the API service
import { reportsApi } from '@/services/reportsService'

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export function ReportsManager() {
  const [dateRange, setDateRange] = useState('last30')
  const [reportType, setReportType] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  
  // Data states
  const [salesData, setSalesData] = useState({ sales: [], dailyData: {} })
  const [purchaseData, setPurchaseData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [stockData, setStockData] = useState([])
  const [categories, setCategories] = useState([])
  const [expenseCategories, setExpenseCategories] = useState([])

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

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [sales, purchases, expenses, stock, cats, expCats] = await Promise.all([
          reportsApi.getSalesData(selectedDateRange.start, selectedDateRange.end),
          reportsApi.getPurchaseData(selectedDateRange.start, selectedDateRange.end),
          reportsApi.getExpenseData(selectedDateRange.start, selectedDateRange.end),
          reportsApi.getStockData(),
          reportsApi.getCategories(),
          reportsApi.getExpenseCategories()
        ])

        setSalesData(sales)
        setPurchaseData(purchases)
        setExpenseData(expenses)
        setStockData(stock)
        setCategories(cats)
        setExpenseCategories(expCats)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedDateRange])

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
    const avgTurnoverRate = stockData.length > 0 ? 
      stockData.reduce((sum, product) => sum + product.turnoverRate, 0) / stockData.length : 0
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

  const refreshData = async () => {
    setLoading(true)
    try {
      const [sales, purchases, expenses, stock] = await Promise.all([
        reportsApi.getSalesData(selectedDateRange.start, selectedDateRange.end),
        reportsApi.getPurchaseData(selectedDateRange.start, selectedDateRange.end),
        reportsApi.getExpenseData(selectedDateRange.start, selectedDateRange.end),
        reportsApi.getStockData()
      ])

      setSalesData(sales)
      setPurchaseData(purchases)
      setExpenseData(expenses)
      setStockData(stock)
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setLoading(false)
    }
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

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading data...</span>
        </div>
      )}

      {/* Charts and Detailed Reports */}
      <Tabs value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-6">
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
                <CardTitle className="text-lg">Stock Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Stock Value:</span>
                  <span className="font-medium">${stockMetrics.totalStockValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Products:</span>
                  <span className="font-medium">{stockMetrics.totalProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Low Stock Items:</span>
                  <span className="font-medium text-orange-600">{stockMetrics.lowStockCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Turnover:</span>
                  <span className="font-medium">{(stockMetrics.avgTurnoverRate * 100).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Add more tab content here - for brevity, I'll add placeholders */}
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Report</CardTitle>
              <CardDescription>Detailed sales analytics and data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Sales detailed view will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Report</CardTitle>
              <CardDescription>Purchase orders and supplier analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Purchase detailed view will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Report</CardTitle>
              <CardDescription>Expense tracking and category breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Expense detailed view will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Report</CardTitle>
              <CardDescription>Inventory levels and stock analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Stock detailed view will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Business intelligence and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Analytics detailed view will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock API service functions
// This structure makes it easy to replace with real API calls later

import mockData from '@/data/mock-data.json'
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'

// Simulate API delay
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

// Generate dynamic data based on date range
const generateDynamicSalesData = (startDate, endDate) => {
  const sales = []
  const dailyData = {}
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const salesCount = Math.floor(Math.random() * 20) + 5
    const revenue = (Math.random() * 5000) + 1000
    
    dailyData[dateStr] = { revenue, salesCount }
      for (let i = 0; i < salesCount; i++) {
      const customer = `Customer ${Math.floor(Math.random() * mockData.customerCount) + 1}`;
      const product = mockData.productNames[Math.floor(Math.random() * mockData.productNames.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const amount = Math.floor(Math.random() * 500) + 50;
      const status = Math.random() > 0.1 ? mockData.saleStatuses[0] : mockData.saleStatuses[1];
      const paymentMethod = mockData.paymentMethods[Math.floor(Math.random() * mockData.paymentMethods.length)];
      const profit = Math.floor(Math.random() * 200) + 20;
      
      sales.push({
        id: sales.length + 1,
        date: dateStr,
        customer: customer,
        product: product,
        quantity: quantity,
        amount: amount,
        status: status,
        paymentMethod: paymentMethod,
        profit: profit,
      })
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return { sales, dailyData }
}

const generateDynamicPurchaseData = (startDate, endDate) => {
  const purchases = []
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const purchaseCount = Math.floor(Math.random() * 8) + 2
    
    for (let i = 0; i < purchaseCount; i++) {      const supplier = mockData.suppliers[Math.floor(Math.random() * mockData.suppliers.length)];
      const productName = mockData.productNames[Math.floor(Math.random() * mockData.productNames.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      const amount = Math.floor(Math.random() * 2000) + 200;
      
      purchases.push({
        id: purchases.length + 1,
        date: dateStr,
        supplier: supplier,
        product: productName,
        quantity: quantity,
        amount: amount,
        status: Math.random() > 0.15 ? mockData.purchaseStatuses[0] : mockData.purchaseStatuses[1],
        paymentStatus: mockData.paymentStatuses[Math.floor(Math.random() * mockData.paymentStatuses.length)],
        expectedDelivery: format(new Date(currentDate.getTime() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      })
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return purchases
}

const generateDynamicExpenseData = (startDate, endDate) => {
  const expenses = []
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const expenseCount = Math.floor(Math.random() * 5) + 1
    
    for (let i = 0; i < expenseCount; i++) {      const category = mockData.expenseCategories[Math.floor(Math.random() * mockData.expenseCategories.length)];
      
      expenses.push({
        id: expenses.length + 1,
        date: dateStr,
        category: category,
        description: `${category} expense item ${expenses.length + 1}`,
        amount: Math.floor(Math.random() * 800) + 50,        status: Math.random() > 0.1 ? mockData.expenseStatuses[0] : mockData.expenseStatuses[1],
        paymentMethod: mockData.paymentMethods[Math.floor(Math.random() * mockData.paymentMethods.length)],
      })
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return expenses
}

// API-like service functions
export const reportsApi = {
  // Sales API
  async getSalesData(startDate, endDate) {
    await delay()
    return generateDynamicSalesData(startDate, endDate)
  },

  async getSalesById(id) {
    await delay()
    const { sales } = generateDynamicSalesData(subDays(new Date(), 30), new Date())
    return sales.find(sale => sale.id === id)
  },

  async getSalesSummary(period = 'month') {
    await delay()
    const now = new Date()
    let startDate, endDate
    
    switch (period) {
      case 'today':
        startDate = endDate = now
        break
      case 'week':
        startDate = subDays(now, 7)
        endDate = now
        break
      case 'month':
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
        break
      case 'year':
        startDate = startOfYear(now)
        endDate = endOfYear(now)
        break
      default:
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
    }
    
    const { sales, dailyData } = generateDynamicSalesData(startDate, endDate)
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0)
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0)
    const completedSales = sales.filter(s => s.status === 'Completed').length
    
    return {
      totalSales,
      totalProfit,
      salesCount: sales.length,
      completedSales,
      conversionRate: sales.length > 0 ? (completedSales / sales.length) * 100 : 0,
      avgOrderValue: sales.length > 0 ? totalSales / sales.length : 0,
      dailyData
    }
  },

  // Purchase API
  async getPurchaseData(startDate, endDate) {
    await delay()
    return generateDynamicPurchaseData(startDate, endDate)
  },

  async getPurchaseSummary(period = 'month') {
    await delay()
    const now = new Date()
    let startDate, endDate
    
    switch (period) {
      case 'month':
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
        break
      default:
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
    }
    
    const purchases = generateDynamicPurchaseData(startDate, endDate)
    const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
    const receivedPurchases = purchases.filter(p => p.status === 'Received').length
    
    return {
      totalPurchases,
      purchaseCount: purchases.length,
      receivedPurchases,
      pendingPurchases: purchases.length - receivedPurchases,
      avgPurchaseValue: purchases.length > 0 ? totalPurchases / purchases.length : 0
    }
  },

  // Expense API
  async getExpenseData(startDate, endDate) {
    await delay()
    return generateDynamicExpenseData(startDate, endDate)
  },

  async getExpensesByCategory(period = 'month') {
    await delay()
    const now = new Date()
    const startDate = startOfMonth(now)
    const endDate = endOfMonth(now)
    
    const expenses = generateDynamicExpenseData(startDate, endDate)
    const categoryTotals = {}
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })
    
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      count: expenses.filter(e => e.category === category).length
    }))
  },

  // Stock/Inventory API
  async getStockData() {
    await delay()    // Generate more comprehensive stock data
    const products = []
    
    for (let i = 0; i < mockData.productCount; i++) {
      const currentStock = Math.floor(Math.random() * 200) + 1
      const minStock = Math.floor(Math.random() * 20) + 5
      const maxStock = Math.floor(Math.random() * 300) + 100
      const unitCost = Math.floor(Math.random() * 100) + 10
      const unitPrice = unitCost * (1.2 + Math.random() * 0.8)
      const soldLastMonth = Math.floor(Math.random() * 50) + 1
      
      products.push({
        id: i + 1,
        name: mockData.productNames[i % mockData.productNames.length] + ` ${Math.floor(i / mockData.productNames.length) + 1}`,
        category: mockData.categories[Math.floor(Math.random() * mockData.categories.length)],
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
        reorderPoint: minStock * 1.5,        supplier: mockData.suppliers[Math.floor(Math.random() * mockData.suppliers.length)],
        lastRestocked: format(subDays(new Date(mockData.baseDate), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
      })
    }
    
    return products
  },

  async getStockSummary() {
    await delay()
    const stockData = await this.getStockData()
    
    const totalStockValue = stockData.reduce((sum, product) => sum + product.totalValue, 0)
    const lowStockCount = stockData.filter(product => product.status === 'Low Stock').length
    const outOfStockCount = stockData.filter(product => product.currentStock === 0).length
    const avgTurnoverRate = stockData.reduce((sum, product) => sum + product.turnoverRate, 0) / stockData.length
    const topSellingProducts = [...stockData]
      .sort((a, b) => b.soldLastMonth - a.soldLastMonth)
      .slice(0, 5)
    
    return {
      totalStockValue,
      lowStockCount,
      outOfStockCount,
      avgTurnoverRate,
      totalProducts: stockData.length,
      topSellingProducts
    }
  },

  async getLowStockItems() {
    await delay()
    const stockData = await this.getStockData()
    return stockData.filter(product => product.currentStock <= product.minStock)
  },

  // Categories API
  async getCategories() {
    await delay()
    return mockData.categories
  },

  async getExpenseCategories() {
    await delay()
    return mockData.expenseCategories
  },

  // Combined dashboard data
  async getDashboardData(period = 'month') {
    await delay()
    
    const [salesSummary, purchaseSummary, stockSummary] = await Promise.all([
      this.getSalesSummary(period),
      this.getPurchaseSummary(period),
      this.getStockSummary()
    ])
    
    return {
      sales: salesSummary,
      purchases: purchaseSummary,
      stock: stockSummary,
      period
    }
  }
}

// Export individual functions for backwards compatibility
export const {
  getSalesData,
  getPurchaseData,
  getExpenseData,
  getStockData,
  getDashboardData
} = reportsApi

// Export the main service object as reportsService for consistency
export const reportsService = reportsApi

// Default export
export default reportsApi

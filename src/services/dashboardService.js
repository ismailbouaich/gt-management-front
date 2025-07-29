import mockData from '@/data/mock-data.json'

class DashboardService {
  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const stats = mockData.dashboardStats
      
      // Calculate real-time statistics from actual data
      const salesData = mockData.salesData || []
      const customers = mockData.customers || []
      const suppliers = mockData.suppliers || []
      
      // Calculate current month revenue from sales data
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const currentMonthSales = salesData.filter(sale => {
        const saleDate = new Date(sale.date)
        return saleDate.getMonth() === currentMonth && 
               saleDate.getFullYear() === currentYear &&
               sale.status === 'Completed'
      })
      
      const totalRevenue = currentMonthSales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
      
      // Calculate active customers
      const activeCustomers = customers.filter(c => c.status === 'Active').length
      
      // Calculate new customers this month
      const newCustomersThisMonth = customers.filter(customer => {
        const joinDate = new Date(customer.joinDate)
        return joinDate.getMonth() === currentMonth && 
               joinDate.getFullYear() === currentYear
      }).length
      
      // Update stats with real data
      const updatedStats = {
        totalRevenue: {
          ...stats.totalRevenue,
          value: totalRevenue || stats.totalRevenue.value
        },
        newCustomers: {
          ...stats.newCustomers,
          value: newCustomersThisMonth || stats.newCustomers.value
        },
        activeAccounts: {
          ...stats.activeAccounts,
          value: activeCustomers || stats.activeAccounts.value
        },
        growthRate: {
          ...stats.growthRate
          // Keep the mock growth rate as it requires complex calculation
        }
      }
      
      return {
        success: true,
        data: updatedStats
      }
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error)
      return {
        success: false,
        error: error.message,
        data: mockData.dashboardStats // Fallback to mock data
      }
    }
  }
  /**
   * Get dashboard statistics formatted for section cards
   * @returns {Promise<Array>} Array of card data
   */
  async getSectionCardData() {
    try {
      const response = await fetch('/api/dashboard/cards')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        // If API returns error but has fallback data, use it
        if (result.data) {
          return result.data
        }
        throw new Error(result.message || 'Failed to fetch section card data')
      }
    } catch (error) {
      console.error('Error fetching section card data:', error)
      
      // Fallback to local calculation
      const statsResponse = await this.getDashboardStats()
      const stats = statsResponse.data
      
      return [
        {
          id: 'revenue',
          title: 'Total Revenue',
          value: `$${stats.totalRevenue.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: stats.totalRevenue.change,
          trend: stats.totalRevenue.trend,
          description: stats.totalRevenue.description,
          footerText: stats.totalRevenue.footerText,
          icon: 'dollar'
        },
        {
          id: 'customers',
          title: 'New Customers',
          value: stats.newCustomers.value.toLocaleString(),
          change: stats.newCustomers.change,
          trend: stats.newCustomers.trend,
          description: stats.newCustomers.description,
          footerText: stats.newCustomers.footerText,
          icon: 'users'
        },
        {
          id: 'accounts',
          title: 'Active Accounts',
          value: stats.activeAccounts.value.toLocaleString(),
          change: stats.activeAccounts.change,
          trend: stats.activeAccounts.trend,
          description: stats.activeAccounts.description,
          footerText: stats.activeAccounts.footerText,
          icon: 'accounts'
        },
        {
          id: 'growth',
          title: 'Growth Rate',
          value: `${stats.growthRate.value}%`,
          change: stats.growthRate.change,
          trend: stats.growthRate.trend,
          description: stats.growthRate.description,
          footerText: stats.growthRate.footerText,
          icon: 'trend'
        }
      ]
    }
  }

  /**
   * Get recent sales summary
   * @returns {Promise<Object>} Recent sales data
   */
  async getRecentSalesSummary() {
    try {
      const salesData = mockData.salesData || []
      
      const last7Days = salesData
        .filter(sale => {
          const saleDate = new Date(sale.date)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return saleDate >= weekAgo
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
      
      const totalAmount = last7Days.reduce((sum, sale) => sum + (sale.amount || 0), 0)
      const avgOrderValue = last7Days.length > 0 ? totalAmount / last7Days.length : 0
      
      return {
        recentSales: last7Days,
        totalAmount,
        avgOrderValue,
        salesCount: last7Days.length
      }
    } catch (error) {
      console.error('Error fetching recent sales summary:', error)
      throw error
    }
  }

  /**
   * Refresh dashboard data (simulates cache refresh)
   * @returns {Promise<Object>} Updated dashboard statistics
   */
  async refreshDashboard() {
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return await this.getDashboardStats()
    } catch (error) {
      console.error('Error refreshing dashboard:', error)
      throw error
    }
  }

  /**
   * Get dashboard data for a specific date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Dashboard statistics for date range
   */
  async getDashboardStatsByDateRange(startDate, endDate) {
    try {
      const salesData = mockData.salesData || []
      const customers = mockData.customers || []
      
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      // Filter sales within date range
      const rangeSales = salesData.filter(sale => {
        const saleDate = new Date(sale.date)
        return saleDate >= start && saleDate <= end && sale.status === 'Completed'
      })
      
      // Filter customers by join date in range
      const rangeCustomers = customers.filter(customer => {
        const joinDate = new Date(customer.joinDate)
        return joinDate >= start && joinDate <= end
      })
      
      const totalRevenue = rangeSales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
      const newCustomers = rangeCustomers.length
      const avgOrderValue = rangeSales.length > 0 ? totalRevenue / rangeSales.length : 0
      
      return {
        dateRange: { startDate, endDate },
        totalRevenue,
        newCustomers,
        totalOrders: rangeSales.length,
        avgOrderValue,
        topProducts: this._getTopProductsFromSales(rangeSales)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats by date range:', error)
      throw error
    }
  }

  /**
   * Helper method to get top products from sales data
   * @private
   */
  _getTopProductsFromSales(salesData) {
    const productCounts = {}
    
    salesData.forEach(sale => {
      if (sale.productId) {
        productCounts[sale.productId] = (productCounts[sale.productId] || 0) + (sale.items || 1)
      }
    })
    
    return Object.entries(productCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([productId, count]) => ({ productId, count }))
  }
}

// Export singleton instance
export const dashboardService = new DashboardService()
export default dashboardService

import { NextRequest, NextResponse } from 'next/server'
import mockData from '@/data/mock-data.json'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const refreshCache = searchParams.get('refresh') === 'true'

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, refreshCache ? 500 : 100))

    let stats = mockData.dashboardStats

    // If date range is provided, calculate stats for that range
    if (startDate && endDate) {
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
      
      // Override stats with calculated values
      stats = {
        ...stats,
        totalRevenue: {
          ...stats.totalRevenue,
          value: totalRevenue
        },
        newCustomers: {
          ...stats.newCustomers,
          value: newCustomers
        }
      }
    } else {
      // Calculate real-time statistics from actual data for current period
      const salesData = mockData.salesData || []
      const customers = mockData.customers || []
      
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
      
      // Update stats with real data if available
      if (totalRevenue > 0) {
        stats.totalRevenue.value = totalRevenue
      }
      if (newCustomersThisMonth > 0) {
        stats.newCustomers.value = newCustomersThisMonth
      }
      if (activeCustomers > 0) {
        stats.activeAccounts.value = activeCustomers
      }
    }

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      dateRange: startDate && endDate ? { startDate, endDate } : null
    })

  } catch (error) {
    console.error('Error fetching dashboard statistics:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      message: error.message,
      data: mockData.dashboardStats // Fallback data
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === 'refresh') {
      // Simulate cache refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return NextResponse.json({
        success: true,
        message: 'Dashboard statistics refreshed successfully',
        data: mockData.dashboardStats,
        timestamp: new Date().toISOString()
      })
    }

    if (action === 'update') {
      // In a real app, this would update the database
      // For now, we'll just return the updated data
      const updatedStats = {
        ...mockData.dashboardStats,
        ...data
      }

      return NextResponse.json({
        success: true,
        message: 'Dashboard statistics updated successfully',
        data: updatedStats,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
      message: 'Supported actions: refresh, update'
    }, { status: 400 })

  } catch (error) {
    console.error('Error processing dashboard statistics request:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 })
  }
}

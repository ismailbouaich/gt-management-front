import { NextRequest, NextResponse } from 'next/server'
import mockData from '@/data/mock-data.json'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'cards'

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const stats = mockData.dashboardStats

    // Calculate real-time statistics from actual data
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
    
    const totalRevenue = currentMonthSales.reduce((sum, sale) => sum + (sale.amount || 0), 0) || stats.totalRevenue.value
    const activeCustomers = customers.filter(c => c.status === 'Active').length || stats.activeAccounts.value
    const newCustomersThisMonth = customers.filter(customer => {
      const joinDate = new Date(customer.joinDate)
      return joinDate.getMonth() === currentMonth && 
             joinDate.getFullYear() === currentYear
    }).length || stats.newCustomers.value

    // Format data for section cards
    const cardData = [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: stats.totalRevenue.change,
        trend: stats.totalRevenue.trend,
        description: stats.totalRevenue.description,
        footerText: stats.totalRevenue.footerText,
        icon: 'dollar',
        color: 'blue'
      },
      {
        id: 'customers',
        title: 'New Customers',
        value: newCustomersThisMonth.toLocaleString(),
        change: stats.newCustomers.change,
        trend: stats.newCustomers.trend,
        description: stats.newCustomers.description,
        footerText: stats.newCustomers.footerText,
        icon: 'users',
        color: stats.newCustomers.trend === 'up' ? 'green' : 'red'
      },
      {
        id: 'accounts',
        title: 'Active Accounts',
        value: activeCustomers.toLocaleString(),
        change: stats.activeAccounts.change,
        trend: stats.activeAccounts.trend,
        description: stats.activeAccounts.description,
        footerText: stats.activeAccounts.footerText,
        icon: 'accounts',
        color: 'green'
      },
      {
        id: 'growth',
        title: 'Growth Rate',
        value: `${stats.growthRate.value}%`,
        change: stats.growthRate.change,
        trend: stats.growthRate.trend,
        description: stats.growthRate.description,
        footerText: stats.growthRate.footerText,
        icon: 'trend',
        color: 'purple'
      }
    ]

    if (format === 'raw') {
      return NextResponse.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      data: cardData,
      metadata: {
        totalCards: cardData.length,
        lastUpdated: new Date().toISOString(),
        period: 'current_month'
      }
    })

  } catch (error) {
    console.error('Error fetching section card data:', error)
    
    // Fallback data
    const fallbackData = [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: '$125,000.00',
        change: 12.5,
        trend: 'up',
        description: 'Total revenue this month',
        footerText: 'Visitors for the last 6 months',
        icon: 'dollar',
        color: 'blue'
      },
      {
        id: 'customers',
        title: 'New Customers',
        value: '1,234',
        change: -20,
        trend: 'down',
        description: 'New customer acquisitions',
        footerText: 'Acquisition needs attention',
        icon: 'users',
        color: 'red'
      },
      {
        id: 'accounts',
        title: 'Active Accounts',
        value: '45,678',
        change: 12.5,
        trend: 'up',
        description: 'Currently active user accounts',
        footerText: 'Engagement exceed targets',
        icon: 'accounts',
        color: 'green'
      },
      {
        id: 'growth',
        title: 'Growth Rate',
        value: '4.5%',
        change: 4.5,
        trend: 'up',
        description: 'Overall business growth rate',
        footerText: 'Meets growth projections',
        icon: 'trend',
        color: 'purple'
      }
    ]
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch section card data',
      message: error.message,
      data: fallbackData
    }, { status: 500 })
  }
}

import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch CRM statistics
export async function GET(request) {
  try {
    await delay()
    
    // Calculate stats from mock data
    const customers = mockData.crmData.customers
    const leads = mockData.crmData.leads
    const deals = mockData.crmData.deals
    
    const stats = {
      // Customer stats
      totalCustomers: 50, // Including generated ones
      activeCustomers: Math.floor(50 * 0.8), // 80% active
      inactiveCustomers: Math.floor(50 * 0.2), // 20% inactive
      
      // Lead stats
      totalLeads: 25,
      newLeads: 8,
      qualifiedLeads: 12,
      convertedLeads: 5,
      
      // Deal stats
      totalDeals: 15,
      openDeals: 10,
      wonDeals: 3,
      lostDeals: 2,
      totalDealValue: 125000,
      avgDealValue: 8333,
      
      // Revenue stats
      totalRevenue: 450000,
      monthlyRevenue: 75000,
      projectedRevenue: 125000,
      
      // Conversion rates
      leadConversionRate: 20, // 20%
      dealCloseRate: 30, // 30%
      
      // Recent activity
      recentCustomers: 5,
      recentLeads: 3,
      recentDeals: 2,
      
      // Top performing data
      topCustomersByRevenue: customers.slice(0, 3).map(customer => ({
        name: customer.name,
        company: customer.company,
        revenue: customer.totalPurchases
      })),
      
      topDealsByValue: deals.map(deal => ({
        title: deal.title,
        customer: deal.customer,
        value: deal.value,
        stage: deal.stage
      }))
    }
    
    return Response.json({
      success: true,
      data: stats,
      message: 'CRM stats fetched successfully'
    })
    
  } catch (error) {
    console.error('Error fetching CRM stats:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch CRM stats',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

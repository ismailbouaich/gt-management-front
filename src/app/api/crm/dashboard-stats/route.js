import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch dashboard statistics
export async function GET(request) {
  try {
    await delay()
    
    // Get data from mock data
    const customers = mockData.crmData.customers || []
    const leads = mockData.crmData.leads || []
    const opportunities = mockData.crmData.opportunities || []
    const deals = mockData.crmData.deals || []
    
    // Calculate new leads (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const newLeads = leads.filter(lead => 
      new Date(lead.createdAt) > thirtyDaysAgo
    ).length
    
    // Calculate open deals
    const openDeals = deals.filter(deal => 
      !['Closed Won', 'Closed Lost'].includes(deal.stage)
    ).length
    
    // Calculate closed deals (this month)
    const firstOfMonth = new Date()
    firstOfMonth.setDate(1)
    
    const closedDeals = deals.filter(deal => 
      ['Closed Won'].includes(deal.stage) &&
      new Date(deal.updatedAt) >= firstOfMonth
    ).length
    
    // Calculate conversion rate
    const totalLeads = leads.length
    const convertedLeads = leads.filter(lead => 
      lead.status === 'Converted' || lead.status === 'Qualified'
    ).length
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0
    
    return Response.json({
      success: true,
      stats: {
        newLeads: newLeads,
        leadsChange: '+12%',
        openDeals: openDeals,
        dealsChange: '+5%',
        closedDeals: closedDeals,
        closedDealsChange: '+24%',
        conversionRate: `${conversionRate}%`,
        conversionChange: '+3%',
        totalCustomers: customers.length,
        totalOpportunities: opportunities.length,
        totalValue: opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0)
      }
    })
  } catch (error) {
    console.error('Error in dashboard-stats API:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard stats' 
      }, 
      { status: 500 }
    )
  }
}

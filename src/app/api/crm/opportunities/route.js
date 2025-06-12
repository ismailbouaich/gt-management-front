import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch opportunities
export async function GET(request) {
  try {
    await delay()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const stage = searchParams.get('stage') || 'all'
    
    // Get opportunities from mock data
    let opportunities = mockData.crmData.opportunities || []
    
    // Apply filters
    if (search) {
      opportunities = opportunities.filter(opp => 
        opp.name.toLowerCase().includes(search.toLowerCase()) ||
        opp.company.toLowerCase().includes(search.toLowerCase()) ||
        opp.contactName.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (stage !== 'all') {
      opportunities = opportunities.filter(opp => 
        opp.stage === stage || opp.stageId === stage
      )
    }
    
    // Calculate pagination
    const total = opportunities.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOpportunities = opportunities.slice(startIndex, endIndex)
    
    return Response.json({
      success: true,
      opportunities: paginatedOpportunities,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error in opportunities API:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch opportunities' 
      }, 
      { status: 500 }
    )
  }
}

// POST - Create new opportunity
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.company || !body.amount) {
      return Response.json(
        { 
          success: false, 
          error: 'Missing required fields: name, company, amount' 
        }, 
        { status: 400 }
      )
    }
    
    // Create new opportunity object
    const newOpportunity = {
      id: `opp-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      opportunity: newOpportunity,
      message: 'Opportunity created successfully'
    })
  } catch (error) {
    console.error('Error creating opportunity:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create opportunity' 
      }, 
      { status: 500 }
    )
  }
}

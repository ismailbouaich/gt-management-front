import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch accounts
export async function GET(request) {
  try {
    await delay()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const industry = searchParams.get('industry') || 'all'
    
    // Get accounts from mock data - use customers as accounts
    let accounts = mockData.crmData.customers || []
    
    // Transform customers to account format
    accounts = accounts.map(customer => ({
      id: customer.id,
      name: customer.name || customer.company,
      industry: customer.industry || 'General',
      revenue: customer.annualRevenue || 0,
      employees: customer.employees || 0,
      status: customer.status || 'Active',
      contactName: customer.contactName || customer.name,
      contactEmail: customer.email,
      contactPhone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
      country: customer.country,
      website: customer.website,
      description: customer.notes,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    }))
    
    // Apply filters
    if (search) {
      accounts = accounts.filter(account => 
        account.name.toLowerCase().includes(search.toLowerCase()) ||
        account.contactName.toLowerCase().includes(search.toLowerCase()) ||
        account.industry.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (industry !== 'all') {
      accounts = accounts.filter(account => 
        account.industry.toLowerCase() === industry.toLowerCase()
      )
    }
    
    // Calculate pagination
    const total = accounts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedAccounts = accounts.slice(startIndex, endIndex)
    
    return Response.json({
      success: true,
      accounts: paginatedAccounts,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error in accounts API:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch accounts' 
      }, 
      { status: 500 }
    )
  }
}

// POST - Create new account
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.contactEmail) {
      return Response.json(
        { 
          success: false, 
          error: 'Missing required fields: name, contactEmail' 
        }, 
        { status: 400 }
      )
    }
    
    // Create new account object
    const newAccount = {
      id: `acc-${Date.now()}`,
      ...body,
      status: body.status || 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      account: newAccount,
      message: 'Account created successfully'
    })
  } catch (error) {
    console.error('Error creating account:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create account' 
      }, 
      { status: 500 }
    )
  }
}

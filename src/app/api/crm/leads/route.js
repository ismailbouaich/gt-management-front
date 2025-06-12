import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// Generate additional lead data to have a larger dataset
const generateLeadData = () => {
  const baseLeads = mockData.crmData.leads
  const leads = [...baseLeads]
  
  // Generate additional leads
  for (let i = baseLeads.length; i < 25; i++) {
    const id = i + 1
    const names = ['Alex', 'Maria', 'James', 'Lisa', 'Robert', 'Jennifer', 'Michael', 'Sarah', 'David', 'Emily']
    const surnames = ['Wilson', 'Taylor', 'Miller', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Lopez']
    const companies = ['Future Tech', 'NextGen Corp', 'Innovation Labs', 'Smart Business', 'Digital Dynamics', 'Tech Solutions', 'Global Systems', 'Modern Enterprise']
    const sources = mockData.crmTypes.leadSource
    const statuses = mockData.crmStatuses.lead
    
    const firstName = names[Math.floor(Math.random() * names.length)]
    const lastName = surnames[Math.floor(Math.random() * surnames.length)]
    const company = companies[Math.floor(Math.random() * companies.length)]
    
    leads.push({
      id,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`,
      phone: `+123456${8000 + i}`,
      company,
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      score: Math.floor(Math.random() * 100) + 1,
      estimatedValue: Math.round((Math.random() * 25000 + 2000) * 100) / 100,
      assignedTo: `Sales Rep ${Math.floor(Math.random() * 5) + 1}`,
      notes: `Potential customer interested in our services`,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      followUpDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
  }
  
  return leads
}

// GET - Fetch all leads
export async function GET(request) {
  try {
    await delay()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const source = searchParams.get('source') || ''
    
    let leads = generateLeadData()
    
    // Apply filters
    if (search) {
      leads = leads.filter(lead => 
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.company.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search)
      )
    }
    
    if (status && status !== 'all') {
      leads = leads.filter(lead => lead.status === status)
    }
    
    if (source && source !== 'all') {
      leads = leads.filter(lead => lead.source === source)
    }
    
    // Calculate pagination
    const total = leads.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLeads = leads.slice(startIndex, endIndex)
    
    return Response.json({
      success: true,
      data: paginatedLeads,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })
    
  } catch (error) {
    console.error('Error fetching leads:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch leads',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// POST - Create new lead
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    const { name, email, phone, company, source, status, estimatedValue, assignedTo, notes } = body
    
    // Validation
    if (!name || !name.trim()) {
      return Response.json(
        { 
          success: false, 
          error: 'Lead name is required' 
        },
        { status: 400 }
      )
    }
    
    if (!email || !email.trim()) {
      return Response.json(
        { 
          success: false, 
          error: 'Email is required' 
        },
        { status: 400 }
      )
    }
    
    // Check if lead with email already exists
    const leads = generateLeadData()
    if (leads.some(lead => lead.email.toLowerCase() === email.toLowerCase())) {
      return Response.json(
        { 
          success: false, 
          error: 'Lead with this email already exists' 
        },
        { status: 409 }
      )
    }
    
    const newLead = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      company: company?.trim() || '',
      source: source || 'Website',
      status: status || 'New',
      score: Math.floor(Math.random() * 50) + 50, // Random score between 50-100
      estimatedValue: estimatedValue || 0,
      assignedTo: assignedTo || 'Sales Rep 1',
      notes: notes?.trim() || '',
      createdAt: new Date().toISOString(),
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    }
    
    return Response.json({
      success: true,
      data: newLead,
      message: 'Lead created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating lead:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create lead',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

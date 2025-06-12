import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// Generate additional customer data to have a larger dataset
const generateCustomerData = () => {
  const baseCustomers = mockData.crmData.customers
  const customers = [...baseCustomers]
  
  // Generate additional customers
  for (let i = baseCustomers.length; i < 50; i++) {
    const id = i + 1
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia']
    const surnames = ['Anderson', 'Brown', 'Clark', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Ivers', 'Jones']
    const companies = ['Tech Corp', 'Digital Solutions', 'Innovation Inc', 'Future Systems', 'Global Tech', 'Smart Solutions', 'Dynamic Corp', 'Advanced Systems']
    const statuses = mockData.crmStatuses.customer
    const types = mockData.crmTypes.customer
    
    const firstName = names[Math.floor(Math.random() * names.length)]
    const lastName = surnames[Math.floor(Math.random() * surnames.length)]
    const company = companies[Math.floor(Math.random() * companies.length)]
    
    customers.push({
      id,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`,
      phone: `+123456${7890 + i}`,
      company,
      address: `${100 + i} Business St, City, State ${10000 + i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      totalPurchases: Math.round((Math.random() * 50000 + 1000) * 100) / 100,
      lastPurchase: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags: [types[Math.floor(Math.random() * types.length)]]
    })
  }
  
  return customers
}

// GET - Fetch all customers
export async function GET(request) {
  try {
    await delay()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const type = searchParams.get('type') || ''
    
    let customers = generateCustomerData()
    
    // Apply filters
    if (search) {
      customers = customers.filter(customer => 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.company.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      )
    }
    
    if (status && status !== 'all') {
      customers = customers.filter(customer => customer.status === status)
    }
    
    if (type && type !== 'all') {
      customers = customers.filter(customer => customer.type === type)
    }
    
    // Calculate pagination
    const total = customers.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCustomers = customers.slice(startIndex, endIndex)
    
    return Response.json({
      success: true,
      data: paginatedCustomers,
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
    console.error('Error fetching customers:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch customers',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// POST - Create new customer
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    const { name, email, phone, company, address, status, type, tags } = body
    
    // Validation
    if (!name || !name.trim()) {
      return Response.json(
        { 
          success: false, 
          error: 'Customer name is required' 
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
    
    // Check if customer with email already exists
    const customers = generateCustomerData()
    if (customers.some(customer => customer.email.toLowerCase() === email.toLowerCase())) {
      return Response.json(
        { 
          success: false, 
          error: 'Customer with this email already exists' 
        },
        { status: 409 }
      )
    }
    
    const newCustomer = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      company: company?.trim() || '',
      address: address?.trim() || '',
      status: status || 'Active',
      type: type || 'Regular',
      totalPurchases: 0,
      lastPurchase: null,
      createdAt: new Date().toISOString(),
      tags: tags || []
    }
    
    return Response.json({
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating customer:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create customer',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

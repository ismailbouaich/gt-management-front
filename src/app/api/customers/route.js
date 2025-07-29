import { NextResponse } from 'next/server'
import mockData from '@/data/mock-data.json'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''
    const industry = searchParams.get('industry') || ''
    
    // Ensure customers array exists and is valid
    let customers = mockData?.customers || []
    
    // Filter customers based on search and filters
    if (search) {
      customers = customers.filter(customer => 
        customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone?.includes(search) ||
        customer.company?.toLowerCase().includes(search.toLowerCase()) ||
        customer.contactPerson?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (type && type !== 'all') {
      customers = customers.filter(customer => customer.customerType === type)
    }
    
    if (status && status !== 'all') {
      customers = customers.filter(customer => customer.status === status)
    }    if (industry && industry !== 'all') {
      customers = customers.filter(customer => customer.industry === industry)
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCustomers = customers.slice(startIndex, endIndex)
    
    return NextResponse.json({
      customers: paginatedCustomers,
      total: customers.length,
      page,
      limit,
      totalPages: Math.ceil(customers.length / limit)
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const customerData = await request.json()
    
    // In a real app, you'd save to database
    // For now, just return the created customer with an ID
    const newCustomer = {
      ...customerData,
      id: `customer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ customer: newCustomer }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}

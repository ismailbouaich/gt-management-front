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
    
    // Ensure suppliers array exists and is valid
    let suppliers = mockData?.suppliers || []
    
    // Filter suppliers based on search and filters
    if (search) {
      suppliers = suppliers.filter(supplier => 
        supplier.name?.toLowerCase().includes(search.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(search.toLowerCase()) ||
        supplier.phone?.includes(search) ||
        supplier.company?.toLowerCase().includes(search.toLowerCase()) ||
        supplier.contactPerson?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (type && type !== 'all') {
      suppliers = suppliers.filter(supplier => supplier.supplierType === type)
    }
    
    if (status && status !== 'all') {
      suppliers = suppliers.filter(supplier => supplier.status === status)
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedSuppliers = suppliers.slice(startIndex, endIndex)
    
    return NextResponse.json({
      suppliers: paginatedSuppliers,
      total: suppliers.length,
      page,
      limit,
      totalPages: Math.ceil(suppliers.length / limit)
    })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const supplierData = await request.json()
    
    // In a real app, you'd save to database
    // For now, just return the created supplier with an ID
    const newSupplier = {
      ...supplierData,
      id: `supplier-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ supplier: newSupplier }, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    )
  }
}

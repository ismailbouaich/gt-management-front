import { NextResponse } from 'next/server'
import mockData from '@/data/mock-data.json'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Ensure suppliers array exists and is valid
    const suppliers = mockData?.suppliers || []
    
    const supplier = suppliers.find(s => s.id === id)
    
    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ supplier })
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return NextResponse.json(
      { error: 'Failed to fetch supplier' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const supplierData = await request.json()
    
    // In a real app, you'd update in database
    // For now, just return the updated supplier
    const updatedSupplier = {
      ...supplierData,
      id,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ supplier: updatedSupplier })
  } catch (error) {
    console.error('Error updating supplier:', error)
    return NextResponse.json(
      { error: 'Failed to update supplier' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // In a real app, you'd delete from database
    // For now, just return success
    return NextResponse.json({ message: 'Supplier deleted successfully' })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json(
      { error: 'Failed to delete supplier' },
      { status: 500 }
    )
  }
}

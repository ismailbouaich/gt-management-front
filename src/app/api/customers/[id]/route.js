import { NextResponse } from 'next/server'
import mockData from '@/data/mock-data.json'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Ensure customers array exists and is valid
    const customers = mockData?.customers || []
    
    const customer = customers.find(c => c.id === id)
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ customer })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const updateData = await request.json()
    
    // In a real app, you'd update the database
    // For now, just return the updated customer
    const updatedCustomer = {
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ customer: updatedCustomer })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // In a real app, you'd delete from database
    // For now, just return success
    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
}

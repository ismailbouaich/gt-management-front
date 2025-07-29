import { NextResponse } from 'next/server'
import mockData from '@/data/mock-data.json'

export async function GET() {
  try {
    // Test endpoint to debug mock data loading
    const response = {
      mockDataExists: !!mockData,
      mockDataKeys: Object.keys(mockData || {}),
      customersExists: !!mockData?.customers,
      customersLength: mockData?.customers?.length || 0,
      customersType: typeof mockData?.customers,
      firstCustomer: mockData?.customers?.[0] || null,
      rawCustomers: mockData?.customers || null
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in test endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to test mock data', details: error.message },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import mockData from '@/data/mock-data.json'

export async function GET() {
  try {
    const metadata = {
      types: mockData?.supplierTypes || ['Manufacturer', 'Distributor', 'Service Provider'],
      statuses: mockData?.supplierStatuses || ['Active', 'Inactive', 'Pending'],
      categories: ['Electronics', 'Manufacturing', 'Services', 'Raw Materials', 'Software', 'Hardware']
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error fetching supplier metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch supplier metadata' },
      { status: 500 }
    )
  }
}

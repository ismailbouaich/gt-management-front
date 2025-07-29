import { NextResponse } from 'next/server'
import mockData from '@/data/mock-data.json'

export async function GET() {
  try {
    const metadata = {
      types: mockData?.customerTypes || ['Individual', 'Business', 'Corporate'],
      statuses: mockData?.customerStatuses || ['Active', 'Inactive', 'Pending'],
      industries: mockData?.customerIndustries || ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing']
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Error fetching customer metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer metadata' },
      { status: 500 }
    )
  }
}

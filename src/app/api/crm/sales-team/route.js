import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch sales team
export async function GET(request) {
  try {
    await delay()
    
    // Get sales team from mock data
    const salesTeam = mockData.crmData.salesTeam || []
    
    return Response.json({
      success: true,
      team: salesTeam,
      meta: {
        total: salesTeam.length
      }
    })
  } catch (error) {
    console.error('Error in sales-team API:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch sales team' 
      }, 
      { status: 500 }
    )
  }
}

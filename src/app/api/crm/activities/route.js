import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch activities
export async function GET(request) {
  try {
    await delay()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all'
    
    // Get activities from mock data
    let activities = mockData.crmData.activities || []
    
    // Apply filters
    if (search) {
      activities = activities.filter(activity => 
        activity.subject.toLowerCase().includes(search.toLowerCase()) ||
        activity.relatedTo.toLowerCase().includes(search.toLowerCase()) ||
        activity.type.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (type !== 'all') {
      activities = activities.filter(activity => 
        activity.type.toLowerCase() === type.toLowerCase()
      )
    }
    
    // Calculate pagination
    const total = activities.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedActivities = activities.slice(startIndex, endIndex)
    
    return Response.json({
      success: true,
      activities: paginatedActivities,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error in activities API:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch activities' 
      }, 
      { status: 500 }
    )
  }
}

// POST - Create new activity
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.type || !body.subject || !body.dueDate) {
      return Response.json(
        { 
          success: false, 
          error: 'Missing required fields: type, subject, dueDate' 
        }, 
        { status: 400 }
      )
    }
    
    // Create new activity object
    const newActivity = {
      id: `act-${Date.now()}`,
      ...body,
      status: body.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      activity: newActivity,
      message: 'Activity created successfully'
    })
  } catch (error) {
    console.error('Error creating activity:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create activity' 
      }, 
      { status: 500 }
    )
  }
}

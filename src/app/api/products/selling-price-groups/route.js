import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch all selling price groups
export async function GET(request) {
  try {
    await delay()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all'
    const isActive = searchParams.get('isActive')
    const isDefault = searchParams.get('isDefault')
    
    // Get selling price groups from mock data
    let priceGroups = mockData.sellingPriceGroups || []
    
    // Apply filters
    if (search) {
      priceGroups = priceGroups.filter(group => 
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.code.toLowerCase().includes(search.toLowerCase()) ||
        group.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (type !== 'all') {
      priceGroups = priceGroups.filter(group => group.type.toLowerCase() === type.toLowerCase())
    }
    
    if (isActive !== null && isActive !== undefined) {
      priceGroups = priceGroups.filter(group => group.isActive === (isActive === 'true'))
    }
    
    if (isDefault !== null && isDefault !== undefined) {
      priceGroups = priceGroups.filter(group => group.isDefault === (isDefault === 'true'))
    }
    
    // Sort by priority, then by name
    priceGroups.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority
      }
      return a.name.localeCompare(b.name)
    })
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedGroups = priceGroups.slice(startIndex, endIndex)
    
    // Calculate totals and statistics
    const totalGroups = priceGroups.length
    const activeGroups = priceGroups.filter(g => g.isActive).length
    const defaultGroup = priceGroups.find(g => g.isDefault)
    const groupTypes = [...new Set(priceGroups.map(g => g.type))]
    
    return Response.json({
      success: true,
      priceGroups: paginatedGroups,
      pagination: {
        page,
        limit,
        total: totalGroups,
        totalPages: Math.ceil(totalGroups / limit),
        hasNext: endIndex < totalGroups,
        hasPrev: page > 1
      },
      statistics: {
        total: totalGroups,
        active: activeGroups,
        inactive: totalGroups - activeGroups,
        defaultGroup: defaultGroup?.name || 'None',
        types: groupTypes.length
      }
    })
  } catch (error) {
    console.error('Error fetching selling price groups:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch selling price groups' 
      }, 
      { status: 500 }
    )
  }
}

// POST - Create new selling price group
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.code || !body.type || !body.markupType) {
      return Response.json(
        { 
          success: false, 
          error: 'Missing required fields: name, code, type, markupType' 
        }, 
        { status: 400 }
      )
    }
    
    // Check for duplicate names or codes
    const existingGroup = mockData.sellingPriceGroups.find(group => 
      group.name.toLowerCase() === body.name.toLowerCase() ||
      group.code.toLowerCase() === body.code.toLowerCase()
    )
    
    if (existingGroup) {
      return Response.json(
        { 
          success: false, 
          error: 'Price group with this name or code already exists' 
        }, 
        { status: 409 }
      )
    }
    
    // If this is set as default, remove default from others
    if (body.isDefault) {
      // In a real app, you'd update the database here
      console.log('Setting new default price group, removing default from others')
    }
    
    // Create new price group object
    const newPriceGroup = {
      id: `spg-${Date.now()}`,
      name: body.name,
      code: body.code.toUpperCase(),
      description: body.description || '',
      type: body.type,
      markupType: body.markupType,
      markupValue: body.markupValue || 0,
      discountType: body.discountType || 'none',
      discountValue: body.discountValue || 0,
      isDefault: body.isDefault || false,
      isActive: body.isActive !== undefined ? body.isActive : true,
      priority: body.priority || 999,
      minimumQuantity: body.minimumQuantity || 1,
      maximumQuantity: body.maximumQuantity || null,
      validFrom: body.validFrom || new Date().toISOString(),
      validTo: body.validTo || null,
      applicableProducts: body.applicableProducts || 'all',
      applicableCategories: body.applicableCategories || [],
      customerGroups: body.customerGroups || [],
      currency: body.currency || 'USD',
      taxIncluded: body.taxIncluded || false,
      roundingRule: body.roundingRule || 'nearest',
      roundingPrecision: body.roundingPrecision || 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      priceGroup: newPriceGroup,
      message: 'Selling price group created successfully'
    })
  } catch (error) {
    console.error('Error creating selling price group:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create selling price group' 
      }, 
      { status: 500 }
    )
  }
}

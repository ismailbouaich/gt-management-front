import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch all units
export async function GET(request) {
  try {
    await delay()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'
    const type = searchParams.get('type') || 'all'
    const isActive = searchParams.get('isActive')
    
    // Get units from mock data
    let units = mockData.units || []
    
    // Apply filters
    if (search) {
      units = units.filter(unit => 
        unit.name.toLowerCase().includes(search.toLowerCase()) ||
        unit.symbol.toLowerCase().includes(search.toLowerCase()) ||
        unit.abbreviation.toLowerCase().includes(search.toLowerCase()) ||
        unit.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (category !== 'all') {
      units = units.filter(unit => unit.category.toLowerCase() === category.toLowerCase())
    }
    
    if (type !== 'all') {
      units = units.filter(unit => unit.type.toLowerCase() === type.toLowerCase())
    }
    
    if (isActive !== null && isActive !== undefined) {
      units = units.filter(unit => unit.isActive === (isActive === 'true'))
    }
    
    // Sort by sortOrder, then by name
    units.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder
      }
      return a.name.localeCompare(b.name)
    })
    
    // Calculate pagination
    const total = units.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUnits = units.slice(startIndex, endIndex)
    
    // Get categories and types for filters
    const categories = [...new Set(mockData.units.map(unit => unit.category))].sort()
    const types = [...new Set(mockData.units.map(unit => unit.type))].sort()
    
    return Response.json({
      success: true,
      units: paginatedUnits,
      meta: {
        total,
        page,
        limit,
        totalPages,
        categories,
        types
      }
    })
  } catch (error) {
    console.error('Error in units API:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch units' 
      }, 
      { status: 500 }
    )
  }
}

// POST - Create new unit
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.symbol || !body.type || !body.category) {
      return Response.json(
        { 
          success: false, 
          error: 'Missing required fields: name, symbol, type, category' 
        }, 
        { status: 400 }
      )
    }
    
    // Check for duplicate names or symbols
    const existingUnit = mockData.units.find(unit => 
      unit.name.toLowerCase() === body.name.toLowerCase() ||
      unit.symbol.toLowerCase() === body.symbol.toLowerCase()
    )
    
    if (existingUnit) {
      return Response.json(
        { 
          success: false, 
          error: 'Unit with this name or symbol already exists' 
        }, 
        { status: 409 }
      )
    }
    
    // Create new unit object
    const newUnit = {
      id: `unit-${Date.now()}`,
      name: body.name,
      symbol: body.symbol,
      abbreviation: body.abbreviation || body.symbol,
      type: body.type,
      category: body.category,
      description: body.description || '',
      baseUnit: body.baseUnit || null,
      conversionFactor: body.conversionFactor || 1,
      isBaseUnit: body.isBaseUnit || false,
      isActive: body.isActive !== undefined ? body.isActive : true,
      sortOrder: body.sortOrder || 999,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      unit: newUnit,
      message: 'Unit created successfully'
    })
  } catch (error) {
    console.error('Error creating unit:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create unit' 
      }, 
      { status: 500 }
    )
  }
}

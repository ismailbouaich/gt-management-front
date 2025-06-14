import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch product variations
export async function GET(request) {
  try {
    await delay()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const productId = searchParams.get('productId')
    const isActive = searchParams.get('isActive')
    
    // Get variations from mock data
    let variations = mockData.productVariations || []
    
    // Apply filters
    if (search) {
      variations = variations.filter(variation => 
        variation.productName.toLowerCase().includes(search.toLowerCase()) ||
        variation.baseProductSku.toLowerCase().includes(search.toLowerCase()) ||
        variation.variationType.toLowerCase().includes(search.toLowerCase()) ||
        variation.variations.some(v => 
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.sku.toLowerCase().includes(search.toLowerCase())
        )
      )
    }
    
    if (productId) {
      variations = variations.filter(variation => 
        variation.productId.toString() === productId.toString()
      )
    }
    
    if (isActive !== null && isActive !== undefined) {
      const activeFilter = isActive === 'true'
      variations = variations.filter(variation => 
        variation.variations.some(v => v.isActive === activeFilter)
      )
    }
    
    // Calculate pagination
    const total = variations.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVariations = variations.slice(startIndex, endIndex)
    
    // Calculate summary statistics
    const totalVariations = variations.reduce((sum, group) => sum + group.variations.length, 0)
    const activeVariations = variations.reduce((sum, group) => 
      sum + group.variations.filter(v => v.isActive).length, 0
    )
    const totalStock = variations.reduce((sum, group) => 
      sum + group.variations.reduce((varSum, variation) => varSum + variation.stock, 0), 0
    )
    
    return Response.json({
      success: true,
      variations: paginatedVariations,
      stats: {
        totalGroups: total,
        totalVariations,
        activeVariations,
        totalStock
      },
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error in variations API:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch product variations' 
      }, 
      { status: 500 }
    )
  }
}

// POST - Create new variation group
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.productId || !body.productName || !body.variationType || !body.variations || !Array.isArray(body.variations)) {
      return Response.json(
        { 
          success: false, 
          error: 'Missing required fields: productId, productName, variationType, variations' 
        }, 
        { status: 400 }
      )
    }
    
    // Create new variation group
    const newVariationGroup = {
      id: `var-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      variation: newVariationGroup,
      message: 'Product variation group created successfully'
    })
  } catch (error) {
    console.error('Error creating variation group:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create product variation group' 
      }, 
      { status: 500 }
    )
  }
}

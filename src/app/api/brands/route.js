import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch all brands
export async function GET(request) {
  try {
    await delay()
    
    // Get brands with product counts
    const brands = mockData.brands.map((brand, index) => ({
      id: index + 1,
      name: brand,
      description: `${brand} brand products`,
      productCount: Math.floor(Math.random() * 15) + 1,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }))
    
    return Response.json({
      success: true,
      data: brands,
      message: 'Brands fetched successfully'
    })
    
  } catch (error) {
    console.error('Error fetching brands:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch brands',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// POST - Create new brand
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    const { name, description } = body
    
    if (!name || !name.trim()) {
      return Response.json(
        { 
          success: false, 
          error: 'Brand name is required' 
        },
        { status: 400 }
      )
    }
    
    // Check if brand already exists
    if (mockData.brands.some(brand => brand.toLowerCase() === name.toLowerCase())) {
      return Response.json(
        { 
          success: false, 
          error: 'Brand already exists' 
        },
        { status: 409 }
      )
    }
    
    const newBrand = {
      id: Date.now(),
      name: name.trim(),
      description: description?.trim() || `${name.trim()} brand products`,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      data: newBrand,
      message: 'Brand created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating brand:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create brand',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch all categories
export async function GET(request) {
  try {
    await delay()
    
    // Get categories with product counts
    const categories = mockData.categories.map((category, index) => ({
      id: index + 1,
      name: category,
      description: `Products in ${category} category`,
      productCount: Math.floor(Math.random() * 20) + 1,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }))
    
    return Response.json({
      success: true,
      data: categories,
      message: 'Categories fetched successfully'
    })
    
  } catch (error) {
    console.error('Error fetching categories:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

// POST - Create new category
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    const { name, description } = body
    
    if (!name || !name.trim()) {
      return Response.json(
        { 
          success: false, 
          error: 'Category name is required' 
        },
        { status: 400 }
      )
    }
    
    // Check if category already exists
    if (mockData.categories.some(cat => cat.toLowerCase() === name.toLowerCase())) {
      return Response.json(
        { 
          success: false, 
          error: 'Category already exists' 
        },
        { status: 409 }
      )
    }
    
    const newCategory = {
      id: Date.now(),
      name: name.trim(),
      description: description?.trim() || `Products in ${name.trim()} category`,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating category:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to create category',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

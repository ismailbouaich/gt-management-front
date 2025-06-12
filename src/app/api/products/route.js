import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

// Generate dummy product data
function generateProductData() {
  const products = []
  
  for (let i = 0; i < 50; i++) {
    const purchasePrice = Math.floor(Math.random() * 200) + 20
    const markup = 1.3 + Math.random() * 0.7 // 30-100% markup
    const sellingPrice = Math.round(purchasePrice * markup * 100) / 100
    const currentStock = Math.floor(Math.random() * 200) + 1
    const minStock = Math.floor(Math.random() * 20) + 5
    
    products.push({
      id: i + 1,
      name: `${mockData.productNames[i % mockData.productNames.length]} ${Math.floor(i / mockData.productNames.length) + 1}`,
      sku: `PRD-${String(i + 1).padStart(4, '0')}`,
      category: mockData.categories[Math.floor(Math.random() * mockData.categories.length)],
      brand: mockData.brands?.[Math.floor(Math.random() * (mockData.brands?.length || 3))] || ['Apple', 'Samsung', 'Sony'][Math.floor(Math.random() * 3)],
      purchasePrice,
      sellingPrice,
      currentStock,
      minStock,
      description: `High-quality ${mockData.productNames[i % mockData.productNames.length].toLowerCase()} with excellent features and reliability.`,
      status: currentStock <= minStock ? 'Low Stock' : 
              currentStock === 0 ? 'Out of Stock' : 'In Stock',
      supplier: mockData.suppliers[Math.floor(Math.random() * mockData.suppliers.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  return products
}

// GET - Fetch all products
export async function GET(request) {
  try {
    await delay()
      const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const brand = searchParams.get('brand') || ''
    
    let products = generateProductData()
    
    // Apply filters
    if (search) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (category && category !== 'all') {
      products = products.filter(product => product.category === category)
    }
    
    if (status && status !== 'all') {
      products = products.filter(product => product.status === status)
    }
    
    if (brand && brand !== 'all') {
      products = products.filter(product => product.brand === brand)
    }
    
    // Calculate pagination
    const total = products.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = products.slice(startIndex, endIndex)
    
    return Response.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    })
    
  } catch (error) {
    console.error('Error fetching products:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    await delay()
    
    const body = await request.json()
    const { name, sku, category, brand, purchasePrice, sellingPrice, description } = body
    
    // Validation
    if (!name || !sku || !category || !purchasePrice || !sellingPrice) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create new product
    const newProduct = {
      id: Date.now(),
      name,
      sku,
      category,
      brand: brand || 'Unknown',
      purchasePrice: parseFloat(purchasePrice),
      sellingPrice: parseFloat(sellingPrice),
      currentStock: 0,
      minStock: 5,
      description: description || '',
      status: 'Out of Stock',
      supplier: mockData.suppliers[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    })
    
  } catch (error) {
    console.error('Error creating product:', error)
    return Response.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

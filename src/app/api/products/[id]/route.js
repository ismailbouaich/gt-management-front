// Simulate API delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    await delay()
    
    const { id } = params
    
    // In a real app, you'd fetch from database
    // For now, we'll return a mock product
    const mockProduct = {
      id: parseInt(id),
      name: 'Wireless Bluetooth Headphones',
      sku: `PRD-${String(id).padStart(4, '0')}`,
      category: 'Electronics',
      brand: 'Sony',
      purchasePrice: 75.00,
      sellingPrice: 120.00,
      currentStock: 25,
      minStock: 5,
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      status: 'In Stock',
      supplier: 'TechCorp Solutions',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      data: mockProduct
    })
    
  } catch (error) {
    console.error('Error fetching product:', error)
    return Response.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    await delay()
    
    const { id } = params
    const body = await request.json()
    
    // In a real app, you'd update in database
    const updatedProduct = {
      id: parseInt(id),
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    })
    
  } catch (error) {
    console.error('Error updating product:', error)
    return Response.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    await delay()
    
    const { id } = params
    
    // In a real app, you'd delete from database
    return Response.json({
      success: true,
      message: 'Product deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting product:', error)
    return Response.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

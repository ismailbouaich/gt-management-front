import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch single selling price group
export async function GET(request, { params }) {
  try {
    await delay()
    
    const { id } = params
    const priceGroup = mockData.sellingPriceGroups.find(group => group.id === id)
    
    if (!priceGroup) {
      return Response.json(
        { 
          success: false, 
          error: 'Selling price group not found' 
        }, 
        { status: 404 }
      )
    }
    
    return Response.json({
      success: true,
      priceGroup: priceGroup
    })
  } catch (error) {
    console.error('Error fetching selling price group:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch selling price group' 
      }, 
      { status: 500 }
    )
  }
}

// PUT - Update selling price group
export async function PUT(request, { params }) {
  try {
    await delay()
    
    const { id } = params
    const body = await request.json()
    
    const priceGroupIndex = mockData.sellingPriceGroups.findIndex(group => group.id === id)
    
    if (priceGroupIndex === -1) {
      return Response.json(
        { 
          success: false, 
          error: 'Selling price group not found' 
        }, 
        { status: 404 }
      )
    }
    
    // Check for duplicate names or codes (excluding current group)
    const existingGroup = mockData.sellingPriceGroups.find(group => 
      group.id !== id && (
        group.name.toLowerCase() === body.name?.toLowerCase() ||
        group.code.toLowerCase() === body.code?.toLowerCase()
      )
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
    
    // Update the price group
    const currentGroup = mockData.sellingPriceGroups[priceGroupIndex]
    const updatedGroup = {
      ...currentGroup,
      ...body,
      id: currentGroup.id, // Preserve the original ID
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      priceGroup: updatedGroup,
      message: 'Selling price group updated successfully'
    })
  } catch (error) {
    console.error('Error updating selling price group:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to update selling price group' 
      }, 
      { status: 500 }
    )
  }
}

// DELETE - Delete selling price group
export async function DELETE(request, { params }) {
  try {
    await delay()
    
    const { id } = params
    const priceGroupIndex = mockData.sellingPriceGroups.findIndex(group => group.id === id)
    
    if (priceGroupIndex === -1) {
      return Response.json(
        { 
          success: false, 
          error: 'Selling price group not found' 
        }, 
        { status: 404 }
      )
    }
    
    const priceGroup = mockData.sellingPriceGroups[priceGroupIndex]
    
    // Check if this is the default price group
    if (priceGroup.isDefault) {
      return Response.json(
        { 
          success: false, 
          error: 'Cannot delete the default price group. Please set another group as default first.' 
        }, 
        { status: 400 }
      )
    }
    
    // In a real application, you'd also check if this price group is being used by any products
    // and prevent deletion or provide options to handle the references
    
    return Response.json({
      success: true,
      message: 'Selling price group deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting selling price group:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to delete selling price group' 
      }, 
      { status: 500 }
    )
  }
}

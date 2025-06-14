import mockData from '@/data/mock-data.json'

// Simulate API delay
const delay = () => new Promise(resolve => setTimeout(resolve, 100))

// GET - Fetch single unit by ID
export async function GET(request, { params }) {
  try {
    await delay()
    
    const { id } = params
    const unit = mockData.units.find(u => u.id === id)
    
    if (!unit) {
      return Response.json(
        { 
          success: false, 
          error: 'Unit not found' 
        }, 
        { status: 404 }
      )
    }
    
    return Response.json({
      success: true,
      unit
    })
  } catch (error) {
    console.error('Error fetching unit:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch unit' 
      }, 
      { status: 500 }
    )
  }
}

// PUT - Update unit
export async function PUT(request, { params }) {
  try {
    await delay()
    
    const { id } = params
    const body = await request.json()
    
    const unitIndex = mockData.units.findIndex(u => u.id === id)
    
    if (unitIndex === -1) {
      return Response.json(
        { 
          success: false, 
          error: 'Unit not found' 
        }, 
        { status: 404 }
      )
    }
    
    // Check for duplicate names or symbols (excluding current unit)
    const existingUnit = mockData.units.find(unit => 
      unit.id !== id && (
        unit.name.toLowerCase() === body.name.toLowerCase() ||
        unit.symbol.toLowerCase() === body.symbol.toLowerCase()
      )
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
    
    // Update unit object
    const updatedUnit = {
      ...mockData.units[unitIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    }
    
    return Response.json({
      success: true,
      unit: updatedUnit,
      message: 'Unit updated successfully'
    })
  } catch (error) {
    console.error('Error updating unit:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to update unit' 
      }, 
      { status: 500 }
    )
  }
}

// DELETE - Delete unit
export async function DELETE(request, { params }) {
  try {
    await delay()
    
    const { id } = params
    const unitIndex = mockData.units.findIndex(u => u.id === id)
    
    if (unitIndex === -1) {
      return Response.json(
        { 
          success: false, 
          error: 'Unit not found' 
        }, 
        { status: 404 }
      )
    }
    
    const unit = mockData.units[unitIndex]
    
    // Check if unit is being used as a base unit for other units
    const dependentUnits = mockData.units.filter(u => u.baseUnit === id)
    
    if (dependentUnits.length > 0) {
      return Response.json(
        { 
          success: false, 
          error: `Cannot delete unit. It is used as base unit by: ${dependentUnits.map(u => u.name).join(', ')}` 
        }, 
        { status: 409 }
      )
    }
    
    return Response.json({
      success: true,
      message: 'Unit deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting unit:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to delete unit' 
      }, 
      { status: 500 }
    )
  }
}

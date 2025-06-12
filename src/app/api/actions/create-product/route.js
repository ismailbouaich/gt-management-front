export async function POST(request) {
  try {
    const body = await request.json()
    
    // Forward the request to the main products API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create product')
    }
    
    return Response.json(data)
    
  } catch (error) {
    console.error('Error in create product action:', error)
    return Response.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    )
  }
}

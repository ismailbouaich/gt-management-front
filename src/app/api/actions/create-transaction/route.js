export async function POST(request) {
  try {
    const body = await request.json()
    
    // Simulate transaction creation (you would integrate with your database here)
    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      customer: body.customer || 'Unknown Customer',
      amount: parseFloat(body.amount) || 0,
      items: body.items || 1,
      paymentMethod: body.paymentMethod || 'Cash',
      type: body.type || 'Sale',
      status: 'Completed',
      createdAt: new Date().toISOString()
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return Response.json({
      success: true,
      message: `Transaction for ${newTransaction.customer} created successfully!`,
      transaction: newTransaction
    })

  } catch (error) {
    console.error('Error creating transaction:', error)
    return Response.json(
      { error: 'Failed to create transaction', details: error.message },
      { status: 500 }
    )
  }
}

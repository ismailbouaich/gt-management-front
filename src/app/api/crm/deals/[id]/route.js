import { NextResponse } from 'next/server';
import mockData from '@/data/mock-data.json';

// Generate additional deals by expanding the base data
function generateDeals(baseDeals, count = 50) {
  const generated = [...baseDeals];
  
  const dealStages = mockData.crm.dealStages;
  const customers = mockData.crm.customers;
  const statuses = ['active', 'pending', 'closed-won', 'closed-lost'];
  
  const dealTitles = [
    'Software License Renewal',
    'Cloud Migration Project',
    'Security Audit Services',
    'Database Optimization',
    'Mobile App Development',
    'Website Redesign',
    'IT Consulting Services',
    'Infrastructure Upgrade',
    'Training Program',
    'Support Contract'
  ];
  
  for (let i = baseDeals.length; i < count; i++) {
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomStage = dealStages[Math.floor(Math.random() * dealStages.length)];
    const randomTitle = dealTitles[Math.floor(Math.random() * dealTitles.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate random deal value between $1,000 and $100,000
    const dealValue = Math.floor(Math.random() * 99000) + 1000;
    
    // Generate random probability based on stage
    let probability = 50;
    if (randomStage.name.toLowerCase().includes('qualified')) probability = 75;
    else if (randomStage.name.toLowerCase().includes('proposal')) probability = 60;
    else if (randomStage.name.toLowerCase().includes('negotiation')) probability = 80;
    else if (randomStage.name.toLowerCase().includes('closing')) probability = 90;
    
    const deal = {
      id: `deal-${i + 1}`,
      title: `${randomTitle} - ${randomCustomer.name}`,
      customerId: randomCustomer.id,
      customerName: randomCustomer.name,
      value: dealValue,
      currency: 'USD',
      stage: randomStage.name,
      stageId: randomStage.id,
      probability: probability,
      status: randomStatus,
      expectedCloseDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: `user-${Math.floor(Math.random() * 5) + 1}`,
      description: `${randomTitle} opportunity for ${randomCustomer.name}`,
      tags: [`tag-${Math.floor(Math.random() * 5) + 1}`]
    };
    
    generated.push(deal);
  }
  
  return generated;
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }
    
    // Generate deals from base data
    const deals = generateDeals(mockData.crm.deals || [], 50);
    
    // Find the specific deal
    const deal = deals.find(d => d.id === id);
    
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      deal,
      message: 'Deal retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const dealData = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }
    
    // Simulate finding and updating the deal
    const updatedDeal = {
      id,
      ...dealData,
      updatedAt: new Date().toISOString()
    };
    
    // If stage is changed, find stage details
    if (dealData.stageId) {
      const stage = mockData.crm.dealStages.find(s => s.id === dealData.stageId);
      if (stage) {
        updatedDeal.stage = stage.name;
      }
    }
    
    // If customer is changed, find customer details
    if (dealData.customerId) {
      const customer = mockData.crm.customers.find(c => c.id === dealData.customerId);
      if (customer) {
        updatedDeal.customerName = customer.name;
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json({
      deal: updatedDeal,
      message: 'Deal updated successfully'
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json({
      message: 'Deal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}

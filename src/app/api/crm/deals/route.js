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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const stage = searchParams.get('stage');
    const status = searchParams.get('status');
    
    // Generate deals from base data
    let deals = generateDeals(mockData.crm.deals || [], 50);
    
    // Apply filters
    if (search) {
      deals = deals.filter(deal => 
        deal.title.toLowerCase().includes(search.toLowerCase()) ||
        deal.customerName.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (stage) {
      deals = deals.filter(deal => deal.stage === stage);
    }
    
    if (status) {
      deals = deals.filter(deal => deal.status === status);
    }
    
    // Sort by created date (newest first)
    deals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const total = deals.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedDeals = deals.slice(offset, offset + limit);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      deals: paginatedDeals,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        stages: mockData.crm.dealStages || [],
        statuses: ['active', 'pending', 'closed-won', 'closed-lost']
      }
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const dealData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'customerId', 'value', 'stageId'];
    const missingFields = requiredFields.filter(field => !dealData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Find customer and stage details
    const customer = mockData.crm.customers.find(c => c.id === dealData.customerId);
    const stage = mockData.crm.dealStages.find(s => s.id === dealData.stageId);
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 400 }
      );
    }
    
    if (!stage) {
      return NextResponse.json(
        { error: 'Deal stage not found' },
        { status: 400 }
      );
    }
    
    // Create new deal
    const newDeal = {
      id: `deal-${Date.now()}`,
      title: dealData.title,
      customerId: dealData.customerId,
      customerName: customer.name,
      value: parseFloat(dealData.value),
      currency: dealData.currency || 'USD',
      stage: stage.name,
      stageId: dealData.stageId,
      probability: dealData.probability || 50,
      status: dealData.status || 'active',
      expectedCloseDate: dealData.expectedCloseDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: dealData.assignedTo || 'user-1',
      description: dealData.description || '',
      tags: dealData.tags || []
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json(
      { 
        deal: newDeal,
        message: 'Deal created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const dealData = await request.json();
    
    if (!dealData.id) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      );
    }
    
    // Simulate finding and updating the deal
    const updatedDeal = {
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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get('id');
    
    if (!dealId) {
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

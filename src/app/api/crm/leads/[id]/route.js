import { NextResponse } from 'next/server';
import mockData from '@/data/mock-data.json';

// Generate additional leads by expanding the base data
function generateLeads(baseLeads, count = 50) {
  const generated = [...baseLeads];
  
  const sources = mockData.crmTypes.leadSource;
  const statuses = mockData.crmStatuses.lead;
  
  const firstNames = ['Alex', 'Maria', 'James', 'Lisa', 'Robert', 'Jennifer', 'Michael', 'Sarah', 'David', 'Emily'];
  const lastNames = ['Wilson', 'Taylor', 'Miller', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Lopez'];
  const companies = ['Future Tech', 'NextGen Corp', 'Innovation Labs', 'Smart Business', 'Digital Dynamics', 'Tech Solutions', 'Global Systems', 'Modern Enterprise'];
  
  for (let i = baseLeads.length; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const lead = {
      id: `lead-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`,
      phone: `+1${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`,
      company: company,
      source: source,
      status: status,
      score: Math.floor(Math.random() * 100) + 1,
      estimatedValue: Math.round((Math.random() * 25000 + 2000) * 100) / 100,
      assignedTo: `Sales Rep ${Math.floor(Math.random() * 5) + 1}`,
      notes: 'Potential customer interested in our services',
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      followUpDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    generated.push(lead);
  }
  
  return generated;
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }
    
    // Generate leads from base data
    const leads = generateLeads(mockData.crmData.leads || [], 50);
    
    // Find the specific lead
    const lead = leads.find(l => l.id === id);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch lead' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const leadData = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Lead ID is required' 
        },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const requiredFields = ['name', 'email'];
    const missingFields = requiredFields.filter(field => !leadData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Simulate finding and updating the lead
    const updatedLead = {
      id,
      ...leadData,
      updatedAt: new Date().toISOString()
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: 'Lead updated successfully'
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update lead' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Lead ID is required' 
        },
        { status: 400 }
      );
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete lead' 
      },
      { status: 500 }
    );
  }
}

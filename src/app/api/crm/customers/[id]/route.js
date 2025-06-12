import { NextResponse } from 'next/server';
import mockData from '@/data/mock-data.json';

// Generate additional customers by expanding the base data
function generateCustomers(baseCustomers, count = 100) {
  const generated = [...baseCustomers];
  
  const customerTypes = mockData.crm.customerTypes;
  const statuses = ['active', 'inactive', 'pending', 'suspended'];
  
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Robert', 'Maria', 'James', 'Emily'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const companies = ['Tech Corp', 'Business Solutions', 'Digital Systems', 'Innovation Labs', 'Smart Tech', 'Future Enterprise', 'Global Corp', 'Modern Solutions'];
  
  for (let i = baseCustomers.length; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const customer = {
      id: `customer-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`,
      phone: `+1${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`,
      company: company,
      type: customerType,
      status: status,
      totalPurchases: Math.floor(Math.random() * 50000) + 1000,
      lastOrderDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      address: {
        street: `${Math.floor(Math.random() * 999) + 1} Main St`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: 'USA'
      },
      notes: `Customer since ${new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).getFullYear()}`
    };
    
    generated.push(customer);
  }
  
  return generated;
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    // Generate customers from base data
    const customers = generateCustomers(mockData.crm.customers || [], 100);
    
    // Find the specific customer
    const customer = customers.find(c => c.id === id);
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      customer,
      message: 'Customer retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const customerData = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const requiredFields = ['name', 'email'];
    const missingFields = requiredFields.filter(field => !customerData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Simulate finding and updating the customer
    const updatedCustomer = {
      id,
      ...customerData,
      updatedAt: new Date().toISOString()
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json({
      customer: updatedCustomer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return NextResponse.json({
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}

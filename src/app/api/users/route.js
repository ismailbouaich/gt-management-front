import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mock-data.json');

function readMockData() {
  const data = fs.readFileSync(mockDataPath, 'utf8');
  return JSON.parse(data);
}

function writeMockData(data) {
  fs.writeFileSync(mockDataPath, JSON.stringify(data, null, 2));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';

    const data = readMockData();
    let users = data.users || [];

    // Apply filters
    if (search) {
      users = users.filter(user => 
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search)
      );
    }

    if (role) {
      users = users.filter(user => user.role === role);
    }

    if (department) {
      users = users.filter(user => user.department === department);
    }

    if (status) {
      users = users.filter(user => user.status === status);
    }

    return NextResponse.json({ users, total: users.length });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newUser = await request.json();
    const data = readMockData();
    
    if (!data.users) {
      data.users = [];
    }

    const user = {
      id: `user-${Date.now()}`,
      ...newUser,
      fullName: `${newUser.firstName} ${newUser.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      status: 'Active'
    };

    data.users.push(user);
    writeMockData(data);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

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

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    const data = readMockData();
    const user = data.users?.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = params.id;
    const updates = await request.json();
    const data = readMockData();
    
    const userIndex = data.users?.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = {
      ...data.users[userIndex],
      ...updates,
      fullName: updates.firstName && updates.lastName ? `${updates.firstName} ${updates.lastName}` : data.users[userIndex].fullName,
      updatedAt: new Date().toISOString()
    };

    data.users[userIndex] = updatedUser;
    writeMockData(data);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = params.id;
    const data = readMockData();
    
    const userIndex = data.users?.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    data.users.splice(userIndex, 1);
    writeMockData(data);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

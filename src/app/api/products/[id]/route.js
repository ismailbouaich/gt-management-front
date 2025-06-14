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

// Simulate API delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    const productId = params.id;
    const data = readMockData();
    const product = data.products?.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const productId = params.id;
    const updates = await request.json();
    const data = readMockData();
    
    const productIndex = data.products?.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = {
      ...data.products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    data.products[productIndex] = updatedProduct;
    writeMockData(data);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    const productId = params.id;
    const data = readMockData();
    
    const productIndex = data.products?.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    data.products.splice(productIndex, 1);
    writeMockData(data);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

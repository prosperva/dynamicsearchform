import { NextRequest, NextResponse } from 'next/server';
import { products } from '../route';

// Type guard for params
type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    return NextResponse.json(
      { message: 'Invalid product ID' },
      { status: 400 }
    );
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return NextResponse.json(
      { message: 'Product not found' },
      { status: 404 }
    );
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  return NextResponse.json(product);
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    return NextResponse.json(
      { message: 'Invalid product ID' },
      { status: 400 }
    );
  }

  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    return NextResponse.json(
      { message: 'Product not found' },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();

    // Update product fields (only provided fields)
    const updatedProduct = {
      ...products[index],
      ...(body.name !== undefined && { name: body.name }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.stock !== undefined && { stock: Number(body.stock) }),
      ...(body.description !== undefined && { description: body.description }),
      updatedAt: now,
    };

    products[index] = updatedProduct;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    return NextResponse.json(
      { message: 'Invalid product ID' },
      { status: 400 }
    );
  }

  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    return NextResponse.json(
      { message: 'Product not found' },
      { status: 404 }
    );
  }

  // Remove product from array
  products.splice(index, 1);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  return new NextResponse(null, { status: 204 });
}

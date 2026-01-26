import { NextRequest, NextResponse } from 'next/server';

// In-memory product store (simulates database)
// In production, replace with actual database calls
interface Product {
  id: number;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'discontinued';
  price: number;
  stock: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Initialize with mock data
const products: Product[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: ['electronics', 'clothing', 'home', 'sports'][i % 4],
  status: ['active', 'inactive', 'discontinued'][i % 3] as Product['status'],
  price: Math.round(Math.random() * 1000 * 100) / 100,
  stock: Math.floor(Math.random() * 500),
  description: `Description for product ${i + 1}. This is a sample product with detailed information.`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
}));

// Make products accessible from other route files
export { products };

// GET /api/products - List products with pagination, sorting, and filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Pagination
  const page = parseInt(searchParams.get('page') || '0', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);

  // Sorting
  const sortField = searchParams.get('sortField') || 'id';
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

  // Filters
  const search = searchParams.get('search')?.toLowerCase();
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const priceRange = searchParams.get('priceRange');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  // Apply filters
  let filtered = [...products];

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    } else if (!isNaN(min)) {
      filtered = filtered.filter((p) => p.price >= min);
    }
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    filtered = filtered.filter((p) => new Date(p.createdAt) >= fromDate);
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    filtered = filtered.filter((p) => new Date(p.createdAt) <= toDate);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const aVal = a[sortField as keyof Product];
    const bVal = b[sortField as keyof Product];

    if (aVal === undefined || bVal === undefined) return 0;

    let comparison = 0;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal) < String(bVal) ? -1 : 1;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = page * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 200));

  return NextResponse.json({
    data: paginated,
    total,
    page,
    pageSize,
    totalPages,
  });
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.category || !body.status || body.price === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields: name, category, status, price' },
        { status: 400 }
      );
    }

    // Generate new ID
    const maxId = Math.max(...products.map((p) => p.id), 0);
    const now = new Date().toISOString();

    const newProduct: Product = {
      id: maxId + 1,
      name: body.name,
      category: body.category,
      status: body.status,
      price: Number(body.price),
      stock: Number(body.stock) || 0,
      description: body.description || '',
      createdAt: now,
      updatedAt: now,
    };

    products.push(newProduct);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    );
  }
}

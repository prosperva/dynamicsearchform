import { NextRequest, NextResponse } from 'next/server';
import { products } from '../route';

// Interface for all products request body (no pagination)
interface AllProductsParams {
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
  status?: string;
  priceRange?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

// POST /api/products/all - Fetch all products without pagination (for reports/exports)
export async function POST(request: NextRequest) {
  try {
    const body: AllProductsParams = await request.json();

    // Sorting with defaults
    const sortField = body.sortField || 'id';
    const sortOrder = body.sortOrder || 'asc';

    // Filters from JSON body
    const search = body.search?.toLowerCase();
    const category = body.category;
    const status = body.status;
    const priceRange = body.priceRange;
    const dateFrom = body.dateFrom;
    const dateTo = body.dateTo;

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
    type ProductKey = 'id' | 'name' | 'category' | 'status' | 'price' | 'stock' | 'description' | 'createdAt' | 'updatedAt';

    filtered.sort((a, b) => {
      const aVal = a[sortField as ProductKey];
      const bVal = b[sortField as ProductKey];

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

    const total = filtered.length;

    // Simulate network delay for realistic behavior
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Return all rows without pagination
    return NextResponse.json({
      data: filtered,
      total,
      page: 0,
      pageSize: total,
      totalPages: 1,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    );
  }
}

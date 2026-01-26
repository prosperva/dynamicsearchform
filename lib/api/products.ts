// Product types
export interface Product {
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

export interface ProductsQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
  status?: string;
  priceRange?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateProductInput {
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'discontinued';
  price: number;
  stock: number;
  description?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

// API client functions
const API_BASE = '/api/products';

export async function fetchProducts(params: ProductsQueryParams): Promise<ProductsResponse> {
  // Send search params as JSON body via POST
  const response = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create product');
  }

  return response.json();
}

export async function updateProduct(id: number, input: UpdateProductInput): Promise<Product> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update product');
  }

  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete product');
  }
}

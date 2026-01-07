import { NextResponse } from 'next/server';

export async function GET() {
  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Home & Garden', value: 'home-garden' },
    { label: 'Sports & Outdoors', value: 'sports' },
    { label: 'Toys & Games', value: 'toys' },
    { label: 'Food & Beverages', value: 'food' },
    { label: 'Health & Beauty', value: 'health' },
  ];

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(categories);
}

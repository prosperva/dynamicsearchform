import { NextResponse } from 'next/server';

export async function GET() {
  // Example API that uses different field names (name/id instead of label/value)
  const cities = [
    { id: 'nyc', name: 'New York City', country: 'US' },
    { id: 'lon', name: 'London', country: 'UK' },
    { id: 'tok', name: 'Tokyo', country: 'JP' },
    { id: 'par', name: 'Paris', country: 'FR' },
    { id: 'ber', name: 'Berlin', country: 'DE' },
    { id: 'syd', name: 'Sydney', country: 'AU' },
    { id: 'tor', name: 'Toronto', country: 'CA' },
    { id: 'mum', name: 'Mumbai', country: 'IN' },
  ];

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(cities);
}

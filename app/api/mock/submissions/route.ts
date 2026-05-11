import { NextResponse } from 'next/server';

export const MOCK_SUBMISSIONS = [
  {
    id: '1',
    name: 'Laptop Bundle Q1',
    description: 'Q1 electronics package',
    category: 'Electronics',
    subCategory: 'Laptops',
    codes: [
      { id: 'c1', code: '3.2.4.5 (0)', status: 'valid' },
      { id: 'c2', code: '1.0.2.1 (0)', status: 'valid' },
    ],
    createdAt: '2026-04-10T09:00:00Z',
    referenceNumber: 'REF-ABC123',
    link: 'https://other-app.example.com/items/REF-ABC123',
  },
  {
    id: '2',
    name: 'Spring Clothing Line',
    description: "Women's spring collection",
    category: 'Clothing',
    subCategory: "Women's",
    codes: [
      { id: 'c3', code: '5.1.3.2 (0)', status: 'valid' },
    ],
    createdAt: '2026-04-15T11:30:00Z',
    referenceNumber: 'REF-DEF456',
    link: 'https://other-app.example.com/items/REF-DEF456',
  },
  {
    id: '3',
    name: 'Garden Tools Set',
    description: 'Premium garden toolkit',
    category: 'Home & Garden',
    subCategory: 'Garden Tools',
    codes: [
      { id: 'c4', code: '2.4.1.0 (0)', status: 'valid' },
      { id: 'c5', code: '7.3.2.1 (0)', status: 'invalid' },
      { id: 'c6', code: '9.1.0.4 (0)', status: 'valid' },
    ],
    createdAt: '2026-04-22T14:00:00Z',
    referenceNumber: 'REF-GHI789',
    link: 'https://other-app.example.com/items/REF-GHI789',
  },
  {
    id: '4',
    name: 'Fitness Starter Pack',
    description: 'Beginner fitness equipment',
    category: 'Sports',
    subCategory: 'Fitness',
    codes: [
      { id: 'c7', code: '4.2.1.3 (0)', status: 'valid' },
    ],
    createdAt: '2026-05-01T08:00:00Z',
    referenceNumber: 'REF-JKL012',
    link: 'https://other-app.example.com/items/REF-JKL012',
  },
];

export async function GET() {
  return NextResponse.json(MOCK_SUBMISSIONS);
}

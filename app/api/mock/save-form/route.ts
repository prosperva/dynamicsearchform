import { NextRequest, NextResponse } from 'next/server';

// Simulates saving the form and returning a reference number
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1000));

  const ref = `REF-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({
    success: true,
    referenceNumber: ref,
    link: `https://other-app.example.com/items/${ref}`,
    submittedAt: new Date().toISOString(),
    summary: {
      name: body.name,
      codes: body.codes?.length ?? 0,
    },
  });
}

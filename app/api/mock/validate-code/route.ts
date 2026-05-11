import { NextRequest, NextResponse } from 'next/server';

// Simulates an external API that validates a code in format X.X.X.X (Y)
export async function POST(request: NextRequest) {
  const { code } = await request.json();

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

  // Codes ending in (0) are always valid; others have 80% chance of being valid
  const isZero = code?.trim().endsWith('(0)');
  const valid = isZero || Math.random() > 0.2;

  if (valid) {
    return NextResponse.json({ valid: true, message: `Code "${code}" is valid.` });
  } else {
    return NextResponse.json(
      { valid: false, message: `Code "${code}" was not found in the registry.` },
      { status: 422 }
    );
  }
}

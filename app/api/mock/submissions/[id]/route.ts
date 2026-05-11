import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SUBMISSIONS } from '../route';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const item = MOCK_SUBMISSIONS.find((s) => s.id === id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const item = MOCK_SUBMISSIONS.find((s) => s.id === id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Simulate save latency
  await new Promise((r) => setTimeout(r, 900));

  const body = await request.json();
  return NextResponse.json({
    success: true,
    referenceNumber: item.referenceNumber,
    updatedAt: new Date().toISOString(),
    summary: { name: body.name, codes: body.codes?.length ?? 0 },
  });
}

// Legacy evaluate route - redirects to new chat API
// Kept for backward compatibility

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Use /api/chat instead.' },
    { status: 410 }
  );
}

// This file is deprecated and will be removed in the future.
// The application no longer uses Figma API integration.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated' },
    { status: 404 }
  );
}
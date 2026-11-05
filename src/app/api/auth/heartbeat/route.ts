import { NextResponse } from 'next/server';
import { getAuthPayloadFromRequest } from '@/lib/auth';
import { touchSession } from '@/lib/sessionManager';

export async function POST(req: Request) {
  try {
    const payload = getAuthPayloadFromRequest(req);
    if (!payload || !payload.userId) {
      return NextResponse.json({ active: false, reason: 'unauthorized' });
    }

    const active = touchSession(payload.userId, payload.sessionId);
    return NextResponse.json({ active });
  } catch (err: any) {
    return NextResponse.json({ active: false, error: err.message });
  }
}


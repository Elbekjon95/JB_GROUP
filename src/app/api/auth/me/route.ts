import { NextResponse } from 'next/server';
import { getUserFromRequest, getAuthPayloadFromRequest } from '@/lib/auth';
import { touchSession } from '@/lib/sessionManager';

export async function GET(req: Request) {
  try {
    const payload = getAuthPayloadFromRequest(req);
    const user = await getUserFromRequest(req);
    if (!user || !payload) {
      return NextResponse.json({ user: null });
    }

    if (payload.sessionId) {
      const active = touchSession(user.id, payload.sessionId);
      if (!active) {
        return NextResponse.json({ user: null, sessionExpired: true });
      }
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ user: null });
  }
}


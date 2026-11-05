import { NextResponse } from 'next/server';
import { getAuthPayloadFromRequest } from '@/lib/auth';
import { destroySession } from '@/lib/sessionManager';

export async function POST(req: Request) {
  try {
    const payload = getAuthPayloadFromRequest(req);
    if (payload && payload.userId) {
      destroySession(payload.userId);
    }
  } catch (err) {
    console.warn('Logout session destroy error:', err);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('uzw_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0
  });
  return response;
}


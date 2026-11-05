import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { signToken, getAuthPayloadFromRequest } from '@/lib/auth';
import { canUserLogin, registerSession } from '@/lib/sessionManager';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email va parol kiritilishi shart' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Foydalanuvchi topilmadi. Elektron pochtangizni tekshiring!' },
        { status: 401 }
      );
    }

    // Parolni bcrypt bilan tekshirish
    // Agar eski oddiy parol bo'lsa, uni solishtirib, avtomatik bcrypt hash qilib qo'yadi
    let isValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isValid = await bcrypt.compare(password, user.password);
    } else {
      isValid = password === user.password;
      if (isValid) {
        // Avtomatik bcrypt ga o'tkazish
        const newHash = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: newHash }
        });
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Kiritilgan parol noto\'g\'ri!' },
        { status: 401 }
      );
    }

    // Foydalanuvchining boshqa qurilmadan kirganligi (Concurrent login) tekshiruvi:
    // Bitta login bilan ikkita odam kira olmaydi!
    const existingAuth = getAuthPayloadFromRequest(req);
    const loginCheck = canUserLogin(user.id, existingAuth?.sessionId);
    if (!loginCheck.allowed) {
      return NextResponse.json(
        { 
          error: loginCheck.reason,
          isAlreadyLoggedIn: true,
          remainingSeconds: loginCheck.remainingSeconds
        },
        { status: 403 }
      );
    }

    const sessionId = crypto.randomUUID();
    registerSession(user.id, user.email, sessionId);

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId
    });

    // Parolni olib tashlab foydalanuvchini qaytarish
    const { password: _, ...safeUser } = user;

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token
    });

    // Cookie ga ham qo'yamiz
    response.cookies.set('uzw_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 kun
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Serverda xatolik yuz berdi: ' + err.message },
      { status: 500 }
    );
  }
}


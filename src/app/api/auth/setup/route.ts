import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

/**
 * GET /api/auth/setup
 * Tizimda birorta ham foydalanuvchi bor-yo'qligini tekshiradi.
 * Faqat bazada 0 ta foydalanuvchi bo'lgandagina needsSetup: true qaytaradi.
 */
export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json({
      needsSetup: count === 0,
      userCount: count
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Server xatoligi: ' + err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/setup
 * Loyihada registratsiya tizimi FAQAT BIR MARTA ishlaydi:
 * bazada hech kim bo'lmaganda birinchi foydalanuvchini SUPER_ADMIN sifatida ro'yxatdan o'tkazadi.
 * Keyingi barcha urinishlar qat'iy 403 bilan rad etiladi.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Ism-sharif, elektron pochta va parol kiritilishi shart!' },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: 'Parol kamida 6 ta belgidan iborat bo\'lishi shart!' },
        { status: 400 }
      );
    }

    const cleanName = String(fullName).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const permissions = {
      canManageTariffs: true,
      canManageWarehouse: true,
      canLinkTariffs: true,
      canHandleHazardous: true,
      allowedSectorIds: ['ALL'],
      canStockMovement: true,
      canViewFinances: true,
      canEditProducts: true,
      canViewEditLogs: true
    };

    const createdUser = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.user.count();
      if (existingCount > 0) {
        throw new Error('ALREADY_INITIALIZED');
      }

      const user = await tx.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          fullName: cleanName,
          role: 'SUPER_ADMIN',
          permissions: permissions as any,
          canManageTariffs: true,
          canManageWarehouses: true,
          canStockMovement: true
        }
      });

      // Asosiy ombor rahbari ismini ham birinchi Super Admin nomiga yangilaymiz
      await tx.warehouse.updateMany({
        where: { id: 'wh-main' },
        data: { manager: cleanName }
      });

      return user;
    });

    const token = signToken({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role
    });

    const { password: _, ...safeUser } = createdUser;

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token
    });

    response.cookies.set('uzw_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err: any) {
    if (err?.message === 'ALREADY_INITIALIZED') {
      return NextResponse.json(
        { error: 'Tizimda Bosh Rahbar (Super Admin) allaqachon ro\'yxatdan o\'tgan! Registratsiya faqat 1 marta ishlaydi.' },
        { status: 403 }
      );
    }
    console.error('Initial Super Admin setup error:', err);
    return NextResponse.json(
      { error: 'Ro\'yxatdan o\'tishda xatolik: ' + err.message },
      { status: 500 }
    );
  }
}


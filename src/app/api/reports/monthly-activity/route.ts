import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Faqat Super Admin uchun' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    const startDate = `${month}-01`;
    const endDateObj = new Date(month + '-01');
    endDateObj.setMonth(endDateObj.getMonth() + 1);
    const endDate = endDateObj.toISOString().slice(0, 10);

    const movements = await prisma.cargoMovement.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate
        }
      },
      orderBy: { date: 'desc' }
    });

    const userStats = new Map<string, {
      userId: string;
      userName: string;
      userRole: string;
      inCount: number;
      outCount: number;
      inQuantity: number;
      outQuantity: number;
      inWeightKg: number;
      outWeightKg: number;
      totalInAmount: number;
      totalOutAmount: number;
      productsIn: Set<string>;
      productsOut: Set<string>;
      clientsIn: Set<string>;
      clientsOut: Set<string>;
      dailyActivity: Map<string, { in: number; out: number }>;
    }>();

    movements.forEach(m => {
      const key = m.userName || 'Noma\'lum';
      if (!userStats.has(key)) {
        userStats.set(key, {
          userId: m.id,
          userName: key,
          userRole: m.userRole || 'USER',
          inCount: 0,
          outCount: 0,
          inQuantity: 0,
          outQuantity: 0,
          inWeightKg: 0,
          outWeightKg: 0,
          totalInAmount: 0,
          totalOutAmount: 0,
          productsIn: new Set(),
          productsOut: new Set(),
          clientsIn: new Set(),
          clientsOut: new Set(),
          dailyActivity: new Map()
        });
      }

      const stats = userStats.get(key)!;
      const dayKey = m.date;

      if (!stats.dailyActivity.has(dayKey)) {
        stats.dailyActivity.set(dayKey, { in: 0, out: 0 });
      }

      if (m.type === 'IN') {
        stats.inCount += 1;
        stats.inQuantity += m.quantity || 0;
        stats.inWeightKg += m.weightKg || 0;
        stats.totalInAmount += m.grandTotalUZS || m.totalCostUZS || m.obrabotkaCostUZS || 0;
        if (m.productName) stats.productsIn.add(m.productName);
        if (m.clientName) stats.clientsIn.add(m.clientName);
        stats.dailyActivity.get(dayKey)!.in += 1;
      } else {
        stats.outCount += 1;
        stats.outQuantity += m.quantity || 0;
        stats.outWeightKg += m.weightKg || 0;
        stats.totalOutAmount += m.grandTotalUZS || m.totalCostUZS || 0;
        if (m.productName) stats.productsOut.add(m.productName);
        if (m.receiverName || m.clientName) stats.clientsOut.add(m.receiverName || m.clientName || '');
        stats.dailyActivity.get(dayKey)!.out += 1;
      }
    });

    const report = Array.from(userStats.values()).map(s => ({
      userName: s.userName,
      userRole: s.userRole,
      inCount: s.inCount,
      outCount: s.outCount,
      totalOperations: s.inCount + s.outCount,
      inQuantity: s.inQuantity,
      outQuantity: s.outQuantity,
      inWeightKg: Math.round(s.inWeightKg),
      outWeightKg: Math.round(s.outWeightKg),
      totalInAmount: Math.round(s.totalInAmount),
      totalOutAmount: Math.round(s.totalOutAmount),
      totalAmount: Math.round(s.totalInAmount + s.totalOutAmount),
      uniqueProductsIn: s.productsIn.size,
      uniqueProductsOut: s.productsOut.size,
      uniqueClientsIn: s.clientsIn.size,
      uniqueClientsOut: s.clientsOut.size,
      dailyActivity: Array.from(s.dailyActivity.entries())
        .map(([date, counts]) => ({ date, in: counts.in, out: counts.out }))
        .sort((a, b) => a.date.localeCompare(b.date))
    })).sort((a, b) => b.totalOperations - a.totalOperations);

    const summary = {
      month,
      totalUsers: report.length,
      totalInOperations: report.reduce((sum, r) => sum + r.inCount, 0),
      totalOutOperations: report.reduce((sum, r) => sum + r.outCount, 0),
      totalOperations: report.reduce((sum, r) => sum + r.totalOperations, 0),
      totalInQuantity: report.reduce((sum, r) => sum + r.inQuantity, 0),
      totalOutQuantity: report.reduce((sum, r) => sum + r.outQuantity, 0),
      totalInWeightKg: report.reduce((sum, r) => sum + r.inWeightKg, 0),
      totalOutWeightKg: report.reduce((sum, r) => sum + r.outWeightKg, 0),
      totalInAmount: report.reduce((sum, r) => sum + r.totalInAmount, 0),
      totalOutAmount: report.reduce((sum, r) => sum + r.totalOutAmount, 0),
      totalAmount: report.reduce((sum, r) => sum + r.totalAmount, 0)
    };

    return NextResponse.json({ report, summary });
  } catch (err: any) {
    console.error('Monthly activity report error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
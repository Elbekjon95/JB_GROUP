import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductEditLog } from '@/lib/types';

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        action: { in: ['PRODUCT_EDIT', 'PRODUCT_DELETE'] }
      },
      orderBy: { createdAt: 'desc' }
    });

    const editLogs: ProductEditLog[] = logs.map((l) => {
      let parsed: any = {};
      try {
        parsed = JSON.parse(l.details || '{}');
      } catch {}

      const createdDate = l.createdAt.toISOString().slice(0, 10);
      const isDelete = l.action === 'PRODUCT_DELETE' || parsed.actionType === 'DELETE';

      return {
        id: l.id,
        productId: l.entityId || '',
        productName: l.entityName || 'Yuk',
        sectorName: parsed.sectorName || '',
        clientName: parsed.clientName || '',
        userId: l.userId || undefined,
        userName: l.userName,
        userRole: l.userRole,
        date: parsed.date || createdDate,
        time: parsed.time || l.createdAt.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        month: parsed.month || createdDate.slice(0, 7),
        reason: parsed.reason || (isDelete ? 'Kiritilgan yuk tizimdan o\'chirildi' : 'Kirim ma\'lumotlariga tuzatish kiritildi'),
        changes: Array.isArray(parsed.changes) ? parsed.changes : [],
        actionType: (isDelete ? 'DELETE' : 'EDIT') as 'EDIT' | 'DELETE',
        status: l.status || (isDelete ? 'O\'chirildi' : 'Tahrirlandi'),
        createdAt: l.createdAt.toISOString()
      };
    });

    return NextResponse.json({ editLogs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


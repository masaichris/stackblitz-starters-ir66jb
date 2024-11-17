import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import clientPromise from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    await authenticateRequest(request);
    const client = await clientPromise;
    const db = client.db('mobile-money');

    const commissions = await db.collection('commissions')
      .find({})
      .sort({ date: -1 })
      .toArray();

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(commissions.map(commission => ({
      Date: new Date(commission.date).toLocaleDateString(),
      Amount: commission.amount,
      Type: commission.transactionType,
      Status: commission.status
    })));

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Commissions');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=commissions-report.xlsx'
      }
    });
  } catch (error) {
    console.error('Commission export error:', error);
    return NextResponse.json(
      { error: 'Failed to export commissions' },
      { status: 500 }
    );
  }
}
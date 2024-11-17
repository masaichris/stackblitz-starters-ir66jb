import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import clientPromise from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    await authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'daily';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const service = searchParams.get('service');

    const client = await clientPromise;
    const db = client.db('mobile-money');

    const query: any = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (service) {
      query.service = service;
    }

    const [balances, debts, commissions] = await Promise.all([
      db.collection('balances').find(query).toArray(),
      db.collection('debts').find(query).toArray(),
      db.collection('commissions').find(query).toArray()
    ]);

    const workbook = XLSX.utils.book_new();

    // Add balances sheet
    const balancesSheet = XLSX.utils.json_to_sheet(balances.map(b => ({
      Date: new Date(b.date).toLocaleDateString(),
      Amount: b.amount,
      LastUpdated: new Date(b.lastUpdated).toLocaleString()
    })));
    XLSX.utils.book_append_sheet(workbook, balancesSheet, 'Balances');

    // Add debts sheet
    const debtsSheet = XLSX.utils.json_to_sheet(debts.map(d => ({
      Name: d.name,
      Amount: d.amount,
      Date: new Date(d.date).toLocaleDateString(),
      Status: d.paid ? 'Paid' : 'Unpaid'
    })));
    XLSX.utils.book_append_sheet(workbook, debtsSheet, 'Debts');

    // Add commissions sheet
    const commissionsSheet = XLSX.utils.json_to_sheet(commissions.map(c => ({
      Service: c.service,
      Amount: c.amount,
      Month: c.month,
      DateAdded: new Date(c.createdAt).toLocaleDateString()
    })));
    XLSX.utils.book_append_sheet(workbook, commissionsSheet, 'Commissions');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=report-${type}.xlsx`
      }
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
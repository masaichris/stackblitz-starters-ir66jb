import { NextResponse } from 'next/server';
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import { authenticateRequest, handleError } from '@/lib/api-utils';

const balanceSchema = z.object({
  amount: z.number().min(0),
  lastUpdated: z.string().datetime(),
  trend: z.number()
});

export async function GET(request: Request) {
  try {
    await authenticateRequest(request);
    const client = await clientPromise;
    const db = client.db('mobile-money');

    const balance = await db.collection('balances')
      .findOne({}, { sort: { lastUpdated: -1 } });

    if (!balance) {
      return NextResponse.json(
        { error: 'No balance found' },
        { status: 404 }
      );
    }

    return NextResponse.json(balance);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await authenticateRequest(request);
    const body = await request.json();
    const validatedData = balanceSchema.parse(body);

    const client = await clientPromise;
    const db = client.db('mobile-money');

    const result = await db.collection('balances').insertOne({
      ...validatedData,
      lastUpdated: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (error) {
    return handleError(error);
  }
}
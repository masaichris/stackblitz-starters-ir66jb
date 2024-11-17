import { NextResponse } from 'next/server';
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import { authenticateRequest, handleError } from '@/lib/api-utils';

const commissionSchema = z.object({
  service: z.string(),
  amount: z.number().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/)
});

export async function GET(request: Request) {
  try {
    await authenticateRequest(request);
    const client = await clientPromise;
    const db = client.db('mobile-money');

    const commissions = await db.collection('commissions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(commissions);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await authenticateRequest(request);
    const body = await request.json();
    const validatedData = commissionSchema.parse(body);

    const client = await clientPromise;
    const db = client.db('mobile-money');

    const commission = {
      ...validatedData,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID()
    };

    await db.collection('commissions').insertOne(commission);

    return NextResponse.json(commission);
  } catch (error) {
    return handleError(error);
  }
}
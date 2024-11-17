import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    await authenticateRequest(request);
    const client = await clientPromise;
    const db = client.db('mobile-money');

    // Get total transactions and commissions
    const totalTransactions = await db.collection('transactions').countDocuments();
    const commissionsAgg = await db.collection('commissions')
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]).toArray();

    const totalCommissions = commissionsAgg[0]?.total || 0;

    // Get daily stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await db.collection('transactions')
      .aggregate([
        {
          $match: {
            date: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            transactions: { $sum: 1 },
            commissions: { $sum: '$commission' }
          }
        },
        {
          $sort: { '_id': 1 }
        },
        {
          $project: {
            date: '$_id',
            transactions: 1,
            commissions: 1,
            _id: 0
          }
        }
      ]).toArray();

    // Get transaction types distribution
    const transactionTypes = await db.collection('transactions')
      .aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            type: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]).toArray();

    return NextResponse.json({
      totalTransactions,
      totalCommissions,
      dailyStats,
      transactionTypes
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
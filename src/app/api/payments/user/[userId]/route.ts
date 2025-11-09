import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { payments } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);

    // Validate userId parameter
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(userId);

    // Get optional filter parameters
    const status = searchParams.get('status');
    const paymentType = searchParams.get('payment_type');

    // Build query conditions
    const conditions = [eq(payments.userId, userIdInt)];

    if (status) {
      conditions.push(eq(payments.status, status));
    }

    if (paymentType) {
      conditions.push(eq(payments.paymentType, paymentType));
    }

    // Execute query with filters and sorting
    const userPayments = await db
      .select()
      .from(payments)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(desc(payments.createdAt));

    return NextResponse.json(userPayments, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
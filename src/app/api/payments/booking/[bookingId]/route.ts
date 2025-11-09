import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { payments } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params;

    // Validate bookingId
    if (!bookingId || isNaN(parseInt(bookingId))) {
      return NextResponse.json(
        {
          error: 'Valid booking ID is required',
          code: 'INVALID_BOOKING_ID',
        },
        { status: 400 }
      );
    }

    const bookingIdInt = parseInt(bookingId);

    // Get all payments for the booking, sorted by createdAt descending
    const bookingPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.bookingId, bookingIdInt))
      .orderBy(desc(payments.createdAt));

    return NextResponse.json(bookingPayments, { status: 200 });
  } catch (error) {
    console.error('GET payments error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
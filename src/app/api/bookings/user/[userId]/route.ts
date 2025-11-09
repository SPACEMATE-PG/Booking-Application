import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
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
          code: 'INVALID_USER_ID'
        },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(userId);
    const status = searchParams.get('status');

    // Build query with userId filter
    let query = db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userIdInt))
      .orderBy(desc(bookings.createdAt));

    // Add optional status filter
    if (status) {
      query = db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.userId, userIdInt),
            eq(bookings.status, status)
          )
        )
        .orderBy(desc(bookings.createdAt));
    }

    const results = await query;

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET bookings error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message
      },
      { status: 500 }
    );
  }
}
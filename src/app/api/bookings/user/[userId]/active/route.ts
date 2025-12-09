import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

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

    // Query active bookings for the user
    const activeBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.userId, userIdInt),
          eq(bookings.status, 'Active')
        )
      )
      .orderBy(asc(bookings.moveInDate));

    return NextResponse.json(activeBookings, { status: 200 });
  } catch (error) {
    console.error('GET active bookings error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
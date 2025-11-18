import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceRequests, users, bookings } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const userId = searchParams.get('user_id');
    const bookingId = searchParams.get('booking_id');
    const status = searchParams.get('status');

    let results;

    const conditions = [];
    if (userId) {
      conditions.push(eq(maintenanceRequests.userId, parseInt(userId)));
    }
    if (bookingId) {
      conditions.push(eq(maintenanceRequests.bookingId, parseInt(bookingId)));
    }
    if (status) {
      conditions.push(eq(maintenanceRequests.status, status));
    }

    if (conditions.length > 0) {
      results = await db
        .select()
        .from(maintenanceRequests)
        .where(and(...conditions))
        .orderBy(desc(maintenanceRequests.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      results = await db
        .select()
        .from(maintenanceRequests)
        .orderBy(desc(maintenanceRequests.createdAt))
        .limit(limit)
        .offset(offset);
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bookingId, title, description, status } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!bookingId) {
      return NextResponse.json(
        { error: 'bookingId is required', code: 'MISSING_BOOKING_ID' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'description is required', code: 'MISSING_DESCRIPTION' },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(userId.toString());
    const bookingIdInt = parseInt(bookingId.toString());

    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { error: 'userId must be a valid integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    if (isNaN(bookingIdInt)) {
      return NextResponse.json(
        { error: 'bookingId must be a valid integer', code: 'INVALID_BOOKING_ID' },
        { status: 400 }
      );
    }

    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, userIdInt))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    const bookingExists = await db.select()
      .from(bookings)
      .where(eq(bookings.id, bookingIdInt))
      .limit(1);

    if (bookingExists.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
        { status: 400 }
      );
    }

    const validStatuses = ['Pending', 'InProgress', 'Resolved'];
    const finalStatus = status && validStatuses.includes(status) ? status : 'Pending';

    const newMaintenanceRequest = await db.insert(maintenanceRequests)
      .values({
        userId: userIdInt,
        bookingId: bookingIdInt,
        title: title.trim(),
        description: description.trim(),
        status: finalStatus,
        createdAt: new Date().toISOString(),
        resolvedAt: null
      })
      .returning();

    return NextResponse.json(newMaintenanceRequest[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
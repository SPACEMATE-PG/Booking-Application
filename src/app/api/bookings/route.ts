import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, users, properties, roomTypes } from '@/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const userId = searchParams.get('user_id');
    const propertyId = searchParams.get('property_id');
    const status = searchParams.get('status');

    let query = db.select().from(bookings);

    const conditions = [];
    if (userId) {
      const parsedUserId = parseInt(userId);
      if (!isNaN(parsedUserId)) {
        conditions.push(eq(bookings.userId, parsedUserId));
      }
    }
    if (propertyId) {
      const parsedPropertyId = parseInt(propertyId);
      if (!isNaN(parsedPropertyId)) {
        conditions.push(eq(bookings.propertyId, parsedPropertyId));
      }
    }
    if (status) {
      conditions.push(eq(bookings.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(bookings.createdAt))
      .limit(limit)
      .offset(offset);

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
    const {
      userId,
      propertyId,
      roomTypeId,
      moveInDate,
      durationMonths,
      totalAmount,
      bookingAmountPaid,
      status,
      paymentStatus,
      nextRentDueDate,
      bookingConfirmationUrl
    } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required', code: 'MISSING_PROPERTY_ID' },
        { status: 400 }
      );
    }
    if (!roomTypeId) {
      return NextResponse.json(
        { error: 'Room Type ID is required', code: 'MISSING_ROOM_TYPE_ID' },
        { status: 400 }
      );
    }
    if (!moveInDate) {
      return NextResponse.json(
        { error: 'Move-in date is required', code: 'MISSING_MOVE_IN_DATE' },
        { status: 400 }
      );
    }
    if (durationMonths === undefined || durationMonths === null) {
      return NextResponse.json(
        { error: 'Duration in months is required', code: 'MISSING_DURATION_MONTHS' },
        { status: 400 }
      );
    }
    if (totalAmount === undefined || totalAmount === null) {
      return NextResponse.json(
        { error: 'Total amount is required', code: 'MISSING_TOTAL_AMOUNT' },
        { status: 400 }
      );
    }
    if (bookingAmountPaid === undefined || bookingAmountPaid === null) {
      return NextResponse.json(
        { error: 'Booking amount paid is required', code: 'MISSING_BOOKING_AMOUNT_PAID' },
        { status: 400 }
      );
    }

    // Validate foreign key references
    const userExists = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    const propertyExists = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);
    if (propertyExists.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
        { status: 400 }
      );
    }

    const roomTypeExists = await db.select().from(roomTypes).where(eq(roomTypes.id, roomTypeId)).limit(1);
    if (roomTypeExists.length === 0) {
      return NextResponse.json(
        { error: 'Room type not found', code: 'ROOM_TYPE_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Validate that roomType belongs to the property
    if (roomTypeExists[0].propertyId !== propertyId) {
      return NextResponse.json(
        { error: 'Room type does not belong to the specified property', code: 'ROOM_TYPE_PROPERTY_MISMATCH' },
        { status: 400 }
      );
    }

    // Create booking with defaults
    const newBooking = await db.insert(bookings).values({
      userId,
      propertyId,
      roomTypeId,
      moveInDate,
      durationMonths,
      totalAmount,
      bookingAmountPaid,
      status: status || 'Upcoming',
      paymentStatus: paymentStatus || 'Pending',
      nextRentDueDate: nextRentDueDate || null,
      bookingConfirmationUrl: bookingConfirmationUrl || null,
      createdAt: new Date().toISOString()
    }).returning();

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid booking ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const bookingId = parseInt(id);

    // Check if booking exists
    const existingBooking = await db.select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (existingBooking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      status,
      paymentStatus,
      nextRentDueDate,
      bookingConfirmationUrl,
      cancellationDate,
      refundStatus,
      refundAmount,
      // Explicitly destructure fields that should NOT be updated
      userId,
      propertyId,
      roomTypeId,
      moveInDate,
      durationMonths,
      totalAmount,
      bookingAmountPaid,
      createdAt
    } = body;

    // Validate that immutable fields are not being updated
    if (userId !== undefined || propertyId !== undefined || roomTypeId !== undefined ||
        moveInDate !== undefined || durationMonths !== undefined || totalAmount !== undefined ||
        bookingAmountPaid !== undefined || createdAt !== undefined) {
      return NextResponse.json(
        { 
          error: 'Cannot update userId, propertyId, roomTypeId, moveInDate, durationMonths, totalAmount, bookingAmountPaid, or createdAt',
          code: 'IMMUTABLE_FIELD_UPDATE_ATTEMPT'
        },
        { status: 400 }
      );
    }

    const updates: any = {};

    if (status !== undefined) {
      updates.status = status;
      // Auto-set cancellation date if status is changed to Cancelled
      if (status === 'Cancelled' && !cancellationDate) {
        updates.cancellationDate = new Date().toISOString();
      }
    }

    if (paymentStatus !== undefined) {
      updates.paymentStatus = paymentStatus;
    }

    if (nextRentDueDate !== undefined) {
      updates.nextRentDueDate = nextRentDueDate;
    }

    if (bookingConfirmationUrl !== undefined) {
      updates.bookingConfirmationUrl = bookingConfirmationUrl;
    }

    if (cancellationDate !== undefined) {
      updates.cancellationDate = cancellationDate;
    }

    if (refundStatus !== undefined) {
      updates.refundStatus = refundStatus;
    }

    if (refundAmount !== undefined) {
      updates.refundAmount = refundAmount;
    }

    // If no valid fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_FIELDS_TO_UPDATE' },
        { status: 400 }
      );
    }

    const updatedBooking = await db.update(bookings)
      .set(updates)
      .where(eq(bookings.id, bookingId))
      .returning();

    return NextResponse.json(updatedBooking[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
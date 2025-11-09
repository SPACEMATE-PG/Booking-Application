import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { payments, users, bookings } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const userId = searchParams.get('user_id');
    const bookingId = searchParams.get('booking_id');
    const status = searchParams.get('status');
    const paymentType = searchParams.get('payment_type');

    let query = db.select().from(payments);

    const conditions = [];
    if (userId) {
      const userIdInt = parseInt(userId);
      if (isNaN(userIdInt)) {
        return NextResponse.json(
          { error: 'Invalid user_id parameter', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(payments.userId, userIdInt));
    }

    if (bookingId) {
      const bookingIdInt = parseInt(bookingId);
      if (isNaN(bookingIdInt)) {
        return NextResponse.json(
          { error: 'Invalid booking_id parameter', code: 'INVALID_BOOKING_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(payments.bookingId, bookingIdInt));
    }

    if (status) {
      conditions.push(eq(payments.status, status));
    }

    if (paymentType) {
      conditions.push(eq(payments.paymentType, paymentType));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(payments.createdAt))
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
      bookingId,
      amount,
      paymentType,
      status,
      paymentMethod,
      transactionId,
      invoiceUrl,
    } = body;

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

    if (!amount) {
      return NextResponse.json(
        { error: 'amount is required', code: 'MISSING_AMOUNT' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'amount must be a positive number', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    if (!paymentType) {
      return NextResponse.json(
        { error: 'paymentType is required', code: 'MISSING_PAYMENT_TYPE' },
        { status: 400 }
      );
    }

    const validPaymentTypes = ['Booking', 'Rent', 'Refund'];
    if (!validPaymentTypes.includes(paymentType)) {
      return NextResponse.json(
        {
          error: `paymentType must be one of: ${validPaymentTypes.join(', ')}`,
          code: 'INVALID_PAYMENT_TYPE',
        },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'status is required', code: 'MISSING_STATUS' },
        { status: 400 }
      );
    }

    const validStatuses = ['Success', 'Failed', 'Pending'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `status must be one of: ${validStatuses.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User with provided userId does not exist', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    const bookingExists = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(bookingId)))
      .limit(1);

    if (bookingExists.length === 0) {
      return NextResponse.json(
        { error: 'Booking with provided bookingId does not exist', code: 'BOOKING_NOT_FOUND' },
        { status: 400 }
      );
    }

    if (paymentMethod) {
      const validPaymentMethods = ['UPI', 'Card', 'NetBanking', 'Wallet'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return NextResponse.json(
          {
            error: `paymentMethod must be one of: ${validPaymentMethods.join(', ')}`,
            code: 'INVALID_PAYMENT_METHOD',
          },
          { status: 400 }
        );
      }
    }

    const newPayment = await db
      .insert(payments)
      .values({
        userId: parseInt(userId),
        bookingId: parseInt(bookingId),
        amount: parseInt(amount),
        paymentType,
        status,
        paymentMethod: paymentMethod || null,
        transactionId: transactionId || null,
        invoiceUrl: invoiceUrl || null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newPayment[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
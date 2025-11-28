import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, users, properties, bookings } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const propertyId = searchParams.get('property_id');
    const userId = searchParams.get('user_id');

    let results;

    const conditions = [];
    if (propertyId) {
      const propertyIdNum = parseInt(propertyId);
      if (!isNaN(propertyIdNum)) {
        conditions.push(eq(reviews.propertyId, propertyIdNum));
      }
    }
    if (userId) {
      const userIdNum = parseInt(userId);
      if (!isNaN(userIdNum)) {
        conditions.push(eq(reviews.userId, userIdNum));
      }
    }

    if (conditions.length > 0) {
      results = await db
        .select()
        .from(reviews)
        .where(and(...conditions))
        .orderBy(desc(reviews.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      results = await db
        .select()
        .from(reviews)
        .orderBy(desc(reviews.createdAt))
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
    const { userId, propertyId, bookingId, rating, comment } = body;

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

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required', code: 'MISSING_BOOKING_ID' },
        { status: 400 }
      );
    }

    if (!rating) {
      return NextResponse.json(
        { error: 'Rating is required', code: 'MISSING_RATING' },
        { status: 400 }
      );
    }

    // Validate rating range
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5', code: 'INVALID_RATING' },
        { status: 400 }
      );
    }

    // Validate userId exists
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Validate propertyId exists
    const propertyExists = await db.select()
      .from(properties)
      .where(eq(properties.id, parseInt(propertyId)))
      .limit(1);

    if (propertyExists.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Validate bookingId exists
    const bookingExists = await db.select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(bookingId)))
      .limit(1);

    if (bookingExists.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found', code: 'BOOKING_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Check for duplicate review
    const existingReview = await db.select()
      .from(reviews)
      .where(
        and(
          eq(reviews.userId, parseInt(userId)),
          eq(reviews.propertyId, parseInt(propertyId)),
          eq(reviews.bookingId, parseInt(bookingId))
        )
      )
      .limit(1);

    if (existingReview.length > 0) {
      return NextResponse.json(
        {
          error: 'You have already reviewed this property for this booking',
          code: 'DUPLICATE_REVIEW'
        },
        { status: 400 }
      );
    }

    // Create review
    const newReview = await db.insert(reviews)
      .values({
        userId: parseInt(userId),
        propertyId: parseInt(propertyId),
        bookingId: parseInt(bookingId),
        rating: ratingNum,
        comment: comment ? comment.trim() : null,
        createdAt: new Date() as Date
      })
      .returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
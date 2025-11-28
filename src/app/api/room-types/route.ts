import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { roomTypes, properties } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const propertyId = searchParams.get('property_id');

    let results;

    if (propertyId) {
      const propertyIdNum = parseInt(propertyId);
      if (isNaN(propertyIdNum)) {
        return NextResponse.json(
          { error: 'Invalid property_id parameter', code: 'INVALID_PROPERTY_ID' },
          { status: 400 }
        );
      }
      results = await db
        .select()
        .from(roomTypes)
        .where(eq(roomTypes.propertyId, propertyIdNum))
        .limit(limit)
        .offset(offset);
    } else {
      results = await db
        .select()
        .from(roomTypes)
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
    const { propertyId, type, pricePerMonth, availableRooms } = body;

    // Validate required fields
    if (!propertyId) {
      return NextResponse.json(
        { error: 'propertyId is required', code: 'MISSING_PROPERTY_ID' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    if (pricePerMonth === undefined || pricePerMonth === null) {
      return NextResponse.json(
        { error: 'pricePerMonth is required', code: 'MISSING_PRICE_PER_MONTH' },
        { status: 400 }
      );
    }

    if (availableRooms === undefined || availableRooms === null) {
      return NextResponse.json(
        { error: 'availableRooms is required', code: 'MISSING_AVAILABLE_ROOMS' },
        { status: 400 }
      );
    }

    // Validate propertyId is a valid integer
    const propertyIdNum = parseInt(propertyId);
    if (isNaN(propertyIdNum)) {
      return NextResponse.json(
        { error: 'propertyId must be a valid integer', code: 'INVALID_PROPERTY_ID' },
        { status: 400 }
      );
    }

    // Validate pricePerMonth is a valid integer
    const pricePerMonthNum = parseInt(pricePerMonth);
    if (isNaN(pricePerMonthNum) || pricePerMonthNum < 0) {
      return NextResponse.json(
        { error: 'pricePerMonth must be a valid positive integer', code: 'INVALID_PRICE_PER_MONTH' },
        { status: 400 }
      );
    }

    // Validate availableRooms is a valid integer
    const availableRoomsNum = parseInt(availableRooms);
    if (isNaN(availableRoomsNum) || availableRoomsNum < 0) {
      return NextResponse.json(
        { error: 'availableRooms must be a valid positive integer', code: 'INVALID_AVAILABLE_ROOMS' },
        { status: 400 }
      );
    }

    // Validate type is one of the allowed values
    const allowedTypes = ['Single', 'Double', 'Triple'];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: 'type must be one of: Single, Double, Triple', code: 'INVALID_TYPE' },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyIdNum))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Create room type
    const newRoomType = await db
      .insert(roomTypes)
      .values({
        propertyId: propertyIdNum,
        type: type.trim(),
        pricePerMonth: pricePerMonthNum,
        availableRooms: availableRoomsNum,
        totalRooms: availableRoomsNum,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(newRoomType[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
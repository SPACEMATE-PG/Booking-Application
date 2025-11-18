import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { roomTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const roomTypeId = parseInt(id);

    // Check if room type exists
    const existingRoomType = await db
      .select()
      .from(roomTypes)
      .where(eq(roomTypes.id, roomTypeId))
      .limit(1);

    if (existingRoomType.length === 0) {
      return NextResponse.json(
        {
          error: 'Room type not found',
          code: 'ROOM_TYPE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate that protected fields are not being updated
    if ('id' in body || 'propertyId' in body || 'createdAt' in body) {
      return NextResponse.json(
        {
          error: 'Cannot update id, propertyId, or createdAt',
          code: 'PROTECTED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Extract allowed update fields
    const updates: {
      type?: string;
      pricePerMonth?: number;
      availableRooms?: number;
      updatedAt: string;
    } = {
      updatedAt: new Date().toISOString(),
    };

    // Validate and sanitize type
    if ('type' in body) {
      if (typeof body.type !== 'string' || body.type.trim() === '') {
        return NextResponse.json(
          {
            error: 'Type must be a non-empty string',
            code: 'INVALID_TYPE',
          },
          { status: 400 }
        );
      }
      updates.type = body.type.trim();
    }

    // Validate pricePerMonth
    if ('pricePerMonth' in body) {
      if (typeof body.pricePerMonth !== 'number' || body.pricePerMonth < 0) {
        return NextResponse.json(
          {
            error: 'Price per month must be a non-negative number',
            code: 'INVALID_PRICE',
          },
          { status: 400 }
        );
      }
      updates.pricePerMonth = body.pricePerMonth;
    }

    // Validate availableRooms
    if ('availableRooms' in body) {
      if (typeof body.availableRooms !== 'number' || body.availableRooms < 0 || !Number.isInteger(body.availableRooms)) {
        return NextResponse.json(
          {
            error: 'Available rooms must be a non-negative integer',
            code: 'INVALID_AVAILABLE_ROOMS',
          },
          { status: 400 }
        );
      }
      updates.availableRooms = body.availableRooms;
    }

    // Check if there are any fields to update
    if (Object.keys(updates).length === 1) {
      return NextResponse.json(
        {
          error: 'No valid fields to update',
          code: 'NO_UPDATE_FIELDS',
        },
        { status: 400 }
      );
    }

    // Update room type
    const updatedRoomType = await db
      .update(roomTypes)
      .set(updates)
      .where(eq(roomTypes.id, roomTypeId))
      .returning();

    return NextResponse.json(updatedRoomType[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}
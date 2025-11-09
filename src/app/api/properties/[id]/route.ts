import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, roomTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    const propertyId = parseInt(id);

    // Fetch property details
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      return NextResponse.json(
        {
          error: 'Property not found',
          code: 'PROPERTY_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Fetch associated room types
    const propertyRoomTypes = await db
      .select()
      .from(roomTypes)
      .where(eq(roomTypes.propertyId, propertyId));

    return NextResponse.json(
      {
        property: property[0],
        roomTypes: propertyRoomTypes,
      },
      { status: 200 }
    );
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
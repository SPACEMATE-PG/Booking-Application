import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { roomTypes } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { propertyId } = params;

    // Validate propertyId parameter
    if (!propertyId || isNaN(parseInt(propertyId))) {
      return NextResponse.json(
        {
          error: 'Valid property ID is required',
          code: 'INVALID_PROPERTY_ID',
        },
        { status: 400 }
      );
    }

    const propertyIdInt = parseInt(propertyId);

    // Get all room types for the property, sorted by price ascending
    const results = await db
      .select()
      .from(roomTypes)
      .where(eq(roomTypes.propertyId, propertyIdInt))
      .orderBy(asc(roomTypes.pricePerMonth));

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET room types error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
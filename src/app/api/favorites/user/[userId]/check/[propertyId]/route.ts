import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { favorites } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; propertyId: string } }
) {
  try {
    const { userId, propertyId } = params;

    // Validate userId parameter
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        {
          error: 'Valid userId is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    // Validate propertyId parameter
    if (!propertyId || isNaN(parseInt(propertyId))) {
      return NextResponse.json(
        {
          error: 'Valid propertyId is required',
          code: 'INVALID_PROPERTY_ID',
        },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(userId);
    const propertyIdInt = parseInt(propertyId);

    // Check if favorite exists for this user-property combination
    const favorite = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userIdInt),
          eq(favorites.propertyId, propertyIdInt)
        )
      )
      .limit(1);

    // Return result with isFavorited flag and favoriteId if exists
    if (favorite.length > 0) {
      return NextResponse.json({
        isFavorited: true,
        favoriteId: favorite[0].id,
      });
    }

    return NextResponse.json({
      isFavorited: false,
      favoriteId: null,
    });
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

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const { searchParams } = new URL(request.url);

    // Validate propertyId
    const propertyIdInt = parseInt(propertyId);
    if (!propertyId || isNaN(propertyIdInt)) {
      return NextResponse.json(
        { 
          error: 'Valid property ID is required',
          code: 'INVALID_PROPERTY_ID' 
        },
        { status: 400 }
      );
    }

    // Get pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Fetch reviews for the property
    const propertyReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.propertyId, propertyIdInt))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    // Calculate summary statistics
    let averageRating = 0;
    let totalReviews = 0;

    if (propertyReviews.length > 0) {
      const totalRating = propertyReviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = Math.round((totalRating / propertyReviews.length) * 10) / 10;
      totalReviews = propertyReviews.length;
    }

    return NextResponse.json(
      {
        reviews: propertyReviews,
        summary: {
          averageRating,
          totalReviews
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET reviews error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
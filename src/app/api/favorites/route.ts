import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { favorites, users, properties } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const userId = searchParams.get('user_id');

    let query = db.select().from(favorites);

    if (userId) {
      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        return NextResponse.json({ 
          error: "Invalid user_id parameter",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }
      query = query.where(eq(favorites.userId, userIdNum));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, propertyId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!propertyId) {
      return NextResponse.json({ 
        error: "propertyId is required",
        code: "MISSING_PROPERTY_ID" 
      }, { status: 400 });
    }

    // Validate userId is a valid number
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return NextResponse.json({ 
        error: "userId must be a valid number",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    // Validate propertyId is a valid number
    const propertyIdNum = parseInt(propertyId);
    if (isNaN(propertyIdNum)) {
      return NextResponse.json({ 
        error: "propertyId must be a valid number",
        code: "INVALID_PROPERTY_ID" 
      }, { status: 400 });
    }

    // Validate userId exists
    const userExists = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.id, userIdNum))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 400 });
    }

    // Validate propertyId exists
    const propertyExists = await db.select({ id: properties.id })
      .from(properties)
      .where(eq(properties.id, propertyIdNum))
      .limit(1);

    if (propertyExists.length === 0) {
      return NextResponse.json({ 
        error: "Property not found",
        code: "PROPERTY_NOT_FOUND" 
      }, { status: 400 });
    }

    // Check for duplicate favorite
    const duplicateCheck = await db.select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userIdNum),
          eq(favorites.propertyId, propertyIdNum)
        )
      )
      .limit(1);

    if (duplicateCheck.length > 0) {
      return NextResponse.json({ 
        error: "Property already added to favorites",
        code: "DUPLICATE_FAVORITE" 
      }, { status: 400 });
    }

    // Create favorite
    const newFavorite = await db.insert(favorites)
      .values({
        userId: userIdNum,
        propertyId: propertyIdNum,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newFavorite[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}
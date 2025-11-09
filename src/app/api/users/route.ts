import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single user by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json(
          { error: 'User not found', code: 'USER_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(user[0], { status: 200 });
    }

    // List users with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    // Build base query and conditionally apply search without narrowing type
    const baseQuery = db.select().from(users);
    const runQuery = search
      ? (baseQuery.where(
          or(
            like(users.name, `%${search}%`),
            like(users.phone, `%${search}%`)
          )
        ) as any)
      : (baseQuery as any);

    // Avoid parameterized LIMIT/OFFSET; fetch then slice
    const all = await runQuery;
    const results = all.slice(offset, offset + limit);

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
    const { phone, name, gender, age, occupation, profilePhoto } = body;

    // Validate required fields
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone is required', code: 'MISSING_PHONE' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    // Trim and sanitize inputs
    const sanitizedPhone = phone.trim();
    const sanitizedName = name.trim();

    // Check if phone already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phone, sanitizedPhone))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Phone number already exists', code: 'DUPLICATE_PHONE' },
        { status: 400 }
      );
    }

    // Create user with auto-generated fields
    const newUser = await db
      .insert(users)
      .values({
        phone: sanitizedPhone,
        name: sanitizedName,
        gender: gender?.trim() || null,
        age: age ? parseInt(age) : null,
        occupation: occupation?.trim() || null,
        profilePhoto: profilePhoto?.trim() || null,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(newUser[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, gender, age, occupation, profilePhoto } = body;

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Build update object with only allowed fields
    const updates: any = {};

    if (name !== undefined) updates.name = name.trim();
    if (gender !== undefined) updates.gender = gender?.trim() || null;
    if (age !== undefined) updates.age = age ? parseInt(age) : null;
    if (occupation !== undefined) updates.occupation = occupation?.trim() || null;
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto?.trim() || null;

    // Update user
    const updatedUser = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedUser[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
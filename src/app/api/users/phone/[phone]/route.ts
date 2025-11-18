import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { phone: string } }
) {
  try {
    const { phone } = params;

    // Basic validation and sanitization
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required', code: 'PHONE_REQUIRED' },
        { status: 400 }
      );
    }

    const sanitized = phone.replace(/\D/g, '');
    if (sanitized.length !== 10) {
      return NextResponse.json(
        { error: 'Phone must be a 10-digit number', code: 'INVALID_PHONE' },
        { status: 400 }
      );
    }

    // Query user by sanitized phone number
    const user = await db
      .select()
      .from(users)
      .where(eq(users.phone, sanitized));

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(user[0], { status: 200 });
  } catch (error) {
    console.error('GET user by phone error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

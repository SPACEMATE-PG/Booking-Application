import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceRequests } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);

    // Validate userId parameter
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        {
          error: 'Valid user ID is required',
          code: 'INVALID_USER_ID',
        },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(userId);
    const statusFilter = searchParams.get('status');

    // Build query with userId filter
    let query = db
      .select()
      .from(maintenanceRequests)
      .where(eq(maintenanceRequests.userId, userIdInt))
      .orderBy(desc(maintenanceRequests.createdAt));

    // Apply status filter if provided
    if (statusFilter) {
      query = db
        .select()
        .from(maintenanceRequests)
        .where(
          and(
            eq(maintenanceRequests.userId, userIdInt),
            eq(maintenanceRequests.status, statusFilter)
          )
        )
        .orderBy(desc(maintenanceRequests.createdAt));
    }

    const requests = await query;

    return NextResponse.json(requests, { status: 200 });
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
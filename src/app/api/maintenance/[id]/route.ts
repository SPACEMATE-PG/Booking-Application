import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { maintenanceRequests } from '@/db/schema';
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
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const maintenanceRequestId = parseInt(id);

    // Check if maintenance request exists
    const existingRequest = await db
      .select()
      .from(maintenanceRequests)
      .where(eq(maintenanceRequests.id, maintenanceRequestId))
      .limit(1);

    if (existingRequest.length === 0) {
      return NextResponse.json(
        {
          error: 'Maintenance request not found',
          code: 'MAINTENANCE_REQUEST_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status, resolvedAt } = body;

    // Build update object
    const updates: {
      status?: string;
      resolvedAt?: Date;
    } = {};

    // Handle status update
    if (status !== undefined) {
      // Validate status value
      const validStatuses = ['Pending', 'InProgress', 'Resolved'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            error: 'Invalid status. Must be one of: Pending, InProgress, Resolved',
            code: 'INVALID_STATUS'
          },
          { status: 400 }
        );
      }

      updates.status = status;

      // Auto-set resolvedAt if status is changed to "Resolved" and resolvedAt is not provided
      if (status === 'Resolved' && !resolvedAt) {
        updates.resolvedAt = new Date();
      }
    }

    // Handle explicit resolvedAt update
    if (resolvedAt !== undefined) {
      updates.resolvedAt = new Date(resolvedAt);
    }

    // Update the maintenance request
    const updated = await db
      .update(maintenanceRequests)
      .set(updates)
      .where(eq(maintenanceRequests.id, maintenanceRequestId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to update maintenance request',
          code: 'UPDATE_FAILED'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT maintenance request error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
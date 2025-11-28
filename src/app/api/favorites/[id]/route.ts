import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { favorites } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const favoriteId = parseInt(id);

    const existingFavorite = await db
      .select()
      .from(favorites)
      .where(eq(favorites.id, favoriteId))
      .limit(1);

    if (existingFavorite.length === 0) {
      return NextResponse.json(
        { error: 'Favorite not found', code: 'FAVORITE_NOT_FOUND' },
        { status: 404 }
      );
    }

    await db
      .delete(favorites)
      .where(eq(favorites.id, favoriteId));

    return NextResponse.json(
      {
        message: 'Favorite removed successfully',
        deletedId: favoriteId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
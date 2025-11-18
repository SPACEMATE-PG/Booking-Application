import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { wallet } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

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

    const userWallet = await db
      .select()
      .from(wallet)
      .where(eq(wallet.userId, userIdInt))
      .limit(1);

    if (userWallet.length === 0) {
      return NextResponse.json(
        {
          error: 'Wallet not found for this user',
          code: 'WALLET_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(userWallet[0], { status: 200 });
  } catch (error) {
    console.error('GET wallet error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Validate userId
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

    // Get request body
    const body = await request.json();
    const { balance, amount, operation } = body;

    // Validate request body - must have either balance or (amount + operation)
    if (balance === undefined && (amount === undefined || operation === undefined)) {
      return NextResponse.json(
        {
          error: 'Either balance or (amount and operation) must be provided',
          code: 'INVALID_REQUEST_BODY',
        },
        { status: 400 }
      );
    }

    // Validate balance if provided
    if (balance !== undefined) {
      if (typeof balance !== 'number' || balance < 0) {
        return NextResponse.json(
          {
            error: 'Balance must be a non-negative number',
            code: 'INVALID_BALANCE',
          },
          { status: 400 }
        );
      }
    }

    // Validate amount if provided
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount < 0) {
        return NextResponse.json(
          {
            error: 'Amount must be a non-negative number',
            code: 'INVALID_AMOUNT',
          },
          { status: 400 }
        );
      }
    }

    // Validate operation if provided
    if (operation !== undefined && operation !== 'add' && operation !== 'subtract') {
      return NextResponse.json(
        {
          error: 'Operation must be either "add" or "subtract"',
          code: 'INVALID_OPERATION',
        },
        { status: 400 }
      );
    }

    // Check if wallet exists for user
    const existingWallet = await db
      .select()
      .from(wallet)
      .where(eq(wallet.userId, userIdInt))
      .limit(1);

    if (existingWallet.length === 0) {
      return NextResponse.json(
        {
          error: 'Wallet not found for this user',
          code: 'WALLET_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    let newBalance: number;

    // Calculate new balance
    if (balance !== undefined) {
      // Direct balance update
      newBalance = balance;
    } else {
      // Operation-based update
      const currentBalance = existingWallet[0].balance || 0;

      if (operation === 'add') {
        newBalance = currentBalance + amount;
      } else {
        // subtract
        newBalance = currentBalance - amount;

        // Ensure balance doesn't go negative
        if (newBalance < 0) {
          return NextResponse.json(
            {
              error: 'Insufficient balance. Operation would result in negative balance',
              code: 'INSUFFICIENT_BALANCE',
            },
            { status: 400 }
          );
        }
      }
    }

    // Update wallet
    const updatedWallet = await db
      .update(wallet)
      .set({
        balance: newBalance,
        updatedAt: new Date(),
      })
      .where(eq(wallet.userId, userIdInt))
      .returning();

    return NextResponse.json(updatedWallet[0], { status: 200 });
  } catch (error) {
    console.error('PUT wallet error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}
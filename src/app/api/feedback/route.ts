import { NextResponse } from 'next/server';
import { db } from '@/db';
import { feedback } from '@/db/schema';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message, rating, userId } = body;

        if (!name || !email || !message || !rating) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        const [newFeedback] = await db
            .insert(feedback)
            .values({
                userId: userId ? parseInt(userId) : null,
                name,
                email,
                message,
                rating: ratingNum,
                createdAt: new Date() as Date,
            })
            .returning();

        return NextResponse.json(newFeedback, { status: 201 });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { db } from '@/db';
import { propertyVisits } from '@/db/schema';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { propertyId, userId, date, timeSlot } = body;

        if (!propertyId || !userId || !date || !timeSlot) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const [newVisit] = await db
            .insert(propertyVisits)
            .values({
                propertyId: parseInt(propertyId),
                userId: parseInt(userId),
                date: date,
                timeSlot: timeSlot,
            })
            .returning();

        return NextResponse.json(newVisit, { status: 201 });
    } catch (error) {
        console.error('Error scheduling visit:', error);
        return NextResponse.json(
            { error: 'Failed to schedule visit' },
            { status: 500 }
        );
    }
}

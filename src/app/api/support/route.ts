import { NextResponse } from 'next/server';
import { db } from '@/db';
import { helpSupportRequests } from '@/db/schema';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message, userId } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const [newRequest] = await db
            .insert(helpSupportRequests)
            .values({
                userId: userId ? parseInt(userId) : null,
                name,
                email,
                phone: phone || null,
                subject,
                message,
            })
            .returning();

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.error('Error creating support request:', error);
        return NextResponse.json(
            { error: 'Failed to submit support request' },
            { status: 500 }
        );
    }
}

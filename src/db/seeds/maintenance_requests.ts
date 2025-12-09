import { db } from '@/db';
import { maintenanceRequests } from '@/db/schema';

async function main() {
    const now = new Date();

    const sampleMaintenanceRequests = [
        // PENDING REQUESTS (6) - Last 1-7 days
        {
            userId: 3,
            bookingId: 2,
            title: 'AC not working in room',
            description: 'The AC in my room stopped cooling since yesterday evening. It\'s making a strange noise but no cold air is coming out. Please send someone to check as soon as possible.',
            status: 'Pending',
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },
        {
            userId: 7,
            bookingId: 5,
            title: 'Water leakage in bathroom',
            description: 'There\'s water leaking from the bathroom ceiling near the shower area. It\'s getting worse and creating a pool on the floor. This needs urgent attention.',
            status: 'Pending',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },
        {
            userId: 12,
            bookingId: 7,
            title: 'WiFi connectivity issues',
            description: 'The WiFi connection keeps dropping every few minutes. I\'ve tried restarting the router but the problem persists. I need stable internet for my work from home.',
            status: 'Pending',
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },
        {
            userId: 5,
            bookingId: 3,
            title: 'Electrical socket not working',
            description: 'The power socket near my study table is not working. I\'ve tried different devices but nothing works. Need this fixed to charge my laptop and phone.',
            status: 'Pending',
            createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },
        {
            userId: 9,
            bookingId: 6,
            title: 'Door lock problem',
            description: 'The room door lock is jamming and it\'s difficult to open and close. Sometimes I get locked inside. This is a safety concern and needs immediate attention.',
            status: 'Pending',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },
        {
            userId: 14,
            bookingId: 8,
            title: 'Window glass cracked',
            description: 'The window glass in my room has developed a crack. I\'m worried it might break completely. Also, there\'s a draft coming through the crack.',
            status: 'Pending',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },

        // IN PROGRESS REQUESTS (5) - Last 3-10 days
        {
            userId: 2,
            bookingId: 1,
            title: 'Broken bed frame',
            description: 'The bed frame is broken on one side and making creaking sounds. It\'s uncomfortable to sleep and I\'m worried it might collapse completely.',
            status: 'InProgress',
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },
        {
            userId: 6,
            bookingId: 4,
            title: 'Fan making loud noise',
            description: 'The ceiling fan is making a very loud rattling noise when running at high speed. It seems like something is loose. Can someone check and fix it?',
            status: 'InProgress',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },
        {
            userId: 10,
            bookingId: 6,
            title: 'Bathroom tap leaking',
            description: 'The bathroom sink tap is constantly dripping water. It\'s wasting water and the sound is disturbing at night. Please fix or replace the tap.',
            status: 'InProgress',
            createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },
        {
            userId: 11,
            bookingId: 7,
            title: 'Geyser not heating water',
            description: 'The water heater is not working properly. The water comes out cold even after waiting for 30 minutes. Need hot water for bathing.',
            status: 'InProgress',
            createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },
        {
            userId: 13,
            bookingId: 8,
            title: 'Wardrobe door broken',
            description: 'The wardrobe door has come off its hinges and won\'t close properly. My clothes are getting dusty and it looks messy.',
            status: 'InProgress',
            createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
            resolvedAt: null,
        },

        // RESOLVED REQUESTS (4) - Last 2-4 weeks
        {
            userId: 4,
            bookingId: 2,
            title: 'Light bulb replacement needed',
            description: 'The main light bulb in my room has stopped working. The room is too dark in the evenings. Please replace with a new bulb.',
            status: 'Resolved',
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
            resolvedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        },
        {
            userId: 8,
            bookingId: 5,
            title: 'Dustbin missing in room',
            description: 'There is no dustbin in my room. I need one for daily waste disposal. Please provide a dustbin.',
            status: 'Resolved',
            createdAt: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
            resolvedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        },
        {
            userId: 1,
            bookingId: 1,
            title: 'Mattress too hard and uncomfortable',
            description: 'The mattress provided is extremely hard and uncomfortable. I\'m having trouble sleeping and waking up with back pain. Need a softer mattress.',
            status: 'Resolved',
            createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
            resolvedAt: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000),
        },
        {
            userId: 15,
            bookingId: 8,
            title: 'Room door squeaking loudly',
            description: 'The room door makes a very loud squeaking sound when opening and closing. It disturbs other residents, especially at night. Please oil the hinges.',
            status: 'Resolved',
            createdAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
            resolvedAt: new Date(now.getTime() - 26 * 24 * 60 * 60 * 1000),
        },
    ];

    await db.insert(maintenanceRequests).values(sampleMaintenanceRequests);

    console.log('✅ Maintenance requests seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
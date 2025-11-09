import { db } from '@/db';
import { favorites } from '@/db/schema';

async function main() {
    const sampleFavorites = [
        // User 1 - 3 favorites
        {
            userId: 1,
            propertyId: 5,
            createdAt: new Date('2024-11-15').toISOString(),
        },
        {
            userId: 1,
            propertyId: 12,
            createdAt: new Date('2024-11-20').toISOString(),
        },
        {
            userId: 1,
            propertyId: 18,
            createdAt: new Date('2024-12-01').toISOString(),
        },
        // User 2 - 2 favorites
        {
            userId: 2,
            propertyId: 3,
            createdAt: new Date('2024-11-10').toISOString(),
        },
        {
            userId: 2,
            propertyId: 22,
            createdAt: new Date('2024-12-05').toISOString(),
        },
        // User 3 - 1 favorite
        {
            userId: 3,
            propertyId: 8,
            createdAt: new Date('2024-11-25').toISOString(),
        },
        // User 4 - 3 favorites
        {
            userId: 4,
            propertyId: 2,
            createdAt: new Date('2024-10-28').toISOString(),
        },
        {
            userId: 4,
            propertyId: 14,
            createdAt: new Date('2024-11-18').toISOString(),
        },
        {
            userId: 4,
            propertyId: 23,
            createdAt: new Date('2024-12-03').toISOString(),
        },
        // User 5 - 2 favorites
        {
            userId: 5,
            propertyId: 7,
            createdAt: new Date('2024-11-05').toISOString(),
        },
        {
            userId: 5,
            propertyId: 19,
            createdAt: new Date('2024-11-22').toISOString(),
        },
        // User 6 - 1 favorite
        {
            userId: 6,
            propertyId: 15,
            createdAt: new Date('2024-12-08').toISOString(),
        },
        // User 7 - 2 favorites
        {
            userId: 7,
            propertyId: 4,
            createdAt: new Date('2024-10-30').toISOString(),
        },
        {
            userId: 7,
            propertyId: 25,
            createdAt: new Date('2024-11-28').toISOString(),
        },
        // User 8 - 3 favorites
        {
            userId: 8,
            propertyId: 1,
            createdAt: new Date('2024-11-12').toISOString(),
        },
        {
            userId: 8,
            propertyId: 11,
            createdAt: new Date('2024-11-26').toISOString(),
        },
        {
            userId: 8,
            propertyId: 20,
            createdAt: new Date('2024-12-06').toISOString(),
        },
        // User 9 - 1 favorite
        {
            userId: 9,
            propertyId: 16,
            createdAt: new Date('2024-11-08').toISOString(),
        },
        // User 10 - 2 favorites
        {
            userId: 10,
            propertyId: 6,
            createdAt: new Date('2024-11-14').toISOString(),
        },
        {
            userId: 10,
            propertyId: 21,
            createdAt: new Date('2024-12-02').toISOString(),
        },
        // User 11 - 1 favorite
        {
            userId: 11,
            propertyId: 9,
            createdAt: new Date('2024-11-30').toISOString(),
        },
        // User 12 - 2 favorites
        {
            userId: 12,
            propertyId: 10,
            createdAt: new Date('2024-11-07').toISOString(),
        },
        {
            userId: 12,
            propertyId: 24,
            createdAt: new Date('2024-12-04').toISOString(),
        },
        // User 13 - 1 favorite
        {
            userId: 13,
            propertyId: 13,
            createdAt: new Date('2024-11-19').toISOString(),
        },
        // User 14 - 1 favorite
        {
            userId: 14,
            propertyId: 17,
            createdAt: new Date('2024-12-07').toISOString(),
        },
    ];

    await db.insert(favorites).values(sampleFavorites);
    
    console.log('✅ Favorites seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
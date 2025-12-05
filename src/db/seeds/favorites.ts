import { db } from '@/db';
import { favorites } from '@/db/schema';

async function main() {
    const sampleFavorites = [
        // User 1 - 3 favorites
        {
            userId: 1,
            propertyId: 5,
            createdAt: new Date('2024-11-15'),
        },
        {
            userId: 1,
            propertyId: 12,
            createdAt: new Date('2024-11-20'),
        },
        {
            userId: 1,
            propertyId: 18,
            createdAt: new Date('2024-12-01'),
        },
        // User 2 - 2 favorites
        {
            userId: 2,
            propertyId: 3,
            createdAt: new Date('2024-11-10'),
        },
        {
            userId: 2,
            propertyId: 22,
            createdAt: new Date('2024-12-05'),
        },
        // User 3 - 1 favorite
        {
            userId: 3,
            propertyId: 8,
            createdAt: new Date('2024-11-25'),
        },
        // User 4 - 3 favorites
        {
            userId: 4,
            propertyId: 2,
            createdAt: new Date('2024-10-28'),
        },
        {
            userId: 4,
            propertyId: 14,
            createdAt: new Date('2024-11-18'),
        },
        {
            userId: 4,
            propertyId: 23,
            createdAt: new Date('2024-12-03'),
        },
        // User 5 - 2 favorites
        {
            userId: 5,
            propertyId: 7,
            createdAt: new Date('2024-11-05'),
        },
        {
            userId: 5,
            propertyId: 19,
            createdAt: new Date('2024-11-22'),
        },
        // User 6 - 1 favorite
        {
            userId: 6,
            propertyId: 15,
            createdAt: new Date('2024-12-08'),
        },
        // User 7 - 2 favorites
        {
            userId: 7,
            propertyId: 4,
            createdAt: new Date('2024-10-30'),
        },
        {
            userId: 7,
            propertyId: 25,
            createdAt: new Date('2024-11-28'),
        },
        // User 8 - 3 favorites
        {
            userId: 8,
            propertyId: 1,
            createdAt: new Date('2024-11-12'),
        },
        {
            userId: 8,
            propertyId: 11,
            createdAt: new Date('2024-11-26'),
        },
        {
            userId: 8,
            propertyId: 20,
            createdAt: new Date('2024-12-06'),
        },
        // User 9 - 1 favorite
        {
            userId: 9,
            propertyId: 16,
            createdAt: new Date('2024-11-08'),
        },
        // User 10 - 2 favorites
        {
            userId: 10,
            propertyId: 6,
            createdAt: new Date('2024-11-14'),
        },
        {
            userId: 10,
            propertyId: 21,
            createdAt: new Date('2024-12-02'),
        },
        // User 11 - 1 favorite
        {
            userId: 11,
            propertyId: 9,
            createdAt: new Date('2024-11-30'),
        },
        // User 12 - 2 favorites
        {
            userId: 12,
            propertyId: 10,
            createdAt: new Date('2024-11-07'),
        },
        {
            userId: 12,
            propertyId: 24,
            createdAt: new Date('2024-12-04'),
        },
        // User 13 - 1 favorite
        {
            userId: 13,
            propertyId: 13,
            createdAt: new Date('2024-11-19'),
        },
        // User 14 - 1 favorite
        {
            userId: 14,
            propertyId: 17,
            createdAt: new Date('2024-12-07'),
        },
    ];

    await db.insert(favorites).values(sampleFavorites);

    console.log('✅ Favorites seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
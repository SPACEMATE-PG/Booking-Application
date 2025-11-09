import { db } from '@/db';
import { wallet } from '@/db/schema';

async function main() {
    const sampleWallets = [
        // 5 users with ₹0 balance (new users)
        {
            userId: 1,
            balance: 0,
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            userId: 2,
            balance: 0,
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            userId: 3,
            balance: 0,
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            userId: 4,
            balance: 0,
            updatedAt: new Date('2024-01-22').toISOString(),
        },
        {
            userId: 5,
            balance: 0,
            updatedAt: new Date('2024-01-25').toISOString(),
        },
        // 5 users with ₹500-₹2,000 balance (moderate usage)
        {
            userId: 6,
            balance: 500,
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            userId: 7,
            balance: 850,
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            userId: 8,
            balance: 1200,
            updatedAt: new Date('2024-01-14').toISOString(),
        },
        {
            userId: 9,
            balance: 1650,
            updatedAt: new Date('2024-01-16').toISOString(),
        },
        {
            userId: 10,
            balance: 2000,
            updatedAt: new Date('2024-01-19').toISOString(),
        },
        // 5 users with ₹2,500-₹5,000 balance (frequent users)
        {
            userId: 11,
            balance: 2500,
            updatedAt: new Date('2024-01-08').toISOString(),
        },
        {
            userId: 12,
            balance: 3200,
            updatedAt: new Date('2024-01-09').toISOString(),
        },
        {
            userId: 13,
            balance: 3750,
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            userId: 14,
            balance: 4300,
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        {
            userId: 15,
            balance: 5000,
            updatedAt: new Date('2024-01-17').toISOString(),
        },
    ];

    await db.insert(wallet).values(sampleWallets);
    
    console.log('✅ Wallet seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
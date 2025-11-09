import { db } from '@/db';
import { roomTypes } from '@/db/schema';

async function main() {
    const currentDate = new Date().toISOString();
    
    const sampleRoomTypes = [
        // Mumbai Properties (1-6) - Higher prices (+20%)
        // Property 1
        { propertyId: 1, type: 'Single Occupancy', pricePerMonth: 14400, availableRooms: 0, totalRooms: 10, createdAt: currentDate },
        { propertyId: 1, type: 'Double Occupancy', pricePerMonth: 9600, availableRooms: 5, totalRooms: 15, createdAt: currentDate },
        { propertyId: 1, type: 'Triple Occupancy', pricePerMonth: 7200, availableRooms: 3, totalRooms: 8, createdAt: currentDate },
        { propertyId: 1, type: 'Deluxe Room', pricePerMonth: 24000, availableRooms: 1, totalRooms: 5, createdAt: currentDate },
        
        // Property 2
        { propertyId: 2, type: 'Single Occupancy', pricePerMonth: 13200, availableRooms: 3, totalRooms: 10, createdAt: currentDate },
        { propertyId: 2, type: 'Double Occupancy', pricePerMonth: 8400, availableRooms: 1, totalRooms: 15, createdAt: currentDate },
        { propertyId: 2, type: 'Triple Occupancy', pricePerMonth: 6000, availableRooms: 0, totalRooms: 8, createdAt: currentDate },
        { propertyId: 2, type: 'Deluxe Room', pricePerMonth: 21600, availableRooms: 2, totalRooms: 5, createdAt: currentDate },
        
        // Property 3
        { propertyId: 3, type: 'Single Occupancy', pricePerMonth: 12000, availableRooms: 4, totalRooms: 10, createdAt: currentDate },
        { propertyId: 3, type: 'Double Occupancy', pricePerMonth: 7200, availableRooms: 8, totalRooms: 15, createdAt: currentDate },
        { propertyId: 3, type: 'Triple Occupancy', pricePerMonth: 5400, availableRooms: 2, totalRooms: 8, createdAt: currentDate },
        { propertyId: 3, type: 'Deluxe Room', pricePerMonth: 19200, availableRooms: 0, totalRooms: 5, createdAt: currentDate },
        
        // Property 4
        { propertyId: 4, type: 'Single Occupancy', pricePerMonth: 10800, availableRooms: 2, totalRooms: 10, createdAt: currentDate },
        { propertyId: 4, type: 'Double Occupancy', pricePerMonth: 8400, availableRooms: 6, totalRooms: 15, createdAt: currentDate },
        { propertyId: 4, type: 'Triple Occupancy', pricePerMonth: 6600, availableRooms: 1, totalRooms: 8, createdAt: currentDate },
        { propertyId: 4, type: 'Deluxe Room', pricePerMonth: 18000, availableRooms: 1, totalRooms: 5, createdAt: currentDate },
        
        // Property 5
        { propertyId: 5, type: 'Single Occupancy', pricePerMonth: 13800, availableRooms: 5, totalRooms: 10, createdAt: currentDate },
        { propertyId: 5, type: 'Double Occupancy', pricePerMonth: 9000, availableRooms: 0, totalRooms: 15, createdAt: currentDate },
        { propertyId: 5, type: 'Triple Occupancy', pricePerMonth: 7200, availableRooms: 4, totalRooms: 8, createdAt: currentDate },
        { propertyId: 5, type: 'Deluxe Room', pricePerMonth: 22800, availableRooms: 2, totalRooms: 5, createdAt: currentDate },
        
        // Property 6
        { propertyId: 6, type: 'Single Occupancy', pricePerMonth: 11400, availableRooms: 0, totalRooms: 10, createdAt: currentDate },
        { propertyId: 6, type: 'Double Occupancy', pricePerMonth: 7800, availableRooms: 3, totalRooms: 15, createdAt: currentDate },
        { propertyId: 6, type: 'Triple Occupancy', pricePerMonth: 5400, availableRooms: 1, totalRooms: 8, createdAt: currentDate },
        { propertyId: 6, type: 'Deluxe Room', pricePerMonth: 20400, availableRooms: 0, totalRooms: 5, createdAt: currentDate },
        
        // Delhi Properties (7-11) - Medium-high prices (+10%)
        // Property 7
        { propertyId: 7, type: 'Single Occupancy', pricePerMonth: 13200, availableRooms: 4, totalRooms: 10, createdAt: currentDate },
        { propertyId: 7, type: 'Double Occupancy', pricePerMonth: 8800, availableRooms: 7, totalRooms: 15, createdAt: currentDate },
        { propertyId: 7, type: 'Triple Occupancy', pricePerMonth: 6600, availableRooms: 2, totalRooms: 8, createdAt: currentDate },
        { propertyId: 7, type: 'Deluxe Room', pricePerMonth: 22000, availableRooms: 1, totalRooms: 5, createdAt: currentDate },
        
        // Property 8
        { propertyId: 8, type: 'Single Occupancy', pricePerMonth: 11000, availableRooms: 0, totalRooms: 10, createdAt: currentDate },
        { propertyId: 8, type: 'Double Occupancy', pricePerMonth: 7700, availableRooms: 4, totalRooms: 15, createdAt: currentDate },
        { propertyId: 8, type: 'Triple Occupancy', pricePerMonth: 5500, availableRooms: 3, totalRooms: 8, createdAt: currentDate },
        { propertyId: 8, type: 'Deluxe Room', pricePerMonth: 18700, availableRooms: 2, totalRooms: 5, createdAt: currentDate },
        
        // Property 9
        { propertyId: 9, type: 'Single Occupancy', pricePerMonth: 12100, availableRooms: 3, totalRooms: 10, createdAt: currentDate },
        { propertyId: 9, type: 'Double Occupancy', pricePerMonth: 8250, availableRooms: 1, totalRooms: 15, createdAt: currentDate },
        { propertyId: 9, type: 'Triple Occupancy', pricePerMonth: 6050, availableRooms: 0, totalRooms: 8, createdAt: currentDate },
        { propertyId: 9, type: 'Deluxe Room', pricePerMonth: 19800, availableRooms: 0, totalRooms: 5, createdAt: currentDate },
        
        // Property 10
        { propertyId: 10, type: 'Single Occupancy', pricePerMonth: 10450, availableRooms: 5, totalRooms: 10, createdAt: currentDate },
        { propertyId: 10, type: 'Double Occupancy', pricePerMonth: 7150, availableRooms: 6, totalRooms: 15, createdAt: currentDate },
        { propertyId: 10, type: 'Triple Occupancy', pricePerMonth: 4950, availableRooms: 4, totalRooms: 8, createdAt: currentDate },
        { propertyId: 10, type: 'Deluxe Room', pricePerMonth: 17600, availableRooms: 1, totalRooms: 5, createdAt: currentDate },
        
        // Property 11
        { propertyId: 11, type: 'Single Occupancy', pricePerMonth: 11550, availableRooms: 2, totalRooms: 10, createdAt: currentDate },
        { propertyId: 11, type: 'Double Occupancy', pricePerMonth: 7700, availableRooms: 0, totalRooms: 15, createdAt: currentDate },
        { propertyId: 11, type: 'Triple Occupancy', pricePerMonth: 5500, availableRooms: 1, totalRooms: 8, createdAt: currentDate },
        { propertyId: 11, type: 'Deluxe Room', pricePerMonth: 20900, availableRooms: 2, totalRooms: 5, createdAt: currentDate },
        
        // Bangalore Properties (12-17) - Medium-high prices (+10%)
        // Property 12
        { propertyId: 12, type: 'Single Occupancy', pricePerMonth: 12650, availableRooms: 4, totalRooms: 10, createdAt: currentDate },
        { propertyId: 12, type: 'Double Occupancy', pricePerMonth: 8250, availableRooms: 5, totalRooms: 15, createdAt: currentDate },
        { propertyId: 12, type: 'Triple Occupancy', pricePerMonth: 6050, availableRooms: 0, totalRooms: 8, createdAt: currentDate },
        { propertyId: 12, type: 'Deluxe Room', pricePerMonth: 19250, availableRooms: 1, totalRooms: 5, createdAt: currentDate },
        
        // Property 13
        { propertyId: 13, type: 'Single Occupancy', pricePerMonth: 10450, availableRooms: 0, totalRooms: 10, createdAt: currentDate },
        { propertyId: 13, type: 'Double Occupancy', pricePerMonth: 7150, availableRooms: 8, totalRooms: 15, createdAt: currentDate },
        { propertyId: 13, type: 'Triple Occupancy', pricePerMonth: 4950, availableRooms: 3, totalRooms: 8, createdAt: currentDate },
        { propertyId: 13, type: 'Deluxe Room', pricePerMonth: 17050, availableRooms: 0, totalRooms: 5, createdAt: currentDate },
        
        // Property 14
        { propertyId: 14, type: 'Single Occupancy', pricePerMonth: 11000, availableRooms: 3, totalRooms: 10, createdAt: currentDate },
        { propertyId: 14, type: 'Double Occupancy', pricePerMonth: 7700, availableRooms: 1, totalRooms: 15, createdAt: currentDate },
        { propertyId: 14, type: 'Triple Occupancy', pricePerMonth: 5500, availableRooms: 2, totalRooms: 8, createdAt: currentDate },
        { propertyId: 14, type: 'Deluxe Room', pricePerMonth: 18150, availableRooms: 2, totalRooms: 5, createdAt: currentDate },
        
        // Property 15
        { propertyId: 15, type: 'Single Occupancy', pricePerMonth: 13200, availableRooms: 5, totalRooms: 10, createdAt: currentDate },
        { propertyId: 15, type: 'Double Occupancy', pricePerMonth: 8800, availableRooms: 6, totalRooms: 15, createdAt: currentDate },
        { propertyId: 15, type: 'Triple Occupancy', pricePerMonth: 6600, availableRooms: 1, totalRooms: 8, createdAt: currentDate },
        { propertyId: 15, type: 'Deluxe Room', pricePerMonth: 21450, availableRooms: 0, totalRooms: 5, createdAt: currentDate },
        
        // Property 16
        { propertyId: 16, type: 'Single Occupancy', pricePerMonth: 9900, availableRooms: 2, totalRooms: 10, createdAt: currentDate },
        { propertyId: 16, type: 'Double Occupancy', pricePerMonth: 6600, availableRooms: 4, totalRooms: 15, createdAt: currentDate },
        { propertyId: 16, type: 'Triple Occupancy', pricePerMonth: 4400, availableRooms: 0, totalRooms: 8, createdAt: currentDate },
        { propertyId: 16, type: 'Deluxe Room', pricePerMonth: 16500, availableRooms: 1, totalRooms: 5, createdAt: currentDate },
        
        // Property 17
        { propertyId: 17, type: 'Single Occupancy', pricePerMonth: 11550, availableRooms: 4, totalRooms: 10, createdAt: currentDate },
        { propertyId: 17, type: 'Double Occupancy', pricePerMonth: 7700, availableRooms: 7, totalRooms: 15, createdAt: currentDate },
        { propertyId: 17, type: 'Triple Occupancy', pricePerMonth: 5500, availableRooms: 3, totalRooms: 8, createdAt: currentDate },
        { propertyId: 17, type: 'Deluxe Room', pricePerMonth: 19800, availableRooms: 2, totalRooms: 5, createdAt: currentDate },
        
        // Pune Properties (18-21) - Base prices
        // Property 18
        { propertyId: 18, type: 'Single Occupancy', pricePerMonth: 11500, availableRooms: 3, totalRooms: 10, createdAt: currentDate },
        { propertyId: 18, type: 'Double Occupancy', pricePerMonth: 7500, availableRooms: 0, totalRooms: 15, createdAt: currentDate },
        { propertyId: 18, type: 'Triple Occupancy', pricePerMonth: 5500, availableRooms: 4, totalRooms: 8, createdAt: currentDate },
        { propertyId: 18, type: 'Deluxe Room', pricePerMonth: 17500, availableRooms: 1, totalRooms: 5, createdAt: currentDate },
        
        // Property 19
        { propertyId: 19, type: 'Single Occupancy', pricePerMonth: 9500, availableRooms: 5, totalRooms: 10, createdAt: currentDate },
        { propertyId: 19, type: 'Double Occupancy', pricePerMonth: 6500, availableRooms: 8, totalRooms: 15, createdAt: currentDate },
        { propertyId: 19, type: 'Triple Occupancy', pricePerMonth: 4500, availableRooms: 2, totalRooms: 8, createdAt: currentDate },
        { propertyId: 19, type: 'Deluxe Room', pricePerMonth: 16000, availableRooms: 0, totalRooms: 5, createdAt: currentDate },
        
        // Property 20
        { propertyId: 20, type: 'Single Occupancy', pricePerMonth: 10000, availableRooms: 0, totalRooms: 10, createdAt: currentDate },
        { propertyId: 20, type: 'Double Occupancy', pricePerMonth: 7000, availableRooms: 1, totalRooms: 15, createdAt: currentDate },
        { propertyId: 20, type: 'Triple Occupancy', pricePerMonth: 5000, availableRooms: 3, totalRooms: 8, createdAt: currentDate },
        { propertyId: 20, type: 'Deluxe Room', pricePerMonth: 18000, availableRooms: 2, totalRooms: 5, createdAt: currentDate },
        
        // Property 21
        { propertyId: 21, type: 'Single Occupancy', pricePerMonth: 12000, availableRooms: 4, totalRooms: 10, createdAt: currentDate },
        { propertyId: 21, type: 'Double Occupancy', pricePerMonth: 8000, availableRooms: 6, totalRooms: 15, createdAt: currentDate },
        { propertyId: 21, type: 'Triple Occupancy', pricePerMonth: 6000, availableRooms: 1, totalRooms: 8, createdAt: currentDate },
        { propertyId: 21, type: 'Deluxe Room', pricePerMonth: 19500, availableRooms: 1, totalRooms: 5, createdAt: currentDate },
        
        // Hyderabad Properties (22-25) - Base prices
        // Property 22
        { propertyId: 22, type: 'Single Occupancy', pricePerMonth: 10500, availableRooms: 2, totalRooms: 10, createdAt: currentDate },
        { propertyId: 22, type: 'Double Occupancy', pricePerMonth: 7000, availableRooms: 5, totalRooms: 15, createdAt: currentDate },
        { propertyId: 22, type: 'Triple Occupancy', pricePerMonth: 5000, availableRooms: 0, totalRooms: 8, createdAt: currentDate },
        { propertyId: 22, type: 'Deluxe Room', pricePerMonth: 17000, availableRooms: 0, totalRooms: 5, createdAt: currentDate },
        
        // Property 23
        { propertyId: 23, type: 'Single Occupancy', pricePerMonth: 9000, availableRooms: 4, totalRooms: 10, createdAt: currentDate },
        { propertyId: 23, type: 'Double Occupancy', pricePerMonth: 6000, availableRooms: 7, totalRooms: 15, createdAt: currentDate },
        { propertyId: 23, type: 'Triple Occupancy', pricePerMonth: 4000, availableRooms: 3, totalRooms: 8, createdAt: currentDate },
        { propertyId: 23, type: 'Deluxe Room', pricePerMonth: 15500, availableRooms: 1, totalRooms: 5, createdAt: currentDate },
        
        // Property 24
        { propertyId: 24, type: 'Single Occupancy', pricePerMonth: 11000, availableRooms: 3, totalRooms: 10, createdAt: currentDate },
        { propertyId: 24, type: 'Double Occupancy', pricePerMonth: 7500, availableRooms: 1, totalRooms: 15, createdAt: currentDate },
        { propertyId: 24, type: 'Triple Occupancy', pricePerMonth: 5500, availableRooms: 4, totalRooms: 8, createdAt: currentDate },
        { propertyId: 24, type: 'Deluxe Room', pricePerMonth: 18500, availableRooms: 2, totalRooms: 5, createdAt: currentDate },
        
        // Property 25
        { propertyId: 25, type: 'Single Occupancy', pricePerMonth: 8500, availableRooms: 5, totalRooms: 10, createdAt: currentDate },
        { propertyId: 25, type: 'Double Occupancy', pricePerMonth: 6500, availableRooms: 8, totalRooms: 15, createdAt: currentDate },
        { propertyId: 25, type: 'Triple Occupancy', pricePerMonth: 4500, availableRooms: 2, totalRooms: 8, createdAt: currentDate },
        { propertyId: 25, type: 'Deluxe Room', pricePerMonth: 16500, availableRooms: 0, totalRooms: 5, createdAt: currentDate },
    ];

    await db.insert(roomTypes).values(sampleRoomTypes);
    
    console.log('✅ Room types seeder completed successfully');
    console.log(`   Generated ${sampleRoomTypes.length} room types across 25 properties`);
    console.log(`   Fully booked rooms (availableRooms = 0): ${sampleRoomTypes.filter(r => r.availableRooms === 0).length}`);
    console.log(`   Low availability rooms (availableRooms ≤ 2): ${sampleRoomTypes.filter(r => r.availableRooms > 0 && r.availableRooms <= 2).length}`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
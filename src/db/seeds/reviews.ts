import { db } from '@/db';
import { reviews } from '@/db/schema';

async function main() {
    const sampleReviews = [
        // 5 star reviews (12 reviews - 40%)
        {
            userId: 1,
            propertyId: 3,
            bookingId: 1,
            rating: 5,
            comment: 'Excellent PG with all amenities. Very clean and well-maintained.',
            createdAt: new Date('2024-09-15').toISOString(),
        },
        {
            userId: 2,
            propertyId: 7,
            bookingId: 2,
            rating: 5,
            comment: 'Great location and friendly staff. Highly recommend!',
            createdAt: new Date('2024-08-20').toISOString(),
        },
        {
            userId: 4,
            propertyId: 12,
            bookingId: 4,
            rating: 5,
            comment: 'Best PG experience ever! The management is very responsive.',
            createdAt: new Date('2024-10-05').toISOString(),
        },
        {
            userId: 6,
            propertyId: 15,
            bookingId: 6,
            rating: 5,
            comment: 'Perfect place for students. Food quality is amazing!',
            createdAt: new Date('2024-09-28').toISOString(),
        },
        {
            userId: 8,
            propertyId: 21,
            bookingId: 8,
            rating: 5,
            comment: 'Outstanding service and excellent facilities. Worth every penny.',
            createdAt: new Date('2024-08-12').toISOString(),
        },
        {
            userId: 10,
            propertyId: 5,
            bookingId: 10,
            rating: 5,
            comment: 'Very spacious rooms and great WiFi speed. Loved the stay!',
            createdAt: new Date('2024-10-18').toISOString(),
        },
        {
            userId: 12,
            propertyId: 18,
            bookingId: 12,
            rating: 5,
            comment: 'Clean, safe, and well-maintained. Manager is very helpful.',
            createdAt: new Date('2024-09-03').toISOString(),
        },
        {
            userId: 14,
            propertyId: 24,
            bookingId: 14,
            rating: 5,
            comment: 'Best PG in the locality. All modern amenities available.',
            createdAt: new Date('2024-08-25').toISOString(),
        },
        {
            userId: 3,
            propertyId: 9,
            bookingId: 16,
            rating: 5,
            comment: 'Highly recommended! The staff is professional and caring.',
            createdAt: new Date('2024-10-12').toISOString(),
        },
        {
            userId: 7,
            propertyId: 14,
            bookingId: 18,
            rating: 5,
            comment: 'Excellent value for money. Very satisfied with the experience.',
            createdAt: new Date('2024-09-22').toISOString(),
        },
        {
            userId: 11,
            propertyId: 20,
            bookingId: 19,
            rating: 5,
            comment: 'Amazing property with great facilities. Food is delicious!',
            createdAt: new Date('2024-08-30').toISOString(),
        },
        {
            userId: 15,
            propertyId: 2,
            bookingId: 20,
            rating: 5,
            comment: 'Perfect location and excellent hospitality. Will definitely recommend.',
            createdAt: new Date('2024-10-08').toISOString(),
        },
        
        // 4 star reviews (10 reviews - 35%)
        {
            userId: 5,
            propertyId: 1,
            bookingId: 5,
            rating: 4,
            comment: 'Good place overall. Minor issues with WiFi speed.',
            createdAt: new Date('2024-09-10').toISOString(),
        },
        {
            userId: 9,
            propertyId: 8,
            bookingId: 9,
            rating: 4,
            comment: 'Nice property, could improve food quality.',
            createdAt: new Date('2024-08-18').toISOString(),
        },
        {
            userId: 13,
            propertyId: 11,
            bookingId: 13,
            rating: 4,
            comment: 'Comfortable stay, good value for money.',
            createdAt: new Date('2024-10-02').toISOString(),
        },
        {
            userId: 1,
            propertyId: 16,
            bookingId: 3,
            rating: 4,
            comment: 'Good location but rooms could be more spacious.',
            createdAt: new Date('2024-09-25').toISOString(),
        },
        {
            userId: 4,
            propertyId: 22,
            bookingId: 7,
            rating: 4,
            comment: 'Decent PG with good amenities. Parking is a bit limited.',
            createdAt: new Date('2024-08-08').toISOString(),
        },
        {
            userId: 8,
            propertyId: 6,
            bookingId: 11,
            rating: 4,
            comment: 'Nice place, but hot water availability is inconsistent.',
            createdAt: new Date('2024-10-15').toISOString(),
        },
        {
            userId: 12,
            propertyId: 19,
            bookingId: 15,
            rating: 4,
            comment: 'Good property overall. The laundry service could be better.',
            createdAt: new Date('2024-09-07').toISOString(),
        },
        {
            userId: 2,
            propertyId: 13,
            bookingId: 17,
            rating: 4,
            comment: 'Satisfied with the stay. The common area needs more seating.',
            createdAt: new Date('2024-08-22').toISOString(),
        },
        {
            userId: 6,
            propertyId: 23,
            bookingId: 1,
            rating: 4,
            comment: 'Good facilities and clean rooms. AC remote was a bit faulty.',
            createdAt: new Date('2024-10-20').toISOString(),
        },
        {
            userId: 10,
            propertyId: 4,
            bookingId: 2,
            rating: 4,
            comment: 'Nice PG with helpful staff. Food timing could be more flexible.',
            createdAt: new Date('2024-09-18').toISOString(),
        },
        
        // 3 star reviews (6 reviews - 20%)
        {
            userId: 3,
            propertyId: 10,
            bookingId: 4,
            rating: 3,
            comment: 'Average experience. Location is good but rooms need maintenance.',
            createdAt: new Date('2024-08-28').toISOString(),
        },
        {
            userId: 7,
            propertyId: 17,
            bookingId: 6,
            rating: 3,
            comment: 'Okay PG but a bit overpriced for the facilities offered.',
            createdAt: new Date('2024-10-10').toISOString(),
        },
        {
            userId: 11,
            propertyId: 25,
            bookingId: 8,
            rating: 3,
            comment: 'Average property. WiFi connectivity is poor in some rooms.',
            createdAt: new Date('2024-09-12').toISOString(),
        },
        {
            userId: 15,
            propertyId: 3,
            bookingId: 10,
            rating: 3,
            comment: 'Decent place but cleanliness could be better maintained.',
            createdAt: new Date('2024-08-15').toISOString(),
        },
        {
            userId: 5,
            propertyId: 7,
            bookingId: 12,
            rating: 3,
            comment: 'Okay stay. Food quality needs improvement and AC is noisy.',
            createdAt: new Date('2024-10-22').toISOString(),
        },
        {
            userId: 9,
            propertyId: 12,
            bookingId: 14,
            rating: 3,
            comment: 'Average experience. Manager is not very responsive to issues.',
            createdAt: new Date('2024-09-05').toISOString(),
        },
        
        // 2 star reviews (2 reviews - 5%)
        {
            userId: 13,
            propertyId: 15,
            bookingId: 16,
            rating: 2,
            comment: 'Not satisfied with cleanliness. AC does not work properly.',
            createdAt: new Date('2024-08-05').toISOString(),
        },
        {
            userId: 14,
            propertyId: 21,
            bookingId: 18,
            rating: 2,
            comment: 'Poor maintenance and rude manager. Not recommended.',
            createdAt: new Date('2024-10-25').toISOString(),
        },
    ];

    await db.insert(reviews).values(sampleReviews);
    
    console.log('✅ Reviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});
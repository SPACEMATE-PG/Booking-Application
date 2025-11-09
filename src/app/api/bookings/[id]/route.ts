import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, properties, roomTypes, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid booking ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const bookingId = parseInt(id);

    // Fetch booking with related details using joins
    const booking = await db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        propertyId: bookings.propertyId,
        roomTypeId: bookings.roomTypeId,
        moveInDate: bookings.moveInDate,
        durationMonths: bookings.durationMonths,
        totalAmount: bookings.totalAmount,
        bookingAmountPaid: bookings.bookingAmountPaid,
        status: bookings.status,
        paymentStatus: bookings.paymentStatus,
        nextRentDueDate: bookings.nextRentDueDate,
        bookingConfirmationUrl: bookings.bookingConfirmationUrl,
        cancellationDate: bookings.cancellationDate,
        refundStatus: bookings.refundStatus,
        refundAmount: bookings.refundAmount,
        createdAt: bookings.createdAt,
        user: {
          id: users.id,
          phone: users.phone,
          name: users.name,
          gender: users.gender,
          age: users.age,
          occupation: users.occupation,
          profilePhoto: users.profilePhoto,
        },
        property: {
          id: properties.id,
          name: properties.name,
          description: properties.description,
          address: properties.address,
          city: properties.city,
          locality: properties.locality,
          latitude: properties.latitude,
          longitude: properties.longitude,
          genderType: properties.genderType,
          thumbnailImage: properties.thumbnailImage,
          images: properties.images,
          startingPrice: properties.startingPrice,
          amenities: properties.amenities,
          virtualTourUrl: properties.virtualTourUrl,
          cancellationPolicy: properties.cancellationPolicy,
          refundPolicy: properties.refundPolicy,
          managerPhone: properties.managerPhone,
          managerName: properties.managerName,
          rating: properties.rating,
          totalReviews: properties.totalReviews,
          isAvailable: properties.isAvailable,
        },
        roomType: {
          id: roomTypes.id,
          propertyId: roomTypes.propertyId,
          type: roomTypes.type,
          pricePerMonth: roomTypes.pricePerMonth,
          availableRooms: roomTypes.availableRooms,
        },
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.userId, users.id))
      .leftJoin(properties, eq(bookings.propertyId, properties.id))
      .leftJoin(roomTypes, eq(bookings.roomTypeId, roomTypes.id))
      .where(eq(bookings.id, bookingId))
      .limit(1);

    // Check if booking exists
    if (booking.length === 0) {
      return NextResponse.json(
        { 
          error: 'Booking not found',
          code: 'BOOKING_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(booking[0], { status: 200 });
  } catch (error) {
    console.error('GET booking error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
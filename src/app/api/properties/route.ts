import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, roomTypes } from '@/db/schema';
import { eq, like, and, or, gte, lte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single property by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const property = await db
        .select()
        .from(properties)
        .where(eq(properties.id, parseInt(id)))
        .limit(1);

      if (property.length === 0) {
        return NextResponse.json(
          { error: 'Property not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(property[0], { status: 200 });
    }

    // List properties with filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const genderType = searchParams.get('gender_type');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const amenitiesParam = searchParams.get('amenities');
    const roomType = searchParams.get('room_type');
    const isAvailable = searchParams.get('is_available');

    const conditions = [];

    // Search filter (name, locality, city)
    if (search) {
      conditions.push(
        or(
          like(properties.name, `%${search}%`),
          like(properties.locality, `%${search}%`),
          like(properties.city, `%${search}%`)
        )
      );
    }

    // City filter
    if (city) {
      conditions.push(eq(properties.city, city));
    }

    // Locality filter
    if (locality) {
      conditions.push(eq(properties.locality, locality));
    }

    // Gender type filter
    if (genderType) {
      conditions.push(eq(properties.genderType, genderType));
    }

    // Price range filters
    if (minPrice) {
      const minPriceInt = parseInt(minPrice);
      if (!isNaN(minPriceInt)) {
        conditions.push(gte(properties.startingPrice, minPriceInt));
      }
    }

    if (maxPrice) {
      const maxPriceInt = parseInt(maxPrice);
      if (!isNaN(maxPriceInt)) {
        conditions.push(lte(properties.startingPrice, maxPriceInt));
      }
    }

    // Availability filter
    if (isAvailable !== null && isAvailable !== undefined) {
      const isAvailableBool = isAvailable === 'true';
      conditions.push(eq(properties.isAvailable, isAvailableBool));
    }

    let query = db.select().from(properties);

    // Apply non-amenity filters
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Fetch properties
    let results = await query.limit(limit).offset(offset);

    // Filter by amenities (post-query filtering for JSON array matching)
    if (amenitiesParam) {
      const requestedAmenities = amenitiesParam.split(',').map(a => a.trim());
      results = results.filter((property: any) => {
        const amenitiesArr: string[] = Array.isArray(property.amenities)
          ? property.amenities
          : [];
        return requestedAmenities.every((amenity) => amenitiesArr.includes(amenity));
      });
    }

    // Filter by room type (requires checking room_types table)
    if (roomType) {
      const propertyIdsWithRoomType = await db
        .select({ propertyId: roomTypes.propertyId })
        .from(roomTypes)
        .where(eq(roomTypes.type, roomType));

      const validPropertyIds = new Set(
        propertyIdsWithRoomType.map(rt => rt.propertyId)
      );

      results = results.filter(property =>
        validPropertyIds.has(property.id)
      );
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'name',
      'address',
      'city',
      'locality',
      'genderType',
      'startingPrice',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            error: `${field} is required`,
            code: 'MISSING_REQUIRED_FIELD',
          },
          { status: 400 }
        );
      }
    }

    // Validate genderType
    const validGenderTypes = ['Male', 'Female', 'Unisex'];
    if (!validGenderTypes.includes(body.genderType)) {
      return NextResponse.json(
        {
          error: 'genderType must be Male, Female, or Unisex',
          code: 'INVALID_GENDER_TYPE',
        },
        { status: 400 }
      );
    }

    // Validate startingPrice is a number
    if (isNaN(parseInt(body.startingPrice))) {
      return NextResponse.json(
        {
          error: 'startingPrice must be a valid number',
          code: 'INVALID_STARTING_PRICE',
        },
        { status: 400 }
      );
    }

    // Parse JSON fields if provided as strings
    let images = body.images;
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch (e) {
        return NextResponse.json(
          {
            error: 'images must be a valid JSON array',
            code: 'INVALID_IMAGES_FORMAT',
          },
          { status: 400 }
        );
      }
    }

    let amenities = body.amenities;
    if (typeof amenities === 'string') {
      try {
        amenities = JSON.parse(amenities);
      } catch (e) {
        return NextResponse.json(
          {
            error: 'amenities must be a valid JSON array',
            code: 'INVALID_AMENITIES_FORMAT',
          },
          { status: 400 }
        );
      }
    }

    // Validate amenities if provided
    if (amenities && Array.isArray(amenities)) {
      const validAmenities = [
        'AC',
        'WiFi',
        'Food',
        'Balcony',
        'Laundry',
        'Gym',
        'Parking',
      ];
      const invalidAmenities = amenities.filter(
        a => !validAmenities.includes(a)
      );
      if (invalidAmenities.length > 0) {
        return NextResponse.json(
          {
            error: `Invalid amenities: ${invalidAmenities.join(', ')}. Valid amenities are: ${validAmenities.join(', ')}`,
            code: 'INVALID_AMENITIES',
          },
          { status: 400 }
        );
      }
    }

    // Prepare insert data
    const insertData = {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      address: body.address.trim(),
      city: body.city.trim(),
      locality: body.locality.trim(),
      latitude: body.latitude ? parseFloat(body.latitude) : null,
      longitude: body.longitude ? parseFloat(body.longitude) : null,
      genderType: body.genderType,
      thumbnailImage: body.thumbnailImage?.trim() || null,
      images: images || null,
      startingPrice: parseInt(body.startingPrice),
      amenities: amenities || null,
      virtualTourUrl: body.virtualTourUrl?.trim() || null,
      cancellationPolicy: body.cancellationPolicy?.trim() || null,
      refundPolicy: body.refundPolicy?.trim() || null,
      managerPhone: body.managerPhone?.trim() || null,
      managerName: body.managerName?.trim() || null,
      rating: 0,
      totalReviews: 0,
      isAvailable: true,
      createdAt: new Date(),
    };

    const newProperty = await db
      .insert(properties)
      .values(insertData)
      .returning();

    return NextResponse.json(newProperty[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const propertyId = parseInt(id);

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate genderType if provided
    if (body.genderType) {
      const validGenderTypes = ['Male', 'Female', 'Unisex'];
      if (!validGenderTypes.includes(body.genderType)) {
        return NextResponse.json(
          {
            error: 'genderType must be Male, Female, or Unisex',
            code: 'INVALID_GENDER_TYPE',
          },
          { status: 400 }
        );
      }
    }

    // Validate startingPrice if provided
    if (body.startingPrice && isNaN(parseInt(body.startingPrice))) {
      return NextResponse.json(
        {
          error: 'startingPrice must be a valid number',
          code: 'INVALID_STARTING_PRICE',
        },
        { status: 400 }
      );
    }

    // Parse JSON fields if provided as strings
    let images = body.images;
    if (images && typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch (e) {
        return NextResponse.json(
          {
            error: 'images must be a valid JSON array',
            code: 'INVALID_IMAGES_FORMAT',
          },
          { status: 400 }
        );
      }
    }

    let amenities = body.amenities;
    if (amenities && typeof amenities === 'string') {
      try {
        amenities = JSON.parse(amenities);
      } catch (e) {
        return NextResponse.json(
          {
            error: 'amenities must be a valid JSON array',
            code: 'INVALID_AMENITIES_FORMAT',
          },
          { status: 400 }
        );
      }
    }

    // Validate amenities if provided
    if (amenities && Array.isArray(amenities)) {
      const validAmenities = [
        'AC',
        'WiFi',
        'Food',
        'Balcony',
        'Laundry',
        'Gym',
        'Parking',
      ];
      const invalidAmenities = amenities.filter(
        a => !validAmenities.includes(a)
      );
      if (invalidAmenities.length > 0) {
        return NextResponse.json(
          {
            error: `Invalid amenities: ${invalidAmenities.join(', ')}. Valid amenities are: ${validAmenities.join(', ')}`,
            code: 'INVALID_AMENITIES',
          },
          { status: 400 }
        );
      }
    }

    // Prepare update data (exclude id and createdAt)
    const updateData: any = {};

    if (body.name) updateData.name = body.name.trim();
    if (body.description !== undefined)
      updateData.description = body.description?.trim() || null;
    if (body.address) updateData.address = body.address.trim();
    if (body.city) updateData.city = body.city.trim();
    if (body.locality) updateData.locality = body.locality.trim();
    if (body.latitude !== undefined)
      updateData.latitude = body.latitude ? parseFloat(body.latitude) : null;
    if (body.longitude !== undefined)
      updateData.longitude = body.longitude ? parseFloat(body.longitude) : null;
    if (body.genderType) updateData.genderType = body.genderType;
    if (body.thumbnailImage !== undefined)
      updateData.thumbnailImage = body.thumbnailImage?.trim() || null;
    if (images !== undefined) updateData.images = images;
    if (body.startingPrice)
      updateData.startingPrice = parseInt(body.startingPrice);
    if (amenities !== undefined) updateData.amenities = amenities;
    if (body.virtualTourUrl !== undefined)
      updateData.virtualTourUrl = body.virtualTourUrl?.trim() || null;
    if (body.cancellationPolicy !== undefined)
      updateData.cancellationPolicy = body.cancellationPolicy?.trim() || null;
    if (body.refundPolicy !== undefined)
      updateData.refundPolicy = body.refundPolicy?.trim() || null;
    if (body.managerPhone !== undefined)
      updateData.managerPhone = body.managerPhone?.trim() || null;
    if (body.managerName !== undefined)
      updateData.managerName = body.managerName?.trim() || null;
    if (body.rating !== undefined) updateData.rating = parseFloat(body.rating);
    if (body.totalReviews !== undefined)
      updateData.totalReviews = parseInt(body.totalReviews);
    if (body.isAvailable !== undefined)
      updateData.isAvailable = body.isAvailable;

    const updated = await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, propertyId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
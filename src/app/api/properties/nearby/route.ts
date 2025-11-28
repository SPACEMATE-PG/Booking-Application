import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { isNotNull } from 'drizzle-orm';

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Validate required parameters
    if (!latParam || !lngParam) {
      return NextResponse.json({ 
        error: "Latitude and longitude parameters are required",
        code: "MISSING_COORDINATES" 
      }, { status: 400 });
    }

    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);

    // Validate coordinates are valid numbers
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ 
        error: "Invalid latitude or longitude values",
        code: "INVALID_COORDINATES" 
      }, { status: 400 });
    }

    // Validate latitude and longitude ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({ 
        error: "Latitude must be between -90 and 90, longitude must be between -180 and 180",
        code: "COORDINATES_OUT_OF_RANGE" 
      }, { status: 400 });
    }

    // Parse and validate radius
    const radius = radiusParam ? parseFloat(radiusParam) : 10;
    if (isNaN(radius) || radius <= 0) {
      return NextResponse.json({ 
        error: "Radius must be a positive number",
        code: "INVALID_RADIUS" 
      }, { status: 400 });
    }

    // Parse pagination parameters
    const limit = limitParam ? Math.min(parseInt(limitParam), 100) : 20;
    const offset = offsetParam ? parseInt(offsetParam) : 0;

    if (isNaN(limit) || isNaN(offset) || limit <= 0 || offset < 0) {
      return NextResponse.json({ 
        error: "Invalid pagination parameters",
        code: "INVALID_PAGINATION" 
      }, { status: 400 });
    }

    // Fetch all properties with non-null latitude and longitude
    const allProperties = await db.select()
      .from(properties)
      .where(isNotNull(properties.latitude));

    // Filter properties without longitude
    const propertiesWithCoordinates = allProperties.filter(
      property => property.longitude !== null
    );

    // Calculate distance for each property and filter by radius
    const propertiesWithDistance = propertiesWithCoordinates
      .map(property => {
        const distance = calculateDistance(
          lat,
          lng,
          property.latitude as number,
          property.longitude as number
        );
        return {
          ...property,
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        };
      })
      .filter(property => property.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    // Apply pagination
    const paginatedResults = propertiesWithDistance.slice(offset, offset + limit);

    return NextResponse.json(paginatedResults, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}
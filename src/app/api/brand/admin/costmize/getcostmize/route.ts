import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CustomizeBrand from '@/models/CustomizeBrand';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure the database connection is established
    await connectToDatabase();

    // Fetch the company data
    const customizeBrand = await CustomizeBrand.findOne({}).exec();

    if (!customizeBrand) {
      // Handle case where no company data is found
      return NextResponse.json(
        { message: 'No customizeBrand data found' },
        { status: 404 }
      );
    }

    // Return the fetched company data
    return NextResponse.json(customizeBrand, { status: 200 });
  } catch (error) {
    console.error('Error fetching customizeBrand data:', error);

    // Return a 500 status code with an error message
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

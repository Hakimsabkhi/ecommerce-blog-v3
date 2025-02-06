import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CustomizeCategoy from '@/models/CustomizeCategoy';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure the database connection is established
    await connectToDatabase();

    // Fetch the company data
    const customizeCategoy = await CustomizeCategoy.findOne({}).exec();

    if (!customizeCategoy) {
      // Handle case where no company data is found
      return NextResponse.json(
        { message: 'No company data found' },
        { status: 404 }
      );
    }

    // Return the fetched company data
    return NextResponse.json(customizeCategoy, { status: 200 });
  } catch (error) {
    console.error('Error fetching customizeCategoy data:', error);

    // Return a 500 status code with an error message
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Websiteinfo from '@/models/Websiteinfo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure the database connection is established
    await connectToDatabase();

    // Fetch the company data
    const company = await Websiteinfo.findOne({}).exec();

    if (!company) {
      // Handle case where no company data is found
      return NextResponse.json(
        { message: 'No company data found' },
        { status: 404 }
      );
    }

    // Return the fetched company data
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error('Error fetching company data:', error);

    // Return a 500 status code with an error message
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

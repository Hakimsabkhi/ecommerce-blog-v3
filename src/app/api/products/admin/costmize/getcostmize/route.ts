import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CustomizeProduct from '@/models/CustomizeProduct';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure the database connection is established
    await connectToDatabase();

    // Fetch the customizeProduct data
    const customizeProduct = await CustomizeProduct.findOne({}).exec();

    if (!customizeProduct) {
      // Handle case where no customizeProduct data is found
      return NextResponse.json(
        { message: 'No customizeProduct data found' },
        { status: 404 }
      );
    }

    // Return the fetched customizeProduct data
    return NextResponse.json(customizeProduct, { status: 200 });
  } catch (error) {
    console.error('Error fetching customizeBrand data:', error);

    // Return a 500 status code with an error message
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

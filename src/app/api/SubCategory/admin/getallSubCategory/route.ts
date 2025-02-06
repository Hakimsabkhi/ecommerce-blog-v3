
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Subcategory from '@/models/Subcategory';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';




async function getUserFromToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  const user = await User.findOne({ email: token.email }).exec();
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  return { user };
}
export async function GET(req: NextRequest ) {
  try {

    await connectToDatabase(); 
    const result = await getUserFromToken(req);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }// Ensure the database connection is established
    await User.find({})
    
    // Fetch all categories but only return the name and imageUrl fields
    const subcategory = await Subcategory.find({}).populate('user').exec(); // Only select the 'name' and 'imageUrl' fields

    // Return the fetched category names and image URLs
    return NextResponse.json(subcategory, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
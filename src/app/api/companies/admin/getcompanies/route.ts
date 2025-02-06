import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Companies from '@/models/Companies';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';



export async function GET(req: NextRequest) {
  await connectToDatabase();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user
  const user = await User.findOne({ email: token.email });
  if (!user || (user.role !== 'Admin'  && user.role !== 'SuperAdmin')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }

  try {
   
    
    const companies = await Companies.find().populate('user');
    if (!companies) {
      return NextResponse.json({ message: 'Companies no data exist' }, { status: 400 });
    }



    return NextResponse.json(companies, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

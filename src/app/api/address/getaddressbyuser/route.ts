import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Address from '@/models/Address';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure the database connection is established
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
    }
    const address = await Address.find({ user }).sort({ createdAt: -1 });
    return NextResponse.json(address, { status: 200 });
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

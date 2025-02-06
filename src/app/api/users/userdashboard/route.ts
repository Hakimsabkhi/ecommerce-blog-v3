import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export const GET = async (req: NextRequest) => {
  await connectToDatabase();
 
  //check token
const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
//fatcg the user

    // Find the user by email
    const user = await User.findOne({ email:token.email});

    if (!user || (user.role !== 'SuperAdmin' && user.role!=='Admin')) {
      return NextResponse.json({ error: 'Foridden:Access is denied' }, { status: 404 });
    }
  try {
  if(user.role !== 'Admin'){
    // Fetch all users excluding those with 'Admin' role

    const users = await User.find({ role: { $ne: 'SuperAdmin' } });
    return NextResponse.json(users, { status: 200 });
  }else{
    const users = await User.find({ role: { $nin: ['SuperAdmin', 'Admin'] } });
    return NextResponse.json(users, { status: 200 });
  }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
};

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Description from '@/models/Description';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';



export async function POST(req: NextRequest) {
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
    // Handle form data
    const formData = await req.json();
   

    for (const desc of formData) {
     
        const newDescription = new Description({
            text: desc.text,
            type: desc.type,
            user: user._id, // Assuming user._id is the correct way to reference the user's ID
          });
        await newDescription.save();
        console.log('Description inserted successfully:', newDescription);
     
    }


    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

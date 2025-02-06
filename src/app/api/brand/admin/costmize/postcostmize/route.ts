import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CustomizeBrand from '@/models/CustomizeBrand';

import { getToken } from 'next-auth/jwt';
import User from '@/models/User';


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
    const {title,subtitle} = await req.json();

   

    if (!title ) {
      return NextResponse.json({ message: 'title are required' }, { status: 400 });
    }

    const existingCustomizeBrand = await CustomizeBrand.find({});

    if (existingCustomizeBrand.length > 0) {
      return NextResponse.json({ message: 'A CustomizeBrand already exists' }, { status: 400 });
    }

    
    const newCustomizeBrand= new CustomizeBrand({
     title,
     subtitle,
      user,
    });

    await newCustomizeBrand.save();
    return NextResponse.json(newCustomizeBrand, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ message: 'Error creating company' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/PostSections/PostCategory';

import User from '@/models/User';
import { getToken } from 'next-auth/jwt';


export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
//fatcg the user

    // Find the user by email
    const user = await User.findOne({ email:token.email});

    
    if (!user || user.role !== 'Admin' && user.role !== 'SuperAdmin') {
      return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
    }
  try {
    // Handle form data
    const formData = await req.formData();
    const name = formData.get('name') as string;
     
    if (!name || !user) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }


    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({ message: 'Category with this name already exists' }, { status: 400 });
    }
    const newCategory = new Category({ name, user });

    await newCategory.save();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.log(error)
  }
}

import {NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';


export async function GET() {
  try {
    await connectToDatabase(); // Ensure the database connection is established

    // Fetch all categories but only return the name and imageUrl fields
    const categories = await Category.find({vadmin:"approve"}).exec(); // Only select the 'name' and 'imageUrl' fields

    // Return the fetched category names and image URLs
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
  }
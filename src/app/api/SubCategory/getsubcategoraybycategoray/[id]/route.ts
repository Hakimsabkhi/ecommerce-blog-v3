
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Subcategory from '@/models/Subcategory';





export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      // Extract the category ID from params
      const { id } = await params;
      
  
      // Check if the category ID is valid
      if (!id) {
        return NextResponse.json(
          { message: 'Invalid or missing category ID' },
          { status: 400 }
        );
      }
  
      // Connect to the database
      await connectToDatabase();
  
      // Get user information from token
      
  
      // Fetch subcategories for the specified category ID
      const subcategory = await Subcategory.find({ category: id,vadmin:'approve'}).exec();
  
      // Return the fetched subcategories
      return NextResponse.json(subcategory, { status: 200 });
  
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
  }
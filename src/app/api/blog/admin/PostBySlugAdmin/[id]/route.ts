import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BlogMainSection from '@/models/PostSections/PostMainSectionModel';
import User from '@/models/User';
import PostCategory from '@/models/PostSections/PostCategory';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Ensure the database connection is established
    await connectToDatabase(); 
    const {id:slugblog} = await params;

    // Validate the slugblog parameter
    if (!slugblog || typeof slugblog !== 'string') {
      return NextResponse.json(
        { message: 'Blog name is required and should exist' },
        { status: 400 }
      );
    }

    // Fetch all necessary data
    await User.find();
    await PostCategory.find();
    

    // Fetch the blog with the given slug
   
     const blog = await BlogMainSection.findOne({ slug: slugblog, vadmin: "not-approve" })
    .populate('postcategory')
    .populate('user','_id username')
    .exec();
   

    // Check if the blog was found
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }

    // Return the fetched blog
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

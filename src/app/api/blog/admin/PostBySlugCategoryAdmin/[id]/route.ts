import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PostCategory from '@/models/PostSections/PostCategory';
import BlogMainSection from '@/models/PostSections/PostMainSectionModel';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
   
    const {id:postcategory} = await params;

    if (!postcategory || typeof postcategory !== 'string') {
      return NextResponse.json(
        { message: 'postcategory is required and should be a string' },
        { status: 400 }
      );
    }

    // Find the category by name const blog = await BlogMainSection.findOne({ slug: slugblog, vadmin: "not-approve" })

    const foundCategory = await PostCategory.findOne({ slug: postcategory});
  
    if (!foundCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
   
    // Find products by the category ID
    const blog = await BlogMainSection.find({ postcategory: foundCategory._id ,vadmin: "not-approve"}).populate('postcategory' , 'slug').exec();
   
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

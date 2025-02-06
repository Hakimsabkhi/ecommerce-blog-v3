import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database connection
    await dbConnect();

    // Await the params object
    const { id: categorySlug } = await context.params;

    // Validate and ensure `categorySlug` is available
    if (!categorySlug) {
      return NextResponse.json(
        { error: 'Category slug is required.' },
        { status: 400 }
      );
    }

  

    // Find the category by slug with "approve" status
    const foundCategory = await Category.findOne({ slug: categorySlug, vadmin: 'approve' });

    if (!foundCategory) {
      return NextResponse.json(
        { error: 'Category not found. Please check the slug.' },
        { status: 404 }
      );
    }
    
    // Check if products exist for the category
    const productCount = await Product.countDocuments({
      category: foundCategory._id,
      vadmin: 'approve',
    });

    if (productCount === 0) {
      return NextResponse.json(
        { message: 'No products found for this category.', products: [] },
        { status: 200 }
      );
    }

    // Fetch the products with populated references
    const products = await Product.find({
      category: foundCategory._id,
      vadmin: 'approve',
    })
      .populate('category', 'name slug') // Populate category with only needed fields
      .populate('brand', 'name')        // Populate brand with only needed fields
      .populate('user', 'name email')  // Populate user with only needed fields
      .exec();
    return NextResponse.json(
      { message: 'Products fetched successfully.', products },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);

    return NextResponse.json(
      { error: 'An internal server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

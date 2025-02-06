import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Review from '@/models/Review';
import User from '@/models/User';




export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');

  if (!productId || typeof productId !== 'string') {
    return NextResponse.json(
      { message: 'product is required and should be a string' },
      { status: 400 }
    );
  }
  try {
    await User.find({})
    const review = await Review.find({ product: productId }).populate('user','_id username email') .populate('likes', '_id username email')
    .populate('dislikes', '_id username email');

    return NextResponse.json(review);
  } catch (error) {
    console.log(error)
  }
}
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CommentPost from '@/models/PostSections/CommentPost';
import User from '@/models/User';




export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get('id');

  if (!blogId || typeof blogId !== 'string') {
    return NextResponse.json(
      { message: 'product is required and should be a string' },
      { status: 400 }
    );
  }
  try {
    await User.find({})
  
    const comments = await CommentPost.find({ Post: blogId }).populate('user','_id username email') .populate('likes', '_id username email')
    .populate('dislikes', '_id username email');

    return NextResponse.json(comments);
  } catch (error) {
    console.log(error)
  }
}
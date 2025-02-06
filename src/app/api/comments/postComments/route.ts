import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import comments from '@/models/PostSections/CommentPost';

import User from '@/models/User';
import { getToken } from 'next-auth/jwt';
import PostMainSection from '@/models/PostSections/PostMainSectionModel';


export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
//fatcg the user

    // Find the user by email
    const user = await User.findOne({ email:token.email});

  
  try {
    // Handle form data
    const {comment,post} = await req.json();


  if (!comment || !user ||!post) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

const existblog=await PostMainSection.findById(post);

if(!existblog){
    return NextResponse.json({message: 'blog not exist'},{status:401})
}
 existblog.numbercomment+=1;
 existblog.save();
  
    
    const newcomments = new comments({ user,text:comment, Post:post });

    await newcomments.save(); 
    return NextResponse.json( newcomments, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating category', error }, { status: 500 });
  }
}

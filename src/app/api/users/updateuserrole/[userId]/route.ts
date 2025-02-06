import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string ,adminId:string}> })  {

    await connectToDatabase();
    const {userId}=await params;
  
    
    const { role } = await req.json();
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  //fatcg the user
  
    // Find the user by email
    const users = await User.findOne({ email:token.email});
  
    if (!users || users.role !== 'Admin' && users.role !== 'SuperAdmin') {
      return NextResponse.json({ error: 'Foridden:Access is denied' }, { status: 404 });
    }
    
  
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 402 });
    }
    return NextResponse.json({ user });
  }
  
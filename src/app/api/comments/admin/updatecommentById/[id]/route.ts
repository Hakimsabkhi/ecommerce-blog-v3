import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import comments from '@/models/PostSections/CommentPost';
// Utility function to extract public ID from the image URL

export async function PUT(
    req: NextRequest,
    { params }: { params:Promise< { id: string }> }
  ) {
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
        const { id } = await params; // Get ID from params
      // Handle form data
      const formData = await req.formData();
 
      const reply = formData.get("reply") as string;
      

  
      if (!id) {
        return NextResponse.json(
          { message: "ID is required" },
          { status: 400 }
        );
      }
  
      const existingComments = await comments.findById(id);
      if (!existingComments) {
        return NextResponse.json({ message: "Brand not found" }, { status: 408 });
      }
  
    
     
       await comments.findByIdAndUpdate(
        id,
        { $set: { reply, user: user._id } },
        { new: true }  // Return the updated document
      );

      return NextResponse.json( existingComments , { status: 200 });
    } catch (error) {
      console.error(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating brand", error },
        { status: 500 }
      );
    }
  }
  
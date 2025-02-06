import connectToDatabase from "@/lib/db";
import post from "@/models/PostSections/PostMainSectionModel";
import CommentPost from "@/models/PostSections/CommentPost";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    await connectToDatabase();
  
    const { id } = await params;
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
    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing brand ID" },
        { status: 400 }
      );
    }
  
    try {
      const Comment = await CommentPost.findById(id);
      if (!Comment) {
        return NextResponse.json({ message: "review not found" }, { status: 404 });
      }
      const PostsExist= await post.findById(Comment.Post)
      
      if (!PostsExist){
        return NextResponse.json({ message: 'Error product ' }, { status: 402 });
      }
      PostsExist.numbercomment -= 1; // Increment the review count

      PostsExist.save();

    
  
  
      await CommentPost.findByIdAndDelete(id);
  
      return NextResponse.json(
        { message: "Review deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error deleting review" },
        { status: 500 }
      );
    }
  }
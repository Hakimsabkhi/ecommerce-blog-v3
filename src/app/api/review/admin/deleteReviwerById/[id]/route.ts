import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
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
      const review = await Review.findById(id);
      if (!review) {
        return NextResponse.json({ message: "review not found" }, { status: 404 });
      }
      const productExist= await Product.findById(review.product)
      
      if (!productExist){
        return NextResponse.json({ message: 'Error product ' }, { status: 402 });
      }
      productExist.nbreview -= 1; // Increment the review count

      productExist.save();

    
  
  
      await Review.findByIdAndDelete(id);
  
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
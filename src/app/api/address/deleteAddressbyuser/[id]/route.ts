import connectToDatabase from "@/lib/db";
import Address from "@/models/Address";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    await connectToDatabase();
  
    const { id } =await params;
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  //fatcg the user
  
      // Find the user by email
      const user = await User.findOne({ email:token.email});
  
      
      if (!user ) {
        return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
      }
    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing brand ID" },
        { status: 400 }
      );
    }
  
    try {
      const address = await Address.findById(id);
      if (!address) {
        return NextResponse.json({ message: "Address not found" }, { status: 404 });
      }
  
    
  
  
      await Address.findByIdAndDelete(id);
  
      return NextResponse.json(
        { message: "Address deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error deleting Address" },
        { status: 500 }
      );
    }
  }
import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";




// Handler for GET requests
export async function GET(
    req: NextRequest
  ) {
    await dbConnect();
    try {
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
      
      await User.find();
      await Category.find();
      await Brand.find();
      const product = await Product.find({discount: { $gt: 0 }  ,vadmin:"approve" })
      .populate("user")
      .populate("category")
        .populate("brand").exec();
  
      if (!product) {
        return new NextResponse(JSON.stringify({ message: "Product discount not found" }), { status: 404});
      }
  
      return new NextResponse(JSON.stringify(product), { status: 200 });
  
    } catch (error) {
      console.error("Error fetching product:", error);
      return new NextResponse(JSON.stringify({ message: "Error fetching product discount" }), { status: 500 });
    }
  }
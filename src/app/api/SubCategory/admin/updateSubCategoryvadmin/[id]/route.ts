import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Subcategory from "@/models/Subcategory";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Product from "@/models/Product";


export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    await dbConnect();
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
      // Handle form data
      const formData = await req.formData();
      const vadmin = formData.get('vadmin')as string;
       
       
      const {id} = await context.params; // Get ID from params
  
      if (!id) {
        return NextResponse.json(
          { message: "ID  are required" },
          { status: 400 }
        );
      }
      const existingproductsub=await Product.find({subcategory:id})
    if(existingproductsub){
      await Product.updateMany(
        { subcategory: id },
        { $set: { vadmin: vadmin } } // Update the status field to "vd"
      );
    }
      const existingsubCategory= await Subcategory.findById(id);
      if (!existingsubCategory) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
 
  
      
      // Update category with new values
      // Ensure proper type conversions and default values
      if (vadmin !== undefined && vadmin !== null) {
        existingsubCategory.vadmin = vadmin;
      }
  
  
      
      await existingsubCategory.save();
  
      return NextResponse.json(existingsubCategory, { status: 200 });
    } catch (error) {
      console.error(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating Category status", error },
        { status: 500 }
      );
    }
  }
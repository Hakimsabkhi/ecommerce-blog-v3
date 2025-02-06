import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Product from "@/models/Product";
import Subcategory from "@/models/Subcategory";


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
      const existingproductsub=await Product.find({category:id})
      if(existingproductsub){
        await Product.updateMany(
          { category: id },
          { $set: { vadmin: vadmin } } // Update the status field to "vd"
        );
      }
      const existingSubcategory=await Subcategory.find({category:id})
      if(existingSubcategory){
        await Subcategory.updateMany(
          { category: id },
          { $set: { vadmin: vadmin } } // Update the status field to "vd"
        );
      }
      const existingCategory= await Category.findById(id);
      if (!existingCategory) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
 
  
      
      // Update category with new values
      // Ensure proper type conversions and default values
      if (vadmin !== undefined && vadmin !== null) {
        existingCategory.vadmin = vadmin;
      }
  
  
      
      await existingCategory.save();
  
      return NextResponse.json(existingCategory, { status: 200 });
    } catch (error) {
      console.error(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating Category status", error },
        { status: 500 }
      );
    }
  }
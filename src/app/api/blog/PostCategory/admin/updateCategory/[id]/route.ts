import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/PostSections/PostCategory";

import User from "@/models/User";
import { getToken } from "next-auth/jwt";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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
      // Handle form data
      const formData = await req.formData();
      const name = formData.get("name") as string;
      const {id} = await params; // Get ID from params
  
      if (!id) {
        return NextResponse.json(
          { message: "ID  are required" },
          { status: 400 }
        );
      }
  
      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
  
      if (existingCategory.name !== name) {
        const duplicateCategory = await Category.findOne({ name });
        if (duplicateCategory) {
          return NextResponse.json(
            { message: "Category with this name already exists" },
            { status: 400 }
          );
        }
      }
  
    
   
      // Update category with new values
      existingCategory.name = name;
      existingCategory.user = user;
      await existingCategory.save();
  
      return NextResponse.json(existingCategory, { status: 200 });
    } catch (error) {
      console.error(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating category", error },
        { status: 500 }
      );
    }
  }
  

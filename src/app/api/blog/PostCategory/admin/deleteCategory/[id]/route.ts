
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/PostSections/PostCategory";
import BlogMainSection from "@/models/PostSections/PostMainSectionModel";

import User from "@/models/User";
import { getToken } from "next-auth/jwt";
export async function DELETE(
    req: NextRequest,
    { params }: { params:Promise< { id: string }> }
  ) {
    await connectToDatabase();
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


      // Find the user by email
      const user = await User.findOne({ email:token.email});
  
      
      if (!user || user.role !== 'Admin' && user.role !== 'SuperAdmin') {
        return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
      }
    const { id } = await params;
  
    if (!id) {
      return NextResponse.json(
        { message: "Invalid or missing category ID" },
        { status: 400 }
      );
    }
  
    try {
      const blog = await BlogMainSection.find({ category: id });
      if (blog.length > 0) {
        return NextResponse.json(
          { message: "Cannot delete category with associated products" },
          { status: 402 }
        );
      }
  
      const category = await Category.findById(id);

      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }
  
     
      await Category.findByIdAndDelete(id);
      return NextResponse.json(
        { message: "Category deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error deleting category" },
        { status: 500 }
      );
    }
  }

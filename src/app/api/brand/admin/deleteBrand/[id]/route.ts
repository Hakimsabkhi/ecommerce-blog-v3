
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Brand from "@/models/Brand"; // Import Brand model
import cloudinary from "@/lib/cloudinary";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
// Utility function to extract public ID from the image URL
const extractPublicId = (url: string): string => {
    const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
    if (matches) {
      return matches[1];
    }
    const segments = url.split("/");
    const lastSegment = segments.pop();
    return lastSegment ? lastSegment.split(".")[0] : "";
  };
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }>}
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
      const brand = await Brand.findById(id);
      if (!brand) {
        return NextResponse.json({ message: "Brand not found" }, { status: 404 });
      }
  
      if (brand.imageUrl) {
        const publicId = extractPublicId(brand.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`brands/images/${publicId}`);
        }
      }
  
      if (brand.logoUrl) {
        const publicId = extractPublicId(brand.logoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`brands/logos/${publicId}`);
        }
      }
  
      await Brand.findByIdAndDelete(id);
  
      return NextResponse.json(
        { message: "Brand deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Error deleting brand" },
        { status: 500 }
      );
    }
  }
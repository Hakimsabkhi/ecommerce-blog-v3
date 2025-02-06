import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Review from "@/models/Review";
import Category from '@/models/Category';


const extractPublicId = (url: string): string => {
  // Match the public ID from the URL
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);

  // If the format includes folders, split and get the last part
  if (matches) {
    return matches[1];
  }

  // Handle cases with folder paths
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
};

// Function to delete images from Cloudinary
const deleteImagesFromCloudinary = async (urls: string[]) => {
  for (const url of urls) {
    const publicId = extractPublicId(url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(`Products/images/${publicId}`);
        console.log(`Successfully deleted: ${publicId}`);
      } catch (error) {
        console.error(`Failed to delete: ${publicId}`, error);
      }
    }
  }
};

  export async function DELETE(req: NextRequest,  { params }:{ params: Promise<{ id: string }> }) {
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
      const { id } = await params;
      
      // Find the product by ID
      const product = await Product.findById(id);
      
     
      if (!product) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
   
       await Review.deleteMany({ product: product.id });
   
      // If the product has an associated image, delete it from Cloudinary
      if (product.imageUrl) {
        const publicId = extractPublicId(product.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`Products/${publicId}`);
        }
      } 
 // If the product has associated images, delete them from Cloudinary
 if (product.images && product.images.length > 0) {
  await deleteImagesFromCloudinary(product.images);
}const existingcategory = await Category.findById(product.category);
if (existingcategory){
  existingcategory.numberproduct -= 1;
  existingcategory.save(); 
}
 
      // Delete the product from the database
    await Product.findByIdAndDelete(id); 
  
      return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
    }
}
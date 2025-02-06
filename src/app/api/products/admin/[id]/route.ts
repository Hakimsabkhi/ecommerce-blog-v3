import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase  from '@/lib/db'; // Adjust import according to your project structure
import Product from '@/models/Product'; // Adjust import according to your project structure
import cloudinary from "@/lib/cloudinary";
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
  
export async function DELETE(req: NextRequest) {
  const  id  = req.nextUrl.pathname.split('/').pop() || ''; // Extract ID from the URL
  const { imageUrl } = await req.json(); // Get imageUrl from request body

  if (!id || !imageUrl) {
    return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
  }

  try {
    await connectToDatabase(); // Ensure you are connected to the database

    // Remove image from the product in the database
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    if (imageUrl) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`Products/images/${publicId}`);
        }
      }
    // Remove imageUrl from the images array
    product.images = product?.images?.filter((img: string) => img !== imageUrl);

   await product.save();
    return NextResponse.json({ message: 'Image removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing image:', error);
    return NextResponse.json({ message: 'Error removing image', error }, { status: 500 });
  }
}

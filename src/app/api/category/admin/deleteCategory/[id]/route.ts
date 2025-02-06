import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import Review from "@/models/Review";
import Subcategory from "@/models/Subcategory";

export async function DELETE(
  req: NextRequest,
  { params }:  { params: Promise<{ id: string }> } 
) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //fatcg the user

  // Find the user by email
  const user = await User.findOne({ email: token.email });

  if (
    !user ||
    (user.role !== "Admin" &&
      
      user.role !== "SuperAdmin")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Access is denied" },
      { status: 404 }
    );
  }
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Invalid or missing category ID" },
      { status: 400 }
    );
  }

  try {
    const products = await Product.find({ category: id });

    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        console.log(products[i]._id)
      // Find the product by ID
      const product = await Product.findById(products[i]._id);

      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }

      await Review.deleteMany({ product: product._id });

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
      }

      await Product.findByIdAndDelete(products[i]._id);
    }
    }
    const subcategorys = await Subcategory.find({ category: id });

    if (subcategorys.length > 0) {
      for (let i = 0; i < subcategorys.length; i++) {
      
      // Find the product by ID
      const subcategory = await Subcategory.findById(subcategorys[i]._id);

      if (!subcategory) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }


      // If the product has an associated image, delete it from Cloudinary
      if (subcategory.logoUrl) {
        const publicId = extractPublicId(subcategory.logoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`subcategories/logos/${publicId}`);
        }
      }
      if (subcategory.bannerUrl) {
        const publicId = extractPublicId(subcategory.bannerUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`subcategories/banner/${publicId}`);
        }
      }

      await Subcategory.findByIdAndDelete(products[i]._id);
    }
    }

   const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (category.imageUrl) {
      const publicId = extractPublicId(category.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(`categories/${publicId}`);
      }
    }

    if (category.logoUrl) {
      const publicId = extractPublicId(category.logoUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(`categories/logos/${publicId}`);
      }
    }
    if (category.bannerUrl) {
      const publicId = extractPublicId(category.bannerUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(`categories/banner/${publicId}`);
      }
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

function extractPublicId(url: string): string {
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
  if (matches) {
    return matches[1];
  }
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
}
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
}
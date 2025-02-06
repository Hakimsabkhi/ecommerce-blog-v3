import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Boutique from "@/models/Boutique";



export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
  
) {
  try {
    // Connect to the database
    await dbConnect();
    console.log(context);

    // Check if the database is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      return NextResponse.json(
        { message: ("noProducts") },
        { status: 204 }
      );
    }

    const { id } = await context.params;

    // Validate the `id`
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { message:("invalidId") },
        { status: 400 } // 400 Bad Request
      );
    }
    await Boutique.find();
    // Fetch the product by `slug`
    const product = await Product.findOne({ slug: id, vadmin: "not-approve" })
      .populate("category")
      .populate("boutique")
      .populate("brand")
      .exec();

    // Return 404 if product is not found
    if (!product) {
      return NextResponse.json(
        { message:("productNotFound") },
        { status: 404 } // 404 Not Found
      );
    }

    // Return the product data
    return NextResponse.json(product, { status: 200 }); // 200 OK
  } catch (error) {
    console.error("Error fetching product:", error);

    // Determine error message
    const message = error instanceof Error
      ? error.message
      : ("internalError");

    return NextResponse.json(
      { message: ("internalError"), details: message },
      { status: 500 } 
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";


import User from "@/models/User";



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Invalid or missing category ID" },
      { status: 400 }
    );
  }

  try {
    await User.find();
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching category" },
      { status: 500 }
    );
  }
}
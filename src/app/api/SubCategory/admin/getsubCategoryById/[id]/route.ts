import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Subcategory from "@/models/Subcategory";


import User from "@/models/User";



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Invalid or missing subcategory ID" },
      { status: 400 }
    );
  }

  try {
    await User.find();
    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return NextResponse.json(
        { message: "subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subcategory, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching subcategory" },
      { status: 500 }
    );
  }
}
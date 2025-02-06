import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Brand from "@/models/Brand"; // Import Brand model




// GET function to handle GET requests
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }>   }
) {
  await connectToDatabase();

  const { id } =  await params;

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
    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching brand" },
      { status: 500 }
    );
  }
}


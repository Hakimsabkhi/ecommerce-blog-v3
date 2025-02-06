import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import CustomizeBrand from "@/models/CustomizeBrand";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";




export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: token.email });
  if (
    !user ||
    (user.role !== "Admin" &&
      
      user.role !== "SuperAdmin")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Access is denied" },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const existingCustomizeBrand= await CustomizeBrand.findById(id);
    if (!existingCustomizeBrand) {
      return NextResponse.json(
        { message: "existingCustomizeBrand not found" },
        { status: 404 }
      );
    }

    const title = formData.get("title") as string ;
    const subtitle = formData.get("subtitle") as string ;
   


    // Update company with new values if provided
    if (title !== null) existingCustomizeBrand.title = title;
    if (subtitle !== null) existingCustomizeBrand.subtitle = subtitle;
    

    existingCustomizeBrand.user = user;
    existingCustomizeBrand.updatedAt = new Date();

    await existingCustomizeBrand.save();
    return NextResponse.json(existingCustomizeBrand, { status: 200 });
  } catch (error) {
    console.error("Error updating existingCustomizeBrand:", error);
    return NextResponse.json(
      {
        message: "Error updating existingCustomizeBrand",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
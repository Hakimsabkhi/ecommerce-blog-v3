import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Boutique from "@/models/Boutique";

import cloudinary from "@/lib/cloudinary";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";


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
      { message: "Invalid or missing companies ID" },
      { status: 400 }
    );
  }

  try {
   

   const store = await Boutique.findById(id);
    if (!store) {
      return NextResponse.json(
        { message: "boutique not found" },
        { status: 404 }
      );
    }

    if (store.image) {
      const publicId = extractPublicId(store.image);
      if (publicId) {
        await cloudinary.uploader.destroy(`boutique/${publicId}`);
      }
    }

   
    await Boutique.findByIdAndDelete(id); 
    return NextResponse.json(
      { message: "boutique deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting boutique" },
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
 
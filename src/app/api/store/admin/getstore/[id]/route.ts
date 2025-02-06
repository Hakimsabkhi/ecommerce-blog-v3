import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Boutique from "@/models/Boutique";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";


export async function GET(
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
   

   const boutique = await Boutique.findById(id);
    if (!boutique) {
      return NextResponse.json(
        { message: "boutique not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
        boutique,
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


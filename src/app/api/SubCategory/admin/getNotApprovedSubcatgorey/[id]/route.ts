import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subcategory from "@/models/Subcategory";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";

export async function GET(
 req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {

  await dbConnect();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user
  const user = await User.findOne({ email: token.email });
  if (!user || !(user.role === 'Admin'  || user.role === 'SuperAdmin')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }
  try {
    // Await the params to access the dynamic route parameters
    const { id: categorySlug } = await params;
console.log('sub')
    // Ensure database connection
   

    // Find the category by slug with "not-approve" status
    const foundsubCategory = await Subcategory.findOne({
      slug: categorySlug,
      vadmin: "not-approve",
    }).exec();

    if (!foundsubCategory) {
      return NextResponse.json(
        { message: "No subCategory found with vadmin not-approve" },
        { status: 202 }
      );
    }

    return NextResponse.json(foundsubCategory, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

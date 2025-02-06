import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import PostMainSection from "@/models/PostSections/PostMainSectionModel";
import PostCategory from "@/models/PostSections/PostCategory";



async function getUserFromToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const user = await User.findOne({ email: token.email }).exec();
  if (!user) {
    return { error: "User not found", status: 404 };
  }

  return { user };
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const result = await getUserFromToken(req);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    } // Ensure the database connection is established
    await User.find();
    await PostCategory.find();

    const post = await PostMainSection.find({ numbercomment: { $gt: 0 } })
      .populate("postcategory")
      .populate("user")
      .exec();

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import PostMainSection from '@/models/PostSections/PostMainSectionModel';
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
export async function POST(req: NextRequest) {
  try {
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
    const { title,postCategory, description,imageUrl, subtitles } = await req.json();
    console.log(postCategory)
    const newTitle = new PostMainSection({
      title,
      postcategory:postCategory,
      description,
      imageUrl,
      user,
      Postfirstsubsections:subtitles,
    });

  

    const savedDocument = await newTitle.save();


    return NextResponse.json({
      message: 'Title with subtitles and image saved successfully',
      data: savedDocument,
    });
  } catch (error: unknown) {
    // Explicitly assert `error` as an `Error` type
    if (error instanceof Error) {
      console.error("Error saving new title:", error.message);
      return NextResponse.json(
        { error: 'Failed to save title', details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error occurred:", error);
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}
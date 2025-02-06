import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";

export async function GET(reqeust: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(reqeust.url);
    const verificationToken = searchParams.get("verifyToken") as string;
    const userId = searchParams.get("id");

    const verifyToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const user = await User.findOne({
      _id: userId,
      verifyToken,
      verifyTokenExpire: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.isverified = true;
    user.verifyToken = "";
    user.verifyTokenExpire = new Date(11/11/1111);

    await user.save();

    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" + error },
      { status: 500 }
    );
  }
}
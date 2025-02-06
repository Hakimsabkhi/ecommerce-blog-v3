import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import UserModel from "@/models/User";
import { sendEmail } from "@/lib/sendEmailvf";
import { verificationEmailTemplate } from "@/lib/verificationEmailTemplate";

// In-memory rate-limiting store

const rateLimit = new Map<string, { count: number; lastRequest: number }>();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString().trim();
    const lastname = formData.get("lastname")?.toString().trim();
    const email = formData.get("email")?.toString().toLowerCase().trim();
    const password = formData.get("password")?.toString();
    const role = formData.get("role")?.toString() || "Visiteur";

    // Validate required fields
    if (!name || !lastname || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 400 }
      );
    }

    // Extract client IP address for rate-limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0] || "unknown-ip";

    // Rate-limiting logic
    const rateLimitInfo = rateLimit.get(clientIp) || { count: 0, lastRequest: 0 };
    const currentTime = Date.now();

    if (currentTime - rateLimitInfo.lastRequest < 60000 && rateLimitInfo.count >= 5) {
      return NextResponse.json(
        {
          message: "Too many requests. Please wait a minute and try again.",
        },
        { status: 429 }
      );
    }

    rateLimitInfo.count += 1;
    rateLimitInfo.lastRequest = currentTime;
    rateLimit.set(clientIp, rateLimitInfo);

    // Connect to the database
    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new UserModel({
      username: `${name} ${lastname}`,
      email,
      password: hashedPassword,
      role,
    });

    const verificationToken = newUser.getVerificationToken();

    await newUser.save();
    const verificationLink = `${process.env.NEXTAUTH_URL}/verifyemail?verifyToken=${verificationToken}&id=${newUser?._id}`;
    const message = verificationEmailTemplate(verificationLink);
    // Send verification email
    await sendEmail(newUser?.email, "Email Verification", message);


    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

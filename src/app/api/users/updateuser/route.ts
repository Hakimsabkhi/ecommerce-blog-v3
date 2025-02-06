import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {

  await connectToDatabase();
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
 
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  
    const { phone, currentPassword, newPassword, replyPassword } = await req.json();
    console.log(currentPassword,newPassword,replyPassword)
    // Validate input
    if (!phone && (!currentPassword || !newPassword || !replyPassword)) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    // Update phone number if provided
    if (phone) {
      user.phone = phone;
    }

    // Update password if provided
    if (currentPassword && newPassword && replyPassword) {
      // Check if user.password exists
      if (!user.password) {
        return NextResponse.json({ message: 'No existing password to compare' }, { status: 406 });
      }

      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password); // Fix: ensure password is defined

      if (!isPasswordCorrect) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 402 });
      }

      if (newPassword !== replyPassword) {
        return NextResponse.json({ message: 'Passwords do not match' }, { status: 403 });
      }

      user.password = bcrypt.hashSync(newPassword, 12); // Hash the new password
    }

    // Save the updated user
    await user.save();

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

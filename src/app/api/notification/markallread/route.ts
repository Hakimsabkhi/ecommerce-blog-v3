import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notifications from "@/models/Notifications";
import { getToken } from "next-auth/jwt";

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mark all unread notifications as read (look: false => true) 
    // for the current user if you store user ref in notifications
    // For example, if the notification doc has a `user: ObjectId`:
    // or however you store the user ID in the token
    await Notifications.updateMany(
      {  look: false },
      { $set: { look: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}

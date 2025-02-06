// /src/app/api/notification/unreadcount/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notifications from "@/models/Notifications";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // If you have authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count how many notifications have `look: false`
    const unreadCount = await Notifications.countDocuments({ look: false });
    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    return NextResponse.json(
      { error: "Error fetching unread notification count" },
      { status: 500 }
    );
  }
}

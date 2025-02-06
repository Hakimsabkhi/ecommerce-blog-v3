// src/app/api/notification/getnotification/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import "@/models/order";
import Notifications from "@/models/Notifications";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    // Connect to DB
    await connectToDatabase();

    // Auth check (example using next-auth)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Now that Order is registered, we can safely populate("order")
    const notifications = await Notifications.find()
      .populate({
        path: "order",
        select: "ref deliveryMethod total orderStatus createdAt",
        // For example, further populating the user
        populate: { path: "user", select: "username" },
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Error fetching notifications" },
      { status: 500 }
    );
  }
}

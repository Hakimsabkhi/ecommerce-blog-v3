// src/app/api/role/getrole/route.ts

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Role from "@/models/Role";

export async function GET() {
  await connectToDatabase();
  try {
    // Fetch all roles except "SuperAdmin"
    const roles = await Role.find(
      { name: { $nin: ["SuperAdmin"] } },
      { name: 1, access: 1 }
    ).lean();

    return NextResponse.json({ roles });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

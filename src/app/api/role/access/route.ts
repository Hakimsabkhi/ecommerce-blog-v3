import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db"; // Adjust the import path as necessary
import Role from "@/models/Role"; // Adjust the import path as necessary

export async function GET(req: Request) {
  await connectToDatabase();

  try {
    // Extract the "role" query parameter
    const url = new URL(req.url);
    const role = url.searchParams.get("role");

    if (!role) {
      return NextResponse.json({ error: "Role parameter is required" }, { status: 402});
    }

    // Fetch the role from the database
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Extract allowed pages
    const allowedPages = Array.from(
      roleDoc.access.entries() as Iterable<[string, boolean]>
    )
      .filter(([, hasAccess]) => hasAccess) // Filter where access is true
      .map(([page]) => page); // Extract page names

    return NextResponse.json({ allowedPages });
  } catch (error) {
    console.error("Error fetching role access:", error);
    return NextResponse.json({ error: "Failed to fetch role access" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  await connectToDatabase();

  try {
    // Parse request body
    const { role, dashboardSection, hasAccess } = await req.json();

    // Validate inputs
    if (!role || !dashboardSection || typeof hasAccess !== "boolean") {
      return NextResponse.json({ error: "Invalid input" }, { status: 401 });
    }

    // Find the role document
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return NextResponse.json({ error: "Role not found" }, { status: 406 });
    }
 
    // Update access for the page
    roleDoc.access.set(dashboardSection, hasAccess);

    // Save the updated document
    await roleDoc.save();

    return NextResponse.json({ success: true, role: roleDoc });
  } catch (error) {
    console.error("Error updating role access:", error);
    return NextResponse.json({ error: "Failed to update role access" }, { status: 500 });
  }
}
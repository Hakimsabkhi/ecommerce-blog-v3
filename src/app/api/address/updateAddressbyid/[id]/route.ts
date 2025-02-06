import connectToDatabase from "@/lib/db";
import Address from "@/models/Address";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  const { id } = await params;
  const formData = await req.formData();

  // Extracting fields from formData
  const governorate = formData.get('governorate') as string | null;
  const city = formData.get('city') as string | null;  // Assuming city is a string
  const address = formData.get('address') as string | null;
  const zipcode = formData.get('zipcode') as string | null;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user by email
  const user = await User.findOne({ email: token.email });
  if (!user) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json(
      { message: "Invalid or missing address ID" },
      { status: 400 }
    );
  }

  try {
    const existingAddress = await Address.findById(id);
    if (!existingAddress) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    // Update address fields only if they are not null
    if (governorate !== null) {
      existingAddress.governorate = governorate;
    }
    if (city !== null) {
      existingAddress.city = city;
    }
    if (address !== null) {
      existingAddress.address = address;
    }
    if (zipcode !== null) {
      existingAddress.zipcode = zipcode;
    }

    await existingAddress.save();

    return NextResponse.json(
      { message: "Address updated successfully", address: existingAddress },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating address" },
      { status: 500 }
    );
  }
}

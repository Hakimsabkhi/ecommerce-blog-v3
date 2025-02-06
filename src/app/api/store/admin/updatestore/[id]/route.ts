import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Boutique from "@/models/Boutique";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";

interface UploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown; // Extend as needed for other Cloudinary properties
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the user by email
  const user = await User.findOne({ email: token.email });

  if (!user || (user.role !== "Admin" && user.role !== "SuperAdmin")) {
    return NextResponse.json(
      { error: "Forbidden: Access is denied" },
      { status: 403 } // Changed 404 to 403 for better semantic accuracy
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Invalid or missing companies ID" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();

    // Dynamically extract opening hours
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const openingHours: Record<string, { open: string; close: string }[]> = {};

    daysOfWeek.forEach((day) => {
      const hours = formData.get(day) as string | null;
      if (hours) {
        try {
          // Assuming `hours` is a JSON string like '[{"open":"09:00","close":"17:00"},{}]' 
          const parsedHours = JSON.parse(hours);
          
          // Optionally, validate the structure of the parsed hours
          if (Array.isArray(parsedHours)) {
            openingHours[day] = parsedHours;
          } else {
            console.error(`Invalid format for ${day}:`, parsedHours);
          }
        } catch (error) {
          console.error(`Failed to parse hours for ${day}:`, error);
        }
      }
    });
    
    const name = formData.get("nom") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const localisation = formData.get("localisation") as string;
    const imageFile = formData.get("image") as File | null;

    const existboutique = await Boutique.findById(id);
    if (!existboutique) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    // If an image is provided, handle the file upload
    let imageUrl: string | undefined;
    if (imageFile) {
      if (existboutique.image) {
        const publicId = extractPublicId(existboutique.image);
        if (publicId) {
          await cloudinary.uploader.destroy(`boutique/${publicId}`);
        }
      }

      const result = await uploadToCloudinary(imageFile, "boutique", "webp");
      imageUrl = result.secure_url;
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      nom: name,
      phoneNumber: phoneNumber,
      address: address,
      city: city,
      localisation: localisation,
      user: user,
    };

    if (openingHours) {
      updateData.openingHours = openingHours;
    }

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // Use findOneAndUpdate to update the boutique
    const updatedBoutique = await Boutique.findOneAndUpdate(
      { _id: id }, // Find the boutique by ID
      { $set: updateData }, // Set the updated fields
      { new: true } // Return the updated document
    );

    if (!updatedBoutique) {
      return NextResponse.json({ message: "Failed to update the company" }, { status: 500 });
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating company" },
      { status: 500 }
    );
  }
}

function extractPublicId(url: string): string {
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
  if (matches) {
    return matches[1];
  }
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
}

const uploadToCloudinary = async (file: File, folder: string, format: string): Promise<UploadResult> => {
  const fileBuffer = await file.arrayBuffer();
  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(fileBuffer));

  return new Promise<UploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, format },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result as UploadResult);
      }
    );
    bufferStream.pipe(uploadStream);
  });
};

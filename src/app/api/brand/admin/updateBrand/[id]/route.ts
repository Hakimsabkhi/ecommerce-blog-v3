import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Brand from "@/models/Brand";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";

// Interface for Cloudinary upload result
interface CloudinaryUploadResult {
  secure_url: string;
  // Include other properties from the Cloudinary response as needed
}

// Utility function to extract public ID from the image URL
const extractPublicId = (url: string): string => {
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
  if (matches) {
    return matches[1];
  }
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
};

export async function PUT(
  req: NextRequest,
  { params }:  { params: Promise<{ id: string }>}
) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user
  const user = await User.findOne({ email: token.email });

  if (!user || (user.role !== 'Admin'  && user.role !== 'SuperAdmin')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }

  try {
    // Handle form data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const place = formData.get("place") as string;
    const imageFile = formData.get("image") as File | null;
    const logoFile = formData.get("logo") as File | null;

    const { id } = await params; // Get ID from params

    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Check for duplicate brand name
    if (existingBrand.name !== name) {
      const duplicateBrand = await Brand.findOne({ name });
      if (duplicateBrand) {
        return NextResponse.json(
          { message: "Brand with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Initialize URLs with existing values
    let imageUrl = existingBrand.imageUrl;
    let logoUrl = existingBrand.logoUrl;

    // Function to upload a file to Cloudinary
    const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const passThrough = new stream.PassThrough();
      passThrough.end(buffer);

      const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            format: 'webp'
          },
          (error, result) => {
            if (error) return reject(new Error(`Upload failed: ${error.message}`));
            resolve(result as CloudinaryUploadResult);
          }
        );
        passThrough.pipe(uploadStream);
      });

      return result.secure_url;
    };

    // Handle image file upload and deletion of the old image
    if (imageFile) {
      if (existingBrand.imageUrl) {
        const publicId = extractPublicId(existingBrand.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`brands/images/${publicId}`);
        }
      }
      imageUrl = await uploadToCloudinary(imageFile, "brands/images");
    }

    // Handle logo file upload and deletion of the old logo
    if (logoFile) {
      if (existingBrand.logoUrl) {
        const publicId = extractPublicId(existingBrand.logoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`brands/logos/${publicId}`);
        }
      }
      logoUrl = await uploadToCloudinary(logoFile, "brands/logos");
    }

    // Update brand with new values
    existingBrand.name = name;
    existingBrand.logoUrl = logoUrl;
    existingBrand.imageUrl = imageUrl;
    existingBrand.place = place;
    existingBrand.user = user;
    await existingBrand.save(); // Save the updated brand

    return NextResponse.json(existingBrand, { status: 200 });
  } catch (error) {
    console.error(error); // Log error for debugging
    return NextResponse.json(
      { message: "Error updating brand", error },
      { status: 500 }
    );
  }
}

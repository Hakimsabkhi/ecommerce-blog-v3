import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Websiteinfo from "@/models/Websiteinfo";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";

// Define a type for Cloudinary upload result
interface UploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown; // Extend as needed
}

// Utility function to extract public ID from the image URL
const extractPublicId = (url: string): string => {
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp|svg)$/);
  if (matches) {
    return matches[1];
  }
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
};

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: token.email });
  if (
    !user ||
    (user.role !== "Admin" &&
      
      user.role !== "SuperAdmin")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Access is denied" },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const existingCompany = await Websiteinfo.findById(id);
    if (!existingCompany) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    const name = formData.get("name") as string | null;
    const address = formData.get("address") as string | null;
    const city = formData.get("city") as string | null;
    const governorate = formData.get("governorate") as string | null;
    const zipcode = formData.get("zipcode") as string | null;
    const phoneRaw = formData.get("phone") as string | null;
    const phone = phoneRaw ? parseInt(phoneRaw, 10) : null;
    const email = formData.get("email") as string | null;
    const facebook = formData.get("facebook") as string | null;
    const linkedin = formData.get("linkedin") as string | null;
    const instagram = formData.get("instagram") as string | null;
    const imageFile = formData.get("image") as File | null;
    const bannerFile = formData.get("banner") as File | null;
    const bannerFileContacts = formData.get("bannercontacts") as File | null;

    // Helper function to handle Cloudinary uploads
    const uploadToCloudinary = async (
      file: File,
      folder: string,
      format: string
    ): Promise<UploadResult> => {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileBuffer);

      return new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, format },
          (error, result) => {
            if (error)
              return reject(new Error(`Image upload failed: ${error.message}`));
            resolve(result as UploadResult);
          }
        );
        bufferStream.pipe(uploadStream);
      });
    };

    // Handle logo file upload
    if (imageFile) {
      if (existingCompany.logoUrl) {
        const publicId = extractPublicId(existingCompany.logoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const result = await uploadToCloudinary(imageFile, "company", "webp");
      existingCompany.logoUrl = result.secure_url;
    }

    // Handle banner file upload
    if (bannerFile) {
      if (existingCompany.imageUrl) {
        const publicId = extractPublicId(existingCompany.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const result = await uploadToCloudinary(bannerFile, "company", "webp");
      existingCompany.imageUrl = result.secure_url;
    }

    // Handle banner contacts file upload
    if (bannerFileContacts) {
      if (existingCompany.bannercontacts) {
        const publicId = extractPublicId(existingCompany.bannercontacts);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const result = await uploadToCloudinary(
        bannerFileContacts,
        "company",
        "webp"
      );
      existingCompany.bannercontacts = result.secure_url;
    }

    // Update company with new values if provided
    if (name !== null) existingCompany.name = name;
    if (phone !== null) existingCompany.phone = phone;
    if (email !== null) existingCompany.email = email;
    if (address !== null) existingCompany.address = address;
    if (city !== null) existingCompany.city = city;
    if (governorate !== null) existingCompany.governorate = governorate;
    if (zipcode !== null) existingCompany.zipcode = zipcode;
    if (facebook !== null) existingCompany.facebook = facebook;
    if (linkedin !== null) existingCompany.linkedin = linkedin;
    if (instagram !== null) existingCompany.instagram = instagram;

    existingCompany.user = user;
    existingCompany.updatedAt = new Date();

    await existingCompany.save();
    return NextResponse.json(existingCompany, { status: 200 });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      {
        message: "Error updating company",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
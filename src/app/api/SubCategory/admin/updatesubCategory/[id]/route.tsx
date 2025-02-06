import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Subcategory from "@/models/Subcategory";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: string; // Assuming additional properties are strings
}

export async function PUT(req: NextRequest, { params }:{ params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: token.email });
  if (!user || (user.role !== "Admin" &&  user.role !== "SuperAdmin")) {
    return NextResponse.json({ error: "Forbidden: Access is denied" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const logoFile = formData.get("logo") as File | null;
    const bannerFile = formData.get("banner") as File | null;
    const {id} = await params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const existingSubcategory = await Subcategory.findById(id);
    if (!existingSubcategory) {
      return NextResponse.json({ message: "Subcategory not found" }, { status: 404 });
    }

    if (existingSubcategory.name !== name) {
      const duplicateCategory = await Subcategory.findOne({ name });
      if (duplicateCategory) {
        return NextResponse.json({ message: "Subcategory with this name already exists" }, { status: 400 });
      }
    }

    let logoUrl = existingSubcategory.logoUrl;
    let bannerUrl = existingSubcategory.bannerUrl;

    // Reusable function for Cloudinary upload
    const uploadToCloudinary = async (file: File, folder: string, format: string): Promise<string> => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, format },
          (error, result) => {
            if (error) return reject(new Error(`Upload failed: ${error.message}`));
            resolve(result as CloudinaryUploadResult);
          }
        );
        bufferStream.pipe(uploadStream);
      });

      return result.secure_url;
    };

 

    if (logoFile) {
      if (existingSubcategory.logoUrl) {
        const publicId = extractPublicId(existingSubcategory.logoUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
      logoUrl = await uploadToCloudinary(logoFile, "subcategories/logos", "svg");
    }

    if (bannerFile) {
      if (existingSubcategory.bannerUrl) {
        const publicId = extractPublicId(existingSubcategory.bannerUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
      bannerUrl = await uploadToCloudinary(bannerFile, "subcategories/banner", "webp");
    }

    existingSubcategory.name = name;
    existingSubcategory.logoUrl = logoUrl;
    existingSubcategory.bannerUrl = bannerUrl;
    existingSubcategory.category=category;
    existingSubcategory.user = user;
    await existingSubcategory.save();

    return NextResponse.json(existingSubcategory, { status: 200 });
  } catch (error) {
    console.error("Error updating Subcategory:", error);
    return NextResponse.json({ message: "Error updating Subcategory", error }, { status: 500 });
  }
}

function extractPublicId(url: string): string {
  const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp|svg)$/);
  if (matches) {
    return matches[1];
  }
  const segments = url.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment.split(".")[0] : "";
}

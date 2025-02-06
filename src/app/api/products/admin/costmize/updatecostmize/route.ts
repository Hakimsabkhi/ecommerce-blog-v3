import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import CustomizeProduct from "@/models/CustomizeProduct";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import stream from "stream";
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: string; // Assuming additional properties are strings
}


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

    const existingCustomizeProduct= await CustomizeProduct.findById(id);
    if (!existingCustomizeProduct) {
      return NextResponse.json(
        { message: "existingCustomizeProduct not found" },
        { status: 404 }
      );
    }

    const wbtitle = formData.get("wbtitle") as string ;
    const wbsubtitle = formData.get("wbsubtitle") as string ;
    const wbbannerFile = formData.get("wbbanners") as File ;
    const pctitle = formData.get("pctitle") as string ;
    const pcsubtitle = formData.get("pcsubtitle") as string ;
    const pcbannerFile = formData.get("pcbanners") as File ;
    const cptitle = formData.get("cptitle") as string ;
    const cpsubtitle = formData.get("cpsubtitle") as string ;
    const cpbannerFile = formData.get("cpbanners") as File ;

    // Update company with new values if provided
    if (wbtitle !== null) existingCustomizeProduct.wbtitle = wbtitle;
    if (wbsubtitle !== null) existingCustomizeProduct.wbsubtitle = wbsubtitle;
    if (pctitle !== null) existingCustomizeProduct.pctitle = pctitle;
    if (pcsubtitle !== null) existingCustomizeProduct.pcsubtitle = pcsubtitle;
    if (cptitle !== null) existingCustomizeProduct.cptitle = cptitle;
    if (cpsubtitle !== null) existingCustomizeProduct.cpsubtitle = cpsubtitle;
         let wbbanner = existingCustomizeProduct.wbbanner;
        let cpbanner = existingCustomizeProduct.cpbanner;
        let pcbanner = existingCustomizeProduct.pcbanner;

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
    
        if (wbbannerFile) {
          if (existingCustomizeProduct.wbbanner) {
            const publicId = extractPublicId(existingCustomizeProduct.wbbanner);
            if (publicId) await cloudinary.uploader.destroy(publicId);
          }
          wbbanner = await uploadToCloudinary(wbbannerFile, "banner", "webp");
          existingCustomizeProduct.wbbanner=wbbanner;
        }
    
        if (cpbannerFile) {
          if (existingCustomizeProduct.cpbanner) {
            const publicId = extractPublicId(existingCustomizeProduct.cpbanner);
            if (publicId) await cloudinary.uploader.destroy(publicId);
          }
          cpbanner = await uploadToCloudinary(cpbannerFile, "banner", "webp");
          existingCustomizeProduct.cpbanner=cpbanner;
        }
    
        if (pcbannerFile) {
          if (existingCustomizeProduct.pcbanner) {
            const publicId = extractPublicId(existingCustomizeProduct.pcbanner);
            if (publicId) await cloudinary.uploader.destroy(publicId);
          }
          pcbanner = await uploadToCloudinary(pcbannerFile, "banner", "webp");
          existingCustomizeProduct.pcbanner=pcbanner;
        }
    
    

    existingCustomizeProduct.user = user;
    existingCustomizeProduct.updatedAt = new Date();

    await existingCustomizeProduct.save();
    return NextResponse.json(existingCustomizeProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating existingCustomizeProduct:", error);
    return NextResponse.json(
      {
        message: "Error updating existingCustomizeProduct",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
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

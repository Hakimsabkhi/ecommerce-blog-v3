import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Companies from "@/models/Companies";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/lib/cloudinary";
import stream from 'stream';
interface UploadResult {
    secure_url: string;
    public_id: string;
    [key: string]: unknown; // Extend as needed for other Cloudinary properties
  }
export async function PUT(
  req: NextRequest,
  { params }:  { params: Promise<{ id: string }> } 
) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //fatcg the user

  // Find the user by email
  const user = await User.findOne({ email: token.email });

  if (
    !user ||
    (user.role !== "Admin" &&
      
      user.role !== "SuperAdmin")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Access is denied" },
      { status: 404 }
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
    const name = formData.get('name') as string;
    const matriculefiscal = formData.get('matriculefiscal') as string;
    const address = formData.get('address') as string;
    const numtele = formData.get('numtele') as string;
    const gerantsoc = formData.get('gerantsoc') as string;
    const imgPattente = formData.get('imgPatentes') as File | null;



   const existcompanies = await Companies.findById(id);
    if (!existcompanies) {
      return NextResponse.json(
        { message: "companies not found" },
        { status: 404 }
      );
    }
    if(name){
        existcompanies.name=name;
    }
    if(matriculefiscal){
        existcompanies.matriculefiscal=matriculefiscal;
    }
    if(address){
        existcompanies.address=address;
    }
    if(numtele){
        existcompanies.numtele=numtele;
    }
    if(gerantsoc){
        existcompanies.gerantsoc=gerantsoc
    }
    if(imgPattente){
          if (existcompanies.imgPattente) {
              const publicId = extractPublicId(existcompanies.imgPattente);
              if (publicId) {
                await cloudinary.uploader.destroy(`companies/${publicId}`);
              }
            }
     
            const result = await uploadToCloudinary(imgPattente, 'companies', 'webp');
            let imageUrl = '';
            imageUrl = result.secure_url;
            existcompanies.imgPattente=imageUrl;

    }
    existcompanies.user=user;
    existcompanies.save();



    return NextResponse.json(
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting Companies" },
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
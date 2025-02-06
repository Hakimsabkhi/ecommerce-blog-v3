import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Subcategory from '@/models/Subcategory';
import cloudinary from '@/lib/cloudinary';
import stream from 'stream';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';
import Category from '@/models/Category';

// Define a type for the Cloudinary upload result
interface UploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown; // Extend as needed for other Cloudinary properties
}

export async function POST(req: NextRequest) {
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
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const logoFile = formData.get('logo') as File | null;
    const bannerFile = formData.get('banner') as File | null;
    if (!name || !category) {
      return NextResponse.json({ message: 'Name et catgoray is required' }, { status: 400 });
    }

   if(category){
    const existingcategory = await Category.findById({ _id:category });
    if (!existingcategory) {
      return NextResponse.json({ message: 'Subcategory with this name already exists' }, { status: 408 });
    }
   }
    const existingSubcategory = await Subcategory.findOne({ name });
    if (existingSubcategory) {
      return NextResponse.json({ message: 'Subcategory with this name already exists' }, { status: 402 });
    }

  
    let logoUrl = '';
    let bannerUrl = '';

    // Helper function for Cloudinary upload
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

   

    if (logoFile) {
      const result = await uploadToCloudinary(logoFile, 'subcategories/logos', 'svg');
      logoUrl = result.secure_url;
    }

    if (bannerFile) {
      const result = await uploadToCloudinary(bannerFile, 'subcategories/banner', 'webp');
      bannerUrl = result.secure_url;
    }

    const newSubcategory = new Subcategory({ name, logoUrl  ,bannerUrl,category, user });
    await newSubcategory.save();

    return NextResponse.json(newSubcategory, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

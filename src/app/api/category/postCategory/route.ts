import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import cloudinary from '@/lib/cloudinary';
import stream from 'stream';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';

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
    const imageFile = formData.get('image') as File | null;
    const logoFile = formData.get('logo') as File | null;
    const bannerFile = formData.get('banner') as File | null;
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({ message: 'Category with this name already exists' }, { status: 400 });
    }

    let imageUrl = '';
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

    if (imageFile) {
      const result = await uploadToCloudinary(imageFile, 'categories', 'webp');
      imageUrl = result.secure_url;
    }

    if (logoFile) {
      const result = await uploadToCloudinary(logoFile, 'categories/logos', 'svg');
      logoUrl = result.secure_url;
    }

    if (bannerFile) {
      const result = await uploadToCloudinary(bannerFile, 'categories/banner', 'webp');
      bannerUrl = result.secure_url;
    }

    const newCategory = new Category({ name, logoUrl, imageUrl, bannerUrl, user });
    await newCategory.save();

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

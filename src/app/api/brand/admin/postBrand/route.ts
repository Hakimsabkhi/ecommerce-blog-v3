import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Brand from '@/models/Brand';
import cloudinary from '@/lib/cloudinary';
import stream from 'stream';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';

// Define the expected type for Cloudinary upload result
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  // Add other properties returned by Cloudinary if needed
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check for valid authentication token
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the authenticated user
  const user = await User.findOne({ email: token.email });
  if (!user || (user.role !== 'Admin'  && user.role !== 'SuperAdmin')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
  }

  try {
    // Parse form data from the request
    const formData = await req.formData();
    const name = formData.get('name') as string | null;
    const place = formData.get('place') as string | null;
    const imageFile = formData.get('image') as File | null;
    const logoFile = formData.get('logo') as File | null;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }
    if (!place) {
      return NextResponse.json({ message: 'Place is required' }, { status: 400 });
    }

    // Check for duplicate brand
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return NextResponse.json({ message: 'Brand with this name already exists' }, { status: 400 });
    }

    let imageUrl = '';
    let logoUrl = '';

    // Helper function to upload files to Cloudinary
    const uploadToCloudinary = async (file: File, folder: string): Promise<string> => {
      const buffer = await file.arrayBuffer();
      const bufferStream = new stream.PassThrough();
      bufferStream.end(Buffer.from(buffer));

      const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, format: 'webp' },
          (error, result) => {
            if (error || !result) {
              return reject(error);
            }
            resolve(result as CloudinaryUploadResult);
          }
        );
        bufferStream.pipe(uploadStream);
      });

      return result.secure_url;
    };

    // Upload image file if provided
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile, 'brands/images');
    }

    // Upload logo file if provided
    if (logoFile) {
      logoUrl = await uploadToCloudinary(logoFile, 'brands/logos');
    }

    // Save the new brand
    const newBrand = new Brand({ name, place, logoUrl, imageUrl, user });
    await newBrand.save();
    return NextResponse.json(newBrand, { status: 201 });

  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}

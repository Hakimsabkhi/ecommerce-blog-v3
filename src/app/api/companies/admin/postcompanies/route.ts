import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Companies from '@/models/Companies';
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
    const matriculefiscal = formData.get('matriculefiscal') as string;
    const address = formData.get('address') as string;
    const numtele = formData.get('numtele') as string;
    const gerantsoc = formData.get('gerantsoc') as string;
    const imgPattente = formData.get('imgPattente') as File | null;

  if (!name||!matriculefiscal||!address||!numtele||!gerantsoc||!imgPattente){
    return NextResponse.json({ message: 'Companies  empty data' }, { status: 402 });
  }

    const existingCompanies = await Companies.findOne({ matriculefiscal:matriculefiscal });
    if (existingCompanies) {
      return NextResponse.json({ message: 'Companies with this name already exists' }, { status: 400 });
    }

    let imageUrl = '';


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

    if (imgPattente) {
      const result = await uploadToCloudinary(imgPattente, 'companies', 'webp');
      imageUrl = result.secure_url;
    }

  

    const newCategory = new Companies({ name,matriculefiscal,address,numtele,gerantsoc,imgPattente:imageUrl,user:user});
    await newCategory.save();

    return NextResponse.json(/* newCategory */ { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

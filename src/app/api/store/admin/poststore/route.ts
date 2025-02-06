import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Boutique from '@/models/Boutique';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';
import cloudinary from '@/lib/cloudinary';
import stream from 'stream';

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    // Add other properties returned by Cloudinary if needed
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
    return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
  }

  try {
    // Handle form data
    const formData = await req.formData();

    // Dynamically extract opening hours
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const openingHours: Record<string, { open: string; close: string }[]> = {};

    daysOfWeek.forEach((day) => {
      const hours = formData.get(day) as string | null;
      console.log(hours)
      if (hours) {
        // Assuming `hours` is a JSON string like '[{"open":"09:00","close":"17:00"}]'
        openingHours[day] = JSON.parse(hours);
      }
    });

    // Image upload logic
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

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

    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile, 'boutique');
    }

    // Save Boutique data
    const name = formData.get('nom') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const localisation = formData.get('localisation') as string;

    const boutique = new  Boutique({
      nom:name,
      image: imageUrl,
      phoneNumber,
      address,
      city,
      localisation,
      openingHours,
      user,
    });
    
   
        const savedBoutique = await boutique.save();
        console.log(savedBoutique);  // Logging the saved boutique document
     
    return NextResponse.json({ status: 200, message: 'Boutique created successfully!' });
  } catch (error) {
    console.error("Error saving boutique:", error); 
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}

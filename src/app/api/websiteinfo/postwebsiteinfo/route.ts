import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Websiteinfo from '@/models/Websiteinfo';
import cloudinary from '@/lib/cloudinary';
import stream from 'stream';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';

// Define an interface for Cloudinary's upload response
interface CloudinaryUploadResult {
  secure_url: string;
  // Add other properties from the Cloudinary response as needed
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

    const name = formData.get('name') as string | null;
    const address = formData.get('address') as string | null;
    const city = formData.get('city') as string | null;
    const governorate = formData.get('governorate') as string | null;
    const zipcode = formData.get('zipcode') as string | null;
    const phone = formData.get('phone') as string | null;
    const email = formData.get('email') as string | null;
    const facebook = formData.get('facebook') as string | null;
    const linkedin = formData.get('linkedin') as string | null;
    const instagram = formData.get('instagram') as string | null;
    const imageFile = formData.get('image') as File | null;
    const bannerFile = formData.get('banner') as File | null;
    const bannerFileContacts = formData.get('bannercontacts') as File | null;

    if (!name || !address || !city || !governorate || !zipcode || !phone || !email) {
      return NextResponse.json({ message: 'Name, Address, City, Governorate, Zipcode, Phone, and Email are required' }, { status: 400 });
    }

    const existingCompany = await Websiteinfo.find({});

    if (existingCompany.length > 0) {
      return NextResponse.json({ message: 'A company already exists' }, { status: 400 });
    }

    // Function to upload a file to Cloudinary
    const uploadToCloudinary = async (file: File, folder: string, format: string): Promise<string> => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, format },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result as CloudinaryUploadResult);
          }
        );
        bufferStream.pipe(uploadStream);
      });

      return result.secure_url;
    };

    let logoUrl = '';
    if (imageFile) {
      logoUrl = await uploadToCloudinary(imageFile, 'company', 'webp');
    }

    let imageUrl = '';
    if (bannerFile) {
      imageUrl = await uploadToCloudinary(bannerFile, 'company', 'webp');
    }

    let bannerContactsUrl = '';
    if (bannerFileContacts) {
      bannerContactsUrl = await uploadToCloudinary(bannerFileContacts, 'company', 'webp');
    }

    const newCompany = new Websiteinfo({
      name,
      governorate,
      city,
      address,
      zipcode,
      email,
      logoUrl,
      imageUrl,
      bannercontacts: bannerContactsUrl,
      phone,
      facebook,
      linkedin,
      instagram,
      user
    });

    await newCompany.save();
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ message: 'Error creating company' }, { status: 500 });
  }
}

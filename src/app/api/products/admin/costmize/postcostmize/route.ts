import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CustomizeProduct from '@/models/CustomizeProduct';
import cloudinary from '@/lib/cloudinary';
import stream from 'stream';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';
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
    const wbtitle = formData.get("wbtitle") as string ;
    const wbsubtitle = formData.get("wbsubtitle") as string ;
    const wbbannerFile = formData.get("wbbanners") as File ;
    const pctitle = formData.get("pctitle") as string ;
    const pcsubtitle = formData.get("pcsubtitle") as string ;
    const pcbannerFile = formData.get("pcbanners") as File ;
    const cptitle = formData.get("cptitle") as string ;
    const cpsubtitle = formData.get("cpsubtitle") as string ;
    const cpbannerFile = formData.get("cpbanners") as File ;


    if (!wbtitle||!pctitle||!cptitle ||!wbbannerFile||!pcbannerFile||!cpbannerFile) {
      return NextResponse.json({ message: 'title and image are required' }, { status: 400 });
    }

    const existingCustomizeProduct= await CustomizeProduct.find({});

    if (existingCustomizeProduct.length > 0) {
      return NextResponse.json({ message: 'A CustomizeProduct already exists' }, { status: 400 });
    }

     let wbbanner = '';
         let pcbanner = '';
         let cpbanner = '';
     
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
     
         if (wbbannerFile) {
          console.log(wbbannerFile)
           const result = await uploadToCloudinary(wbbannerFile, 'banner', 'webp');
           wbbanner = result.secure_url;
         }
     
         if (cpbannerFile) {
           const result = await uploadToCloudinary(cpbannerFile, 'banner', 'webp');
           cpbanner = result.secure_url;
         }
     
         if (pcbannerFile) {
           const result = await uploadToCloudinary(pcbannerFile, 'banner', 'webp');
           pcbanner = result.secure_url;
         }

    const newCustomizeProduct= new CustomizeProduct({
      wbtitle,
      wbsubtitle,
      wbbanner,
      pctitle,
      pcsubtitle,
      pcbanner,
      cptitle,
      cpsubtitle,
      cpbanner,
      user,
    });

    await newCustomizeProduct.save(); 
    return NextResponse.json(/* newCustomizeProduct, */ { status: 201 });
  } catch (error) {
    console.error('Error creating CustomizeProduct:', error);
    return NextResponse.json({ message: 'Error creating CustomizeProduct' }, { status: 500 });
  }
}

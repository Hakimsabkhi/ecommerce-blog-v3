import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Address from '@/models/Address';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
    await connectToDatabase();
 
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.findOne({ email:token.email});
  
    if (!users ) {
      return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
    }
    try {
      // Handle form data

      const formData = await req.formData();
      const user = formData.get('userId') as string | null;

      const governorate = formData.get('governorate') as string | null;
      const city = formData.get('city') as number | null;
      const address = formData.get('address') as string | null;
      const zipcode = formData.get('zipcode')as string|null;
         // Validate fields and prepare error message
         console.log(zipcode,city,governorate,address,user)
         if (!governorate || !city||!user||!address||!zipcode) {
          return NextResponse.json({ message: 'all is required' }, { status: 400 });
        }
  
      // Save the phone in user to the database
   
      const newAddress = new Address({ governorate,city,zipcode, address,user });
     const addresss =await newAddress.save(); 
      // Return a success response
   return NextResponse.json({ message: 'addresss submitted successfully', address: addresss }, { status: 200 }); 
    } catch (error) {
      console.log (error)
    }
  }
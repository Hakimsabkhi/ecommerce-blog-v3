import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/order';
import User from '@/models/User';
import Address from '@/models/Address';
import { getToken } from 'next-auth/jwt';




export async function GET(req: NextRequest ) {
 

  try {
    await connectToDatabase(); // Ensure the database connection is established
  
    
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await User.findOne({ email:token.email});
    // Parse the request body
    if (!user){
        return NextResponse.json({ success: false, message: "Missing required connect" }, { status: 505 });
    }
  
   
    await Address.find({});
    // Fetch all categories but only return the name and imageUrl fields
    const orders = await Order.find().populate('user').populate('address').sort({ createdAt: -1 }).exec(); // Only select the 'name' and 'imageUrl' fields

    // Return the fetched category names and image URLs
    return new NextResponse(JSON.stringify(orders), { status: 200 });
  
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}
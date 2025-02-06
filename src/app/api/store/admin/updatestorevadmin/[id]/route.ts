import { NextRequest, NextResponse } from "next/server"; // Use the new Next.js 13 API route types
import dbConnect from "@/lib/db";
import Boutique from "@/models/Boutique";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";


export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    await dbConnect();
    const token=await getToken({req,secret:process.env.NEXTAUTH_SECRET});
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  //fatcg the user
  
      // Find the user by email
      const user = await User.findOne({ email:token.email});
  
      
      if (!user || user.role !== 'Admin' && user.role !== 'SuperAdmin') {
        return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 404 });
      }
    try {
      // Handle form data
      const formData = await req.formData();
      const vadmin = formData.get('vadmin')as string;
       
       
      const {id} = await context.params; // Get ID from params
  
      if (!id) {
        return NextResponse.json(
          { message: "ID  are required" },
          { status: 400 }
        );
      }
  
      const existingstore= await Boutique.findById(id);
      if (!existingstore) {
        return NextResponse.json(
          { message: "Store not found" },
          { status: 404 }
        );
      }

 /*   if(vadmin){
      existingstore.vadmin=vadmin
   } */
   
      // const store=await existingstore.save();
      await Boutique.findByIdAndUpdate(id,{vadmin:vadmin})
      return NextResponse.json(/* store */ { status: 200 });
    } catch (error) {
      console.log(error); // Log error for debugging
      return NextResponse.json(
        { message: "Error updating existingstore status", error },
        { status: 500 }
      );
    }
  }
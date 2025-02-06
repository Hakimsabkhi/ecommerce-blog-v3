import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Description from "@/models/Description";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";


export async function PUT(
  req: NextRequest,
  { params }:  { params: Promise<{ id: string }> } 
) {
  await connectToDatabase();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  //fatcg the user

  // Find the user by email
  const user = await User.findOne({ email: token.email });

  if (
    !user ||
    (user.role !== "Admin" &&
      
      user.role !== "SuperAdmin")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Access is denied" },
      { status: 404 }
    );
  }
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Invalid or missing companies ID" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    
  const text = formData.get('text') as string;
    const type = formData.get('type') as string;
   

   const existDescription = await Description.findById(id);
    if (!existDescription) {
      return NextResponse.json(
        { message: "Description not found" },
        { status: 404 }
      );
    }
    if(text){
        existDescription.text=text;
    }
    if(type){
        existDescription.type=type;
    }
    
    existDescription.user=user;
    existDescription.save(); 



    return NextResponse.json(
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting Companies" },
      { status: 500 }
    );
  }
}

import connectToDatabase from "@/lib/db";
import Role from "@/models/Role";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
async function getUserFromToken(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }
  
    const user = await User.findOne({ _id: token.id }).exec();
    if (!user) {
      return { error: 'User not found', status: 404 };
    }
  
    return { user };
  }
export async function GET(req: NextRequest) {
    await connectToDatabase();
    try {
        const ConnectUser =await getUserFromToken(req);
    
      const roles = await Role.find({});
      const userRole = ConnectUser?.user?.role; // Assuming 'role' is a reference to a role in your User model
      const roleExists = roles.some(role => role.name?.toString() === userRole?.toString());

      if(userRole!='SuperAdmin'){
      // If role does not exist or the role is 'Visitor'
if (!roleExists || userRole?.toString() === 'Visiteur') {
    console.log("Role does not exist or is Visitor. Returning false.");
    const veif= false;
    return NextResponse.json(veif); // or handle it however you need
} else {
    console.log("User's role exists and is valid.");
    const veif= true; // or proceed with other logic
    return NextResponse.json(veif);
}
}
return NextResponse.json(true);
      
    } catch (err) {
      console.log(err)
    }
  }
  
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Role from '@/models/Role';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';

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
    const { newRole } = await req.json();
   
    if (!newRole) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }
    const nRole=toSentenceCase(newRole);
    if (user.role === "Admin" && (nRole === "Admin" || nRole === "Superadmin")) {
      return NextResponse.json({ error:" role not accept"} , { status: 405 })
    }
    
   const existrole = await Role.findOne({name:nRole});

   if(existrole){
    return NextResponse.json({ error:"exist role"} , { status: 406 })
   }
    const role = new Role({ name: nRole, access: {} });
    await role.save();


    return NextResponse.json( role , { status: 200 });

  } catch (error) {
    console.log(error)
  }
}
function toSentenceCase(str: string): string {
  if (!str) return str; // handle empty or undefined string
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
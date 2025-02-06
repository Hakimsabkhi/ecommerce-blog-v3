import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import  connectToDatabase  from '@/lib/db';
import User from '@/models/User';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Connect to the database
    await connectToDatabase();
    const { id } = await params;

    // Check the token for authorization
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user using the token's email
    const user = await User.findOne({ email: token.email });

    // Ensure the user is either SuperAdmin or Admin
    if (!user || (user.role !== 'SuperAdmin' && user.role !== 'Admin')) {
      return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
    }

    // Delete the user by ID
 const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    } 

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import {NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User'; // Adjust the path as necessary

const mongoUri = process.env.MONGODB_URI;

export async function GET() {
  try {
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }

    // Set the password you want for the SuperAdmin
    const plainTextPassword = 'SuperSecurePassword123!';

    // Hash the password before saving it to the database
    const hashedPassword = bcrypt.hashSync(plainTextPassword, 12);

    const superAdmin = new User({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: hashedPassword, // Store the hashed password
      role: 'SuperAdmin',
      isverified:true,
        });

    await superAdmin.save();
    return NextResponse.json({ message: 'SuperAdmin created successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating SuperAdmin', error: errorMessage }, { status: 500 });
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}



///// run this : curl http://localhost:3000/api/create-superadmin

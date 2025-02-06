import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "@/lib/db";
import Products from "@/models/Product";
import User from "@/models/User";
import { getToken } from 'next-auth/jwt';
import Brand from '@/models/Brand';
import Category from '@/models/Category';
import Boutique from '@/models/Boutique';
import Subcategory from '@/models/Subcategory';



async function getUserFromToken(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  const user = await User.findOne({ email: token.email }).exec();
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  return { user };
}

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Authenticate user
    const result = await getUserFromToken(req);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    await Boutique.find();
    await Brand.find();
    await Category.find();
    await Subcategory.find();
    await User.find();
    // Fetch products and populate references
    const products = await Products.find({})
      .populate("user")
      .populate("category")
      .populate("subcategory")
      .populate("boutique")
      .populate("brand")
      .exec();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
  }
}

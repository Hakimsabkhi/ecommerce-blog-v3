import { NextResponse, NextRequest} from 'next/server';
import connectToDatabase from '@/lib/db';
import PostMainSection from '@/models/PostSections/PostMainSectionModel';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';
import PostCategory from '@/models/PostSections/PostCategory';



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
      await connectToDatabase();
      const result = await getUserFromToken(req);
      if ('error' in result) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      await User.find({})
      await PostCategory.find({})
      const Posts = await PostMainSection.find({}).populate('postcategory').populate('user','_id username email role').exec();
      return NextResponse.json(Posts);
    } catch (error: unknown) {
      // Explicitly assert `error` as an `Error` type
      if (error instanceof Error) {
        console.error('Error fetching titles:', error.message);
        return NextResponse.json(
          { error: 'Failed to fetch titles', details: error.message },
          { status: 500 }
        );
      } else {
        console.error("Unknown error occurred:", error);
        return NextResponse.json(
          { error: 'An unknown error occurred' },
          { status: 500 }
        );
      }
    }
  }
  
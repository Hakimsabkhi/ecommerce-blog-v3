import { NextResponse ,NextRequest} from 'next/server';
import connectToDatabase from '@/lib/db';
import PostMainSectionModel from '@/models/PostSections/PostMainSectionModel';
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

export async function GET(request: NextRequest, { params }: { params:Promise< { id: string }> }) {
  await connectToDatabase();
  const { id } = await params;

  try {
    const result = await getUserFromToken(request);
      if ('error' in result) {
        return NextResponse.json({ error: result.error }, { status: result.status });
      }
      await User.find({})
      await PostCategory.find({})
    const post = await PostMainSectionModel.findById(id).populate('postcategory').lean();
    if (!post) return NextResponse.json({ message: 'post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ message: 'Error fetching post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const updatedData = await request.json();


  try {
    const user = await getUserFromToken(request);
    if ('error' in user) {
      return NextResponse.json({ error: user.error }, { status: user.status });
    }
    await PostMainSectionModel.findByIdAndUpdate(id,user)


    const result = await PostMainSectionModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!result) return NextResponse.json({ message: 'Title not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating title:', error);
    return NextResponse.json({ message: 'Error updating title' }, { status: 500 });
  }
}

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import { getToken } from 'next-auth/jwt';
import User from '@/models/User';
import mongoose from 'mongoose';
// POST handler
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;
        const formData = await req.formData();
        const action = formData.get("action") as string | null;

        if (!id || !action) {
            return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
        }

        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token || !token.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findOne({ email: token.email });
        const userId = user?.id as string;
        const userIdObjectId = new mongoose.Types.ObjectId(userId);
        if (!userId) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const post = await Review.findById(id);
        if (!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        // Initialize `likes` and `dislikes` if they do not exist
        post.likes = post.likes || [];
        post.dislikes = post.dislikes || [];

        const userIdString = userId.toString(); // Ensure the userId is in string format

        const hasLiked = post.likes.includes(userIdString);
        const hasDisliked = post.dislikes.includes(userIdString);

        if (action === 'like') {
            if (hasLiked) {
                // Remove like if it already exists
                post.likes = post.likes.filter(likeId => likeId.toString() !== userIdObjectId.toString());
            } else {
                // Remove dislike if it exists and add like
                if (hasDisliked) {
                    post.dislikes = post.dislikes.filter(dislikeId => dislikeId.toString() !== userIdObjectId.toString());
                    post.dislikes = post.dislikes.filter((dislikeId) => dislikeId !== userIdString);
                }
                post.likes.push(userIdString);
            }
        } else if (action === 'dislike') {
            if (hasDisliked) {
                // Remove dislike if it already exists
                post.dislikes = post.dislikes.filter(dislikeId => dislikeId.toString() !== userIdObjectId.toString());
            } else {
                // Remove like if it exists and add dislike
                if (hasLiked) {
                    post.likes = post.likes.filter(likeId => likeId.toString() !== userIdObjectId.toString());
                    post.likes = post.likes.filter((likeId) => likeId !== userIdString);
                }
                post.dislikes.push(userIdString);
            }
        } else {
            return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
        }

        console.log('Updated post:', post);

        await post.save();

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error('Error processing POST request:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

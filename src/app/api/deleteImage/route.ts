import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
  const { imageUrl } = await request.json();


  // Extract the public ID from the Cloudinary URL
  const publicId = imageUrl.split('/').pop()?.split('.')[0];
  if (!publicId) {
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(`blog/${publicId}`);
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

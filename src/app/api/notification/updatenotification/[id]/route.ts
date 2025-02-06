import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Notification from '@/models/Notifications';
import { getToken } from 'next-auth/jwt';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const notification = await Notification.findById(id);

    if (!notification) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });

    notification.seen = true;
    await notification.save();

    return NextResponse.json({ message: 'Notification updated' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Error updating notification' }, { status: 500 });
  }
}

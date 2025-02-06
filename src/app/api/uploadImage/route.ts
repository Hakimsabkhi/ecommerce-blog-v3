// app/api/uploadImage/route.ts

import { NextResponse } from 'next/server';
import uploadImage from '@/lib/uploadeImage'; // Corrected import path

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const uploadedImageUrl = await uploadImage('blog', file);

        return NextResponse.json({ url: uploadedImageUrl });
    } catch (error) {
        console.error('Error in image upload route:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}

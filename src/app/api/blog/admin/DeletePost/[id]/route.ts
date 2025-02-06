import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import BlogMainSection from "@/models/PostSections/PostMainSectionModel";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";
import cloudinary from "@/lib/cloudinary";

// Utility function to extract the public ID from a Cloudinary URL
const extractPublicId = (url: string): string => {
    const matches = url.match(/\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/);
    if (matches) {
      return matches[1];
    }
    const segments = url.split("/");
    const lastSegment = segments.pop();
    return lastSegment ? lastSegment.split(".")[0] : "";
};

export async function DELETE(req: NextRequest, { params }: { params: Promise< { id: string } >}) {
    await connectToDatabase();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });

    if (!user || !['Admin', 'Consulter', 'SuperAdmin'].includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden: Access is denied' }, { status: 403 });
    }

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ message: "Invalid or missing blog ID" }, { status: 400 });
    }

    try {
        const existingBlog = await BlogMainSection.findById(id).exec();

        if (!existingBlog) {
            throw new Error('Blog not found');
        }

        // Remove main blog image from Cloudinary
        if (existingBlog.imageUrl) {
            const publicId = extractPublicId(existingBlog.imageUrl);
          
            if (publicId) {
                await cloudinary.uploader.destroy(`blog/${publicId}`);
            }
        }

        // Process and delete blog subsections (first level)
        if (Array.isArray(existingBlog.Postfirstsubsections)) {
            for (const firstSub of existingBlog.Postfirstsubsections) {
                // Remove image from first subsection
                if (firstSub.imageUrl) {
                    const publicId = extractPublicId(firstSub.imageUrl);
                    if (publicId) {
                        await cloudinary.uploader.destroy(`blog/${publicId}`);
                    }
                }

                // Process second level subsections (inside first subsection)
                if (Array.isArray(firstSub.Postsecondsubsections)) {
                    for (const secondSub of firstSub.Postsecondsubsections) {
                        if (secondSub.imageUrl) {
                            const publicId = extractPublicId(secondSub.imageUrl);
                            if (publicId) {
                                await cloudinary.uploader.destroy(`blog/${publicId}`);
                            }
                        }
                    }
                    // Delete second level subsections
                   
                }
            }
            // Delete first level subsections
        
        }

        // Finally, delete the main blog document
        await BlogMainSection.findByIdAndDelete(id);
        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error deleting blog"}, { status: 500 });
    }
}

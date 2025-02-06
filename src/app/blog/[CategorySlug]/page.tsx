import Blog from '@/components/fPostadmin/Post';
import { fetchBlogData } from '@/lib/StaticDataBlog';
import React from 'react';




type Params = Promise<{ CategorySlug: string }>;

export default async function Page({ params }: { params: Params }) {
  const {CategorySlug:id} = await params;

      const blogs = await fetchBlogData(id);
      const blog = JSON.parse(blogs)
    // Pass the blog data as an array
    return (
        <div>
            <Blog blogs={blog} />
        </div>
    );
}
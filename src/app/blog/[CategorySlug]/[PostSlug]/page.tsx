import BlogPost from '@/components/fPostadmin/BlogPost';
import { fetchDatapostid } from '@/lib/StaticDataBlog';
import { notFound } from 'next/navigation';
import React from 'react';




  export default async function Page({ params }: { params: Promise<{PostSlug: string }> }) {
    const {PostSlug:id} = await params;

 
    if (!id) {
      return notFound();
    }

    const bloginfo = await fetchDatapostid(id);
    const blog =JSON.parse(bloginfo)
   
    return (
        <div>
            <BlogPost blog={blog} />
        </div>
    );
}



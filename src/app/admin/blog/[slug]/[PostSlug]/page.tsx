import BlogPost from '@/components/PostComponents/BlogPost';
import { notFound } from 'next/navigation';
import React from 'react';


interface Postsecondsubsection {
  secondtitle: string;
  description: string;
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface Postfirstsubsection {
  fisttitle: string;
  description: string;
  Postsecondsubsections: Postsecondsubsection[];
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface Blog {
  _id:string;
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  postcategory: postcategory;
  imageUrl?: string;
  user:User;
  numbercomment:number;
  createdAt:string;
}
interface User{
 _id:string;
 username:string
}
interface postcategory {
  _id: string;
  name: string;
}

interface  User{
  _id:string;
  username:string;
  email:string;
}

 
const fetchBlogData = async (id: string): Promise<Blog> => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/admin/PostBySlugAdmin/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    notFound();
  }

  const data: Blog = await res.json();
  return data;
};

type Params = Promise<{ PostSlug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { PostSlug: id } = await params;

  if (!id) {
    return notFound();
  }

  const blog = await fetchBlogData(id);

  return (
    <div>
      <BlogPost blog={blog} />
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { IPost } from '../models/Post';

interface PostListProps {
  posts: IPost[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="space-y-6">
      {posts.map(post => (
        <div key={post._id} className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-2">
            <Link href={`/blog/${post._id}`}>
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;

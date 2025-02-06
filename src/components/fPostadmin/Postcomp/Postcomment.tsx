'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { FormEvent, useEffect, useState, useCallback } from 'react';
import { AiOutlineLike } from "react-icons/ai";

interface Postsecondsubsection {
  secondtitle: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
}

interface Postfirstsubsection {
  fisttitle: string;
  description: string;
  Postsecondsubsections: Postsecondsubsection[];
  imageUrl?: string;
  imageFile?: File;
}

interface blog {
  _id: string;
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  postcategory: postcategory;
  imageUrl?: string;
  user: User;
  numbercomment: number;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface postcategory {
  _id: string;
  name: string;
}

interface comment {
  _id: string;
  text: string;
  reply: string;
  user: {
    _id: string;
    username: string;
  };
  likes: User[];
  createdAt: string;
  updatedAt: string;
}

interface BlogCommentProps {
  blog: blog;
}

const BlogComment: React.FC<BlogCommentProps> = ({ blog }) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<comment[]>([]);
  
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments/getComments/${blog._id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const comments = await response.json();
      setComments(comments);
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
      } else {
        console.error("Unknown error:", error);
      }
    }
  }, [blog._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const timeAgo = (date: string): string => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const weeks = Math.floor(diffInSeconds / 604800);

    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleVote = async (action: 'like' | 'dislike', id: string) => {
    if (!session) {
      console.log("User is not logged in");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("action", action);

      const response = await fetch(`/api/comments/vote/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }
      fetchData();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const post = blog._id;

    if (!comment.trim()) {
      console.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/comments/postComments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment, post }),
      });

      if (response.ok) {
        fetchData();
        setComment('');
      } else {
        console.error('Error submitting comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const getlikeColor = (comment: comment) => {
    return comment.likes.some(user => user.email === session?.user?.email) ? 'blue' : '#9CA3AF';
  };

  return (
    <div className='w-full border-2 p-8 rounded-lg flex flex-col gap-4 bg-[#EFEFEF]'>
      <p className='text-4xl font-bold'>Comments</p>
      {session?.user ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <textarea
            value={comment}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 h-40"
            required
          />
          <button type="submit" className='text-xs px-4 py-2 rounded-md bg-gray-600 text-white'>
            Comment
          </button>
        </form>
      ) : (
        <Link href="/signin" className='bg-[#15335E] w-full p-4 text-white font-bold uppercase text-4xl rounded-md text-center hover:bg-gray-500'>
          Sign in
        </Link>
      )}
      <div className='flex flex-col gap-4'>
        <p className='text-4xl max-md:text-xl'>{comments.length} comments</p>
        {comments.map((comment) => (
          <div key={comment._id} className="flex flex-col gap-3">
            <div>
              <p className='text-xl font-bold'>{comment.user.username}</p>
              <p className='text-sm text-gray-400'>{timeAgo(comment.createdAt)}</p>
            </div>
            <p className='text-sm'>{comment.text}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => handleVote('like', comment._id)}>
                <AiOutlineLike size={17} color={getlikeColor(comment)} />
              </button>
              <p className="text-md max-md:text-xs text-[#525566]">
                {comment.likes.length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogComment;
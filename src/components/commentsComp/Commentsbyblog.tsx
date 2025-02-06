import React from 'react';
import { FaReply, FaTrash } from 'react-icons/fa';

interface CommentsbyblogProps {
  addedComments: blogData[];
  heildId: (id: string) => void;
  handleDeleteClick: (id: string, text: string) => void;
  handleDeleteClickRepaly: (id: string, reply: string) => void;
}

interface blogData {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  user: user;
  reply: string;
}

interface user {
  _id: string;
  username: string;
}

const Commentsbyblog: React.FC<CommentsbyblogProps> = ({
  addedComments,
  heildId,
  handleDeleteClick,
  handleDeleteClickRepaly,
}) => {
  return (
    <div className="space-y-8">
      {addedComments.map((comment) => (
        <div key={comment._id} className="p-6">
          {/* Review Section */}
          <div className="flex items-center gap-4">
            {/* Left Side: Name */}
            <span className="text-base font-semibold text-gray-900">{comment.name}</span>

            {/* Rating and Review Text */}
           
          </div>

          {/* Right Side: Date */}
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            at{' '}
            {new Date(comment.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </span>

          <p className="mt-2 text-sm text-gray-700 leading-6">{comment.text}</p>

          {/* Action Buttons */}
          <div className="flex space-x-4 text-xs mt-3 text-gray-500">
            <button
              onClick={() => heildId(comment._id)}
              className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            >
              <FaReply className="w-4 h-4" /> Reply
            </button>
            <button
              onClick={() => handleDeleteClick(comment._id, comment.text)}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <FaTrash className="w-4 h-4" /> Delete
            </button>
          </div>

          {/* Reply Section */}
          {comment.reply && (
            <div className="mt-4 pl-10 border-l-2 border-gray-200">
              <div className="flex gap-4 items-start">
                <span className="text-sm font-semibold text-gray-800">{comment?.user?.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(comment.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 leading-6">{comment.reply}</p>

              {/* Action Buttons for Reply */}
              <div className="flex space-x-4 text-xs mt-3 text-gray-500">
                <button
                  onClick={() => handleDeleteClickRepaly(comment._id, comment.reply)}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <FaTrash className="w-4 h-4" /> Delete Reply
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Commentsbyblog;

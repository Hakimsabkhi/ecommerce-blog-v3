import React from 'react';
import { FaStar, FaReply, FaTrash } from 'react-icons/fa';

interface ReviewsbyproductProps {
  addedReviews: ReviewData[];
  heildId: (id: string) => void;
  handleDeleteClick: (id: string, text: string) => void;
  handleDeleteClickRepaly: (id: string, reply: string) => void;
}

interface ReviewData {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  text: string;
  user: user;
  reply: string;
}

interface user {
  _id: string;
  username: string;
}

const Reviewsbyproduct: React.FC<ReviewsbyproductProps> = ({
  addedReviews,
  heildId,
  handleDeleteClick,
  handleDeleteClickRepaly,
}) => {
  return (
    <div className="space-y-8">
      {addedReviews.map((review) => (
        <div key={review._id} className="p-6">
          {/* Review Section */}
          <div className="flex items-center gap-4">
            {/* Left Side: Name */}
            <span className="text-base font-semibold text-gray-900">{review.name}</span>

            {/* Rating and Review Text */}
            <div className="flex items-center">
              <div className="flex items-center text-yellow-500">
                {[...Array(review.rating)].map((_, index) => (
                  <FaStar key={index} />
                ))}
                {[...Array(5 - review.rating)].map((_, index) => (
                  <FaStar key={index + review.rating} className="text-gray-300" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Date */}
          <span className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            at{' '}
            {new Date(review.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </span>

          <p className="mt-2 text-sm text-gray-700 leading-6">{review.text}</p>

          {/* Action Buttons */}
          <div className="flex space-x-4 text-xs mt-3 text-gray-500">
            <button
              onClick={() => heildId(review._id)}
              className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            >
              <FaReply className="w-4 h-4" /> Reply
            </button>
            <button
              onClick={() => handleDeleteClick(review._id, review.text)}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <FaTrash className="w-4 h-4" /> Delete
            </button>
          </div>

          {/* Reply Section */}
          {review.reply && (
            <div className="mt-4 pl-10 border-l-2 border-gray-200">
              <div className="flex gap-4 items-start">
                <span className="text-sm font-semibold text-gray-800">{review?.user?.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(review.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(review.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 leading-6">{review.reply}</p>

              {/* Action Buttons for Reply */}
              <div className="flex space-x-4 text-xs mt-3 text-gray-500">
                <button
                  onClick={() => handleDeleteClickRepaly(review._id, review.reply)}
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

export default Reviewsbyproduct;

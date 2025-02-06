"use client";
import React, { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Review {
  _id: string;
  name: string;
  email: string;
  text: string;
  reply: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsProps {
  productId: string;
  /** When true, only a rating summary is displayed */
  summary?: boolean;
}

const fetchReviews = async (productId: string): Promise<Review[]> => {
  if (!productId) {
    throw new Error("Product ID is required");
  }
  const response = await fetch(`/api/review/getAllReviewByProduct?id=${productId}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

const Reviews: React.FC<ReviewsProps> = ({ productId, summary = false }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchReviews(productId);
        setReviews(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadReviews();
    }
  }, [productId]);

  // Helper to calculate average rating
  const getAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const averageRating = getAverageRating();

  // Helper to render star icons based on a rating value
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      if (starValue <= rating) {
        return <FaStar key={index} />;
      } else if (starValue - 0.5 <= rating) {
        return <FaStarHalfAlt key={index} />;
      } else {
        return <FaRegStar key={index} />;
      }
    });

  // While waiting for data, show animated (pulsing) stars
  if (loading) {
    return (
      <div className="reviews-summary flex items-center gap-2">
        <div className="stars flex text-secondary text-xl text-center">
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} className="animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // If there was an error, display it
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // If summary mode is enabled, render only the rating summary
  if (summary) {
    return (
      <div className="reviews-summary flex items-center gap-2">
        <div className="stars flex text-secondary text-xl">
          {renderStars(averageRating)}
        </div>
        <p className="text-sm">
          {averageRating.toFixed(1)} / 5 ({reviews.length})
        </p>
      </div>
    );
  }

  // Otherwise, render the full reviews list
  return (
    <div className="reviews-component p-4 border-t mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="rating-summary flex items-center gap-2 mb-4">
        <div className="stars text-secondary text-xl">{renderStars(averageRating)}</div>
        <p>
          {averageRating.toFixed(1)} out of 5 ({reviews.length}{" "}
          {reviews.length === 1 ? "review" : "reviews"})
        </p>
      </div>
      <div className="reviews-list space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="review p-4 border rounded">
            <h3 className="font-semibold">{review.name}</h3>
            <div className="stars text-secondary">{renderStars(review.rating)}</div>
            <p className="mt-2">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;

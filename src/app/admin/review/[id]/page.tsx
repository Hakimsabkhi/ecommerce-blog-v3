"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Reviewsbyproduct from "@/components/ReviewComp/Reviewsbyproduct";
import FormReply from "@/components/ReviewComp/Formreplay";
import DeletePopup from "@/components/Popup/DeletePopup";
import LoadingSpinner from "@/components/LoadingSpinner";

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

const ListReview: React.FC = () => {
  const { id: productId } = useParams<{ id?: string }>();
  const [addedReviews, setAddedReviews] = useState<ReviewData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ids, setIds] = useState("");
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState<string | null>(null); // Track which review's reply form is open
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenRepaly, setIsPopupOpenRepaly] = useState(false);

  const getReviews = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await fetch(
        `/api/review/admin/getAllReviewByProduct?id=${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 0 },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setAddedReviews(data);
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
        setError(error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
        setError(error);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const handleDeleteClick = (id: string, name: string) => {
    setIds(id);
    setName(name);
    setIsPopupOpen(true);
  };

  const handleClosePopupRepaly = () => {
    setIsPopupOpenRepaly(false);
  };

  const handleDeleteClickRepaly = (id: string, name: string) => {
    setIds(id);
    setName(name);
    setIsPopupOpenRepaly(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleDeleteReply = async (id: string) => {
    try {
      const formData = new FormData();
      formData.append("reply", "");
      const response = await fetch(`/api/review/admin/updateReviwerById/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error deleting review reply");
      }
      setIsPopupOpenRepaly(false);
      getReviews(); // Call your function to refresh the review list
    } catch (error) {
      console.error("Error deleting review reply:", error);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      const response = await fetch(`/api/review/admin/deleteReviwerById/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      toast.success("Review deleted successfully!");
      handleClosePopup();
      getReviews();
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
        setError(error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
        setError(error);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    } 
  };

  const handleReplyClick = (id: string) => {
    setIsOpen(id); // Open the reply form for the specific review
  };

  const closeReplyForm = () => {
    setIsOpen(null); // Close all reply forms
  };

  useEffect(() => {
    getReviews();
  }, [getReviews]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="py-2 relative">
      <div className="w-[50%] px-4 md:px-8 lg-6 mx-auto">
        <h2 className="font-manrope font-bold text-4xl text-black text-center mb-11 uppercase mt-4">
          Clients Reviews
        </h2>

        {/* Render the reviews */}
        {addedReviews.map((review) => (
          <div key={review._id}>
            <Reviewsbyproduct
              addedReviews={[review]}
              heildId={handleReplyClick}
              handleDeleteClick={handleDeleteClick}
              handleDeleteClickRepaly={handleDeleteClickRepaly}
            />

            {/* Render the reply form conditionally below the specific review */}
            {isOpen === review._id && (
              <FormReply id={review._id} close={closeReplyForm} getReviews={getReviews} />
            )}
          </div>
        ))}

        {/* Popup Components */}
        {isPopupOpenRepaly && (
          <DeletePopup
            handleClosePopup={handleClosePopupRepaly}
            Delete={handleDeleteReply}
            id={ids}
            name={name}
          />
        )}
        {isPopupOpen && (
          <DeletePopup
            handleClosePopup={handleClosePopup}
            Delete={handleDeleteConfirm}
            id={ids}
            name={name}
          />
        )}
      </div>
    </div>
  );
};

export default ListReview;

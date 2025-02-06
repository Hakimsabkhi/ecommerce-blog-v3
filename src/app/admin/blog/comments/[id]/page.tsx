"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Commentsbyblog from "@/components/commentsComp/Commentsbyblog";
import FormReply from "@/components/commentsComp/Formreplay";
import DeletePopup from "@/components/Popup/DeletePopup";
import LoadingSpinner from "@/components/LoadingSpinner";

interface commentsData {
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

const ListReview: React.FC = () => {
  const { id: blogId } = useParams<{ id?: string }>();
  const [addedComments, setAddedComments] = useState<commentsData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ids, setIds] = useState("");
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState<string | null>(null); // Track which comments's reply form is open
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenRepaly, setIsPopupOpenRepaly] = useState(false);

  const getComments = useCallback(async () => {
    if (!blogId) return;

    try {
      const response = await fetch(
        `/api/comments/admin/getAllcommentBypost?id=${blogId}`,
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
      console.log(data)
      setAddedComments(data);
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
  }, [blogId]);

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
      const response = await fetch(`/api/comments/admin/updatecommentById/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error deleting comments reply");
      }
      setIsPopupOpenRepaly(false);
      getComments(); // Call your function to refresh the comments list
    } catch (error) {
      console.error("Error deleting comments reply:", error);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/admin/deletecommentById/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete Comments");
      }
      toast.success("Comments deleted successfully!");
      handleClosePopup();
      getComments();
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
    setIsOpen(id); // Open the reply form for the specific comments
  };

  const closeReplyForm = () => {
    setIsOpen(null); // Close all reply forms
  };

  useEffect(() => {
    getComments();
  }, [getComments]);

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
          Clients comments
        </h2>

        {/* Render the reviews */}
        {addedComments.map((comment) => (
          <div key={comment._id}>
            <Commentsbyblog
              addedComments={[comment]}
              heildId={handleReplyClick}
              handleDeleteClick={handleDeleteClick}
              handleDeleteClickRepaly={handleDeleteClickRepaly}
            />

            {/* Render the reply form conditionally below the specific comments */}
            {isOpen === comment._id && (
              <FormReply id={comment._id} close={closeReplyForm} getComments={getComments} />
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

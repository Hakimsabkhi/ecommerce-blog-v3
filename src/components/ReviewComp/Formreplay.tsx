import React, { useRef } from 'react';
interface FormReplyProps {
  id: string;
  close: () => void;
  getReviews: () => void;
}

const FormReply: React.FC<FormReplyProps> = ({ id, close, getReviews }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reply = formData.get("reply")?.toString();

    if (reply) {
      try {
        const response = await fetch(`/api/review/admin/updateReviwerById/${id}`, {
          method: "PUT",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Error updating review reply");
        }
        close();
        getReviews();
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error updating review reply:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget.form;
      form?.requestSubmit();
      close();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <form onSubmit={handleReplySubmit}>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              className="w-full p-3 h-20 resize-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              name="reply"
              placeholder="Write a comment..."
              onKeyDown={handleKeyDown}
            />
            <div className="flex items-center justify-between mt-2">
          
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
              >
                Post Message
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormReply;

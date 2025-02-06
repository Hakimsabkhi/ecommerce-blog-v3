"use client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import Link from "next/link";
const AddCategory = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      setError("Name are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
   

    try {
      const response = await fetch("/api/blog/PostCategory/admin/postCategory", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error posting category");
      }
      
      toast.success(`Category ${name} Add successfully!`);
      router.push("/admin/blog/post-category");
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Safe to access error.message
        console.error(error.message);
      } else {
        // Handle unexpected error types
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div className="mx-auto w-[90%] max-xl:w-[90%] py-8 max-lg:pt-20 flex flex-col gap-8">
      <p className="text-3xl font-bold uppercase">ADD categories for Blog</p>
      <form
        onSubmit={handleSubmit}
        className="flex max-lg:flex-col max-lg:gap-4 lg:items-center gap-4"
      >
        <div className="flex items-center w-[40%] max-lg:w-full gap-6 justify-between">
          <p className="text-xl max-lg:text-base font-bold">Name*</p>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[80%] block p-2.5"
            required
          />
        </div>   
        <div className="w-[20%] max-xl:w-[30%] max-md:w-[50%] items-start">
          <button
            type="submit"
            className="bg-gray-800 text-white rounded-md w-full hover:bg-gray-600 h-10"
          >
            <p className="text-white uppercase">Add </p>
          </button>
        </div>
        <div className="w-[20%] max-xl:w-[30%] max-md:w-[50%] items-start">
          <Link href="/admin/blog/post-category">
            <button className="bg-white border-2 border-gray-400 text-black hover:bg-slate-600 hover:border-0 hover:text-white rounded-md w-full h-10 flex items-center justify-center">
              <p className="font-bold uppercase">Cancel</p>
            </button>
          </Link>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AddCategory;

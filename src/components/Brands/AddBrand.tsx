"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
const AddBrand = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImagePreview(objectUrl);

      // Clean up object URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  useEffect(() => {
    if (icon) {
      const objectUrl = URL.createObjectURL(icon);
      setIconPreview(objectUrl);

      // Clean up object URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [icon]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlace(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIcon(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !image || !icon) {
      setError("Name, image, and icon are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    formData.append("logo", icon);
    formData.append("place", place);

    try {
      const response = await fetch("/api/brand/admin/postBrand", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success(`Brand ${name} Add successfully!`);
      await response.json(); // or await response.text() if you expect text response

      router.push("/admin/brand");
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

  return (
    <div className="mx-auto w-[90%] max-xl:w-[90%] py-8 max-lg:pt-20 flex flex-col gap-8">
      <p className="text-3xl font-bold">Add Brand</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-lg:gap-4 lg:items-center gap-4"
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
        <div className="flex items-center w-[40%] max-lg:w-full gap-6 justify-between">
          <p className="text-xl max-lg:text-base font-bold">Place*</p>
          <input
            type="text"
            value={place}
            onChange={handlePlaceChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[80%] block p-2.5"
            required
          />
        </div>
        <div className="flex items-center w-[30%] max-lg:w-full justify-between">
          <p className="max-lg:text-base font-bold">Upload Image*</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="upload-image"
          />
          <label
            htmlFor="upload-image"
            className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[50%] h-10 border-2 flex items-center justify-center cursor-pointer"
          >
            Select an Image
          </label>
          {imagePreview && (
            <div className="w-[15%] max-lg:w-full">
              <Image
                src={imagePreview}
                alt="Image preview"
                className="w-full h-auto mt-4"
                width={50}
                height={50}
              />
            </div>
          )}
        </div>
        <div className="flex items-center w-[30%] max-lg:w-full justify-between">
          <p className="max-lg:text-base font-bold">Upload Icon*</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleIconChange}
            className="hidden"
            id="upload-icon"
          />
          <label
            htmlFor="upload-icon"
            className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[50%] h-10 border-2 flex items-center justify-center cursor-pointer"
          >
            Select an Icon
          </label>
          {iconPreview && (
            <div className="w-[15%] max-lg:w-full">
              <Image
                src={iconPreview}
                alt="Icon preview"
                className="w-full h-auto mt-4"
                width={50}
                height={50}
              />
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 pt-4 w-full lg:w-4/5">
          
          <div className="w-[30%] items-start">
            <Link href="/admin/brand">
              <button className="bg-white border-2 border-gray-400 hover:bg-gray-600 hover:border-0 hover:text-white rounded-md w-full h-10 flex items-center justify-center">
                <p className=" font-bold">Cancel</p>
              </button>
            </Link>
          </div>
          <div className="w-[30%] items-start">
            <button
              type="submit"
              className="bg-gray-800 text-white hover:bg-gray-600 rounded-md w-full  h-10"
            >
              <p className="text-white">Add Brand</p>
            </button>
          </div>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AddBrand;

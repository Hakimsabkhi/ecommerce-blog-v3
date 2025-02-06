"use client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
const AddCategory = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
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

  useEffect(() => {
    if (banner) {
      const objectUrl = URL.createObjectURL(banner);
      setBannerPreview(objectUrl);

      // Clean up object URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [banner]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
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

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBanner(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !image || !icon || !banner) {
      setError("Name, image, icon, and banner are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
    formData.append("logo", icon); // Correctly naming the field
    formData.append("banner", banner); // Added banner field

    try {
      const response = await fetch("/api/category/postCategory", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error posting category");
      }

      toast.success(`Category ${name} Add successfully!`);
      router.push("/admin/category");
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
    <div className="flex flex-col gap-8  mx-auto w-[90%] py-8 ">
      <p className="text-3xl font-bold">ADD categories</p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mx-auto gap-4 w-full lg:w-3/5"
      >
        <div className="flex items-center gap-6 w-full justify-between">
          <p className="text-xl max-lg:text-base font-bold">Name*</p>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
            required
          />
        </div>
        <div className="flex  w-full items-center justify-between">
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
            <div className="w-[50%] max-lg:w-full">
              <Image
                src={imagePreview}
                alt="Image preview"
                className="w-full h-auto mt-4"
                width={500}
                height={500}
              />
            </div>
          )}
        </div>
        <div className="flex  w-full  items-center  justify-between">
          <p className="max-lg:text-base font-bold">Upload Icon*</p>
          <input
            type="file"
            accept="image/svg+xml"
            onChange={handleIconChange}
            className="hidden"
            id="upload-icon"
          />
          <label
            htmlFor="upload-icon"
            className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[50%] h-10 border-2 flex items-center justify-center cursor-pointer"
          >
            Select an Icon Type SVG
          </label>
          {iconPreview && (
            <div className="w-[50%] max-lg:w-full">
              <Image
                src={iconPreview}
                alt="Icon preview"
                className="w-full h-auto mt-4"
                width={500}
                height={500}
              />
            </div>
          )}
        </div>
        <div className="flex items-center  w-full   justify-between">
          <p className="max-lg:text-base font-bold">Upload Banner*</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
            id="upload-banner"
          />
          <label
            htmlFor="upload-banner"
            className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-1/2 h-10 border-2 flex items-center justify-center cursor-pointer"
          >
            Select a Banner
          </label>
          {bannerPreview && (
            <div className="w-[50%] max-lg:w-full">
              <Image
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-auto mt-4"
                width={500}
                height={500}
              />
            </div>
          )}
        </div>
        <div className="flex w-full justify-center gap-4 px-20">
          <Link
          className="w-1/2" href="/admin/category">
            <button className="w-full  rounded-md border-2 font-light  h-10
             ">
              <p className="font-bold">Cancel</p>
            </button>
          </Link>
          <button
            type="submit"
            className="w-1/2 bg-gray-800 text-white rounded-md  hover:bg-gray-600 h-10"
          >
            <p className="text-white">Add category</p>
          </button>
        
          
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AddCategory;

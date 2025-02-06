"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

interface BrandData {
  name: string;
  place: string;
  imageUrl: string;
  logoUrl: string;
}

const ModifyBrand = () => {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [brandData, setBrandData] = useState<BrandData>({
    name: "",
    place: "",
    imageUrl: "",
    logoUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Initially loading is true

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await fetch(
          `/api/brand/admin/getBrandById/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Error fetching brand data");
        }
        const data = await response.json();
        setBrandData(data);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchBrandData();
  }, [params.id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setImageUrl(url); // Create an object URL for the image
    }
  };

  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedIcon(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setIconUrl(url); // Create an object URL for the image
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", brandData.name);
    formData.append("place", brandData.place);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    if (selectedIcon) {
      formData.append("logo", selectedIcon);
    }

    try {
      const response = await fetch(
        `/api/brand/admin/updateBrand/${params.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error updating brand");
      }
      toast.success(`Brand ${brandData.name} modified successfully!`);
      router.push("/admin/brand");
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="relative w-[80%] h-full mx-auto my-[20px] flex flex-col">
      <p className="text-3xl font-bold">Modify Brand</p>
      {loading ? (
        <div className="my-10 flex items-center justify-center h-[50%]">
          <FaSpinner className="animate-spin text-gray-800 text-4xl" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="my-10 grid grid-cols-2 gap-10 h-[50%]">
          <div className="flex items-center gap-10">
            <p className="text-xl max-lg:text-base font-bold">Name*</p>
            <input
              type="text"
              name="name"
              value={brandData.name}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full block p-2.5"
              required
            />
          </div>
          <div className="flex items-center gap-10">
            <p className="text-xl max-lg:text-base font-bold">Place*</p>
            <input
              type="text"
              name="place"
              value={brandData.place}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full block p-2.5"
              required
            />
          </div>
          <div className="flex flex-col gap-[10px] items-center max-lg:w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Upload Image</p>
            {brandData.imageUrl && !selectedImage && (
              <Image
                src={brandData.imageUrl}
                alt="Current Image"
                width={100}
                height={100}
                className="rounded-md w-[200px] h-[200px]"
              />
            )}
            {imageUrl && <Image
                src={imageUrl}
                alt="Current Image"
                width={100}
                height={100}
                className="rounded-md w-[200px] h-[200px]"
              />}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="upload-image"
              onChange={handleImageChange}
            />
            <label
              htmlFor="upload-image"
              className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[50%] h-10 border-2 flex items-center justify-center cursor-pointer"
            >
              Select an Image
            </label>
          </div>
          <div className="flex flex-col gap-[10px] items-center max-lg:w-full justify-between">
            <p className="text-xl max-lg:text-base font-bold">Upload Icon</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="upload-icon"
              onChange={handleIconChange}
            />
            {brandData.logoUrl && !selectedIcon && (
              <Image
                src={brandData.logoUrl}
                alt="Current Icon"
                width={50}
                height={50}
                className="rounded-md w-[200px] h-[200px]"
              />
            )}
             {iconUrl && <Image
                src={iconUrl}
                alt="Current Image"
                width={100}
                height={100}
                className="rounded-md w-[200px] h-[200px]"
              />}
            <label
              htmlFor="upload-icon"
              className="bg-[#EFEFEF] max-xl:text-xs text-black rounded-md w-[50%] h-10 border-2 flex items-center justify-center cursor-pointer"
            >
              Select an Icon
            </label>
          </div>
    
    
      <div className="flex gap-[10px] justify-center col-span-2">
        <button
          type="submit"
          className="bg-gray-800 w-[300px] text-white hover:bg-gray-600 rounded-md h-10"
        >
          Modify
        </button>
        <Link href="/admin/brand">
          <button className="bg-white border-2 w-[300px] border-gray-400 hover:bg-gray-600 hover:border-0 hover:text-white rounded-md h-10 flex items-center justify-center">
            Cancel
          </button>
        </Link>
      </div>
      </form> )}
    </div>
  );
};

export default ModifyBrand;

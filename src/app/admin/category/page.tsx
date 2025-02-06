"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaRegEdit, FaRegEye, FaSpinner, FaTrashAlt } from "react-icons/fa";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";
import useIs2xl from "@/hooks/useIs2x";

type Category = {
  _id: string;
  name: string;
  imageUrl: string;
  logoUrl: string;
  user: { _id: string; username: string };
  slug: string;
  vadmin: string;
  createdAt: Date;
  updatedAt: Date;
};

const AddedCategories: React.FC = () => {
  const [addedCategory, setAddedCategory] = useState<Category[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  
  const [colSpan, setColSpan] = useState(5);

  const is2xl = useIs2xl();
  const categoriesPerPage =is2xl ? 7 : 5;

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCategory(null);
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `/api/category/admin/deleteCategory/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Remove the deleted category from the state
      setAddedCategory((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId)
      );

      toast.success("Category deleted successfully!");
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
    }  finally {
      handleClosePopup();
    }
  };
  const updateCategoryvadmin = async (
    categoryId: string,
    newStatus: string
  ) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(
        `/api/category/admin/updateCategoryvadmin/${categoryId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setAddedCategory((prevData) =>
        prevData.map((item) =>
          item._id === categoryId ? { ...item, vadmin: newStatus } : item
        )
      );
      const data = await response.json();
      console.log("Product status updated successfully:", data);
    } catch (error) {
      console.error("Failed to update product status:", error);
      toast.error("Failed to update product status");
    }
  };
  useEffect(() => {
    const updateColSpan = () => {
      const isSmallestScreen = window.innerWidth <= 640; // max-sm
      const isSmallScreen = window.innerWidth <= 768; // max-md
      const isMediumScreen = window.innerWidth <= 1024; // max-lg

      if (isSmallestScreen) {
        setColSpan(2); // max-sm: colSpan = 3
      } else if (isSmallScreen) {
        setColSpan(3); // max-md: colSpan = 4
      } else if (isMediumScreen) {
        setColSpan(4); // max-lg: colSpan = 5
      } else {
        setColSpan(5); // Default: colSpan = 6
      }
    };

    // Initial check
    updateColSpan();

    // Add event listener
    window.addEventListener("resize", updateColSpan);

    // Cleanup event listener
    return () => window.removeEventListener("resize", updateColSpan);
  }, []);
  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await fetch("/api/category/admin/getAllCategoryAdmin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setAddedCategory(data);
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
    };
    getCategory();
  }, []);

  const filteredCategory = useMemo(() => {
    return addedCategory.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, addedCategory]);

  const currentCategories = useMemo(() => {
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    return filteredCategory.slice(indexOfFirstCategory, indexOfLastCategory);
  }, [currentPage, filteredCategory, categoriesPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredCategory.length / categoriesPerPage);
  }, [filteredCategory.length, categoriesPerPage]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  
    

  return (
    <div className="mx-auto w-[90%]  flex flex-col gap-4">
      <div className="flex items-center justify-between h-[80px] ">
        <p className="text-3xl max-sm:text-sm font-bold">ALL Post Categories</p>
        <div className="flex gap-2">
        <Link href="category/costmize">
        <button className='bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4'>
       Costmize Category
          </button>
        </Link>
        <Link href="category/addcategory">
        <button className='bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4'>
        Add category
          </button>
        </Link>
        </div>
      </div>

      <div className="h-[50px] flex items-center ">
      <input
        type="text"
        placeholder="Search categories"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg max-w-max"
      />
      </div>
      
      <div className="max-md:hidden max-2xl:h-80 h-[50vh]">
      <table className="w-full rounded overflow-hidden table-fixed">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 border-r-white py-3 max-sm:w-1/5 w-[5%] max-sm:hidden">Icon</th>
            <th className="px-4 text-left border-r-white py-3 max-sm:w-1/4 w-[20%] max-md:hidden">ImageURL</th>
            <th className="px-4 text-left border-r-white py-3 max-md:w-1/4 w-[12%]">Name</th>
            <th className="px-4 text-left border-r-white py-3 w-[13%] max-lg:hidden">Created By</th>
            <th className="px-4 text-center border-r-white py-3   md:w-[30%]">Action</th>
          </tr>
        </thead>

        {loading ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px]" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) :    filteredCategory.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucune categorie trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
        <tbody>
          {currentCategories.map((category) => (
            <tr key={category._id} className="even:bg-gray-100 odd:bg-white">
              <td className="border px-4 py-2 max-sm:hidden">
                <Image
                  src={category.logoUrl}
                  width={30}
                  height={30}
                  alt="icon"
                />
              </td>
              <td className="border px-4 py-2 max-md:hidden truncate">
                <Link href={category.imageUrl}>
                  {category.imageUrl.split("/").pop()}
                </Link>
              </td>
              <td className="border px-4 py-2 truncate">{category.name}</td>
              <td className="border px-4 py-2 max-lg:hidden">{category?.user?.username}</td>
              
              <td className="flex gap-2 justify-center">
                <div className="flex justify-center gap-2 ">
                  <select
                    className={`w-32 text-black rounded-md h-10 ${
                      category.vadmin === "not-approve"
                        ? "bg-gray-400 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    value={category.vadmin}
                    onChange={(e) =>
                      updateCategoryvadmin(category._id, e.target.value)
                    }
                  >
                    <option value="approve" className="text-white uppercase">
                      approve
                    </option>
                    <option
                      value="not-approve"
                      className="text-white uppercase"
                    >
                      Not approve
                    </option>
                  </select>
                  <Link href={`/admin/category/${category._id}`}>
                    <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                    <FaRegEdit />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="bg-gray-800 text-white pl-3 w-10 min-w-10 h-10 hover:bg-gray-600 rounded-md"
                    disabled={selectedCategory?._id === category._id}
                  >
                    {selectedCategory?._id === category._id
                      ? "Processing..."
                      : <FaTrashAlt />}
                  </button>

                  <Link
                    href={`/${category.vadmin === "approve" ? "" : "admin/"}${
                      category.slug
                    }`}
                  >
                    <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                      <FaRegEye />
                    </button>
                  </Link>
                  
                </div>
              </td>
            </tr>
          ))}
        </tbody> )}
      </table> </div>
      <div className="md:hidden flex flex-col gap-4">
        {currentCategories.map((category) => (
          <div
            key={category._id}
            className="p-4 mb-4 bg-gray-100 rounded shadow-md"
          >
            <div className="flex items-center justify-center gap-4">
              <Image
                src={category.logoUrl}
                width={50}
                height={50}
                alt="category logo"
                className="rounded-full"
              />
              <div>
                <p className="font-bold text-lg">{category.name}</p>
                <p className="text-sm text-gray-600">
                  Created by: {category?.user?.username}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
            <div className="flex flex-col gap-2 w-3/5 mx-auto">
                  <select
                    className={` text-black rounded-md p-2 ${
                      category.vadmin === "not-approve"
                        ? "bg-gray-400 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    value={category.vadmin}
                    onChange={(e) =>
                      updateCategoryvadmin(category._id, e.target.value)
                    }
                  >
                    <option value="approve" className="text-white uppercase">
                      approve
                    </option>
                    <option
                      value="not-approve"
                      className="text-white uppercase"
                    >
                      Not approve
                    </option>
                  </select>
                  
                  <div className="flex gap-2 justify-center">
                  <Link href={`/admin/category/${category._id}`}>
                    <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                    <FaRegEdit />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="bg-gray-800 text-white pl-3 w-10 min-w-10 h-10 hover:bg-gray-600 rounded-md"
                    disabled={selectedCategory?._id === category._id}
                  >
                    {selectedCategory?._id === category._id
                      ? "Processing..."
                      : <FaTrashAlt />}
                  </button>

                  <Link
                    href={`/${category.vadmin === "approve" ? "" : "admin/"}${
                      category.slug
                    }`}
                  >
                    <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                      <FaRegEye />
                    </button>
                  </Link>
                  <Link href={`/admin/category/subcategory/${category._id}`}>
                    <button className="bg-gray-800 text-white  w-32 h-10 hover:bg-gray-600 rounded-md">
                     Sub Category
                    </button>
                  </Link>
                  </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {isPopupOpen && selectedCategory && (
        <DeletePopup
          handleClosePopup={handleClosePopup}
          Delete={deleteCategory}
          id={selectedCategory._id}
          name={selectedCategory.name}
        />
      )}
    </div>
  );
};

export default AddedCategories;

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import DeletePopup from "@/components/Popup/DeletePopup";
import { FaSpinner } from "react-icons/fa6";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";



type Post = {
  _id: string;
  name: string;
  user:user;
  vadmin:string;
  slug:string;
  createdAt: Date;
  updatedAt: Date;
};

interface user{
_id:string;
username:string;
}

const AddedCategories: React.FC = () => {
  const [addedCategory, setAddedCategory] = useState<Post[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<Post[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const categoriesPerPage = 5; // Number of categories to display per page
  const [loading, setLoading] = useState(true);
  const [selectedCatgory, setSelectedCatgory] = useState({ id: "", name: "" });
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
  const handleDeleteClick = (Category: Post) => {
    setLoadingCategoryId(Category._id); 
    setSelectedCatgory({ id: Category._id, name: Category.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingCategoryId(null);
  };

  const DeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `/api/blog/PostCategory/admin/deleteCategory/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      handleClosePopup();
      getCategory();
      toast.success("Category delete successfully!");
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
      setLoadingCategoryId(null);
    }
  };

  const getCategory = async () => {
    try {
      const response = await fetch("/api/blog/PostCategory/admin/getAllCategory");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setAddedCategory(data);
      setFilteredCategory(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Safe to access error.message
        console.error(error.message);
      } else {
        // Handle unexpected error types
        console.error('An unexpected error occurred:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  const updatePostCategoryStatus = async (blogId: string, newStatus: string) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(`/api/blog/PostCategory/admin/updatePostCategoryStatus/${blogId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      setAddedCategory((prevData) =>
        prevData.map((item) =>
          item._id === blogId ? { ...item, vadmin: newStatus } : item
        )
      );
 
      const data = await response.json();
      console.log("Blog status updated successfully:", data);
    } catch (error) {
      console.error("Failed to update blog status:", error);
      toast.error("Failed to update blog status");
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    const filtered = addedCategory.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategory(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, addedCategory]);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategory.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategory.length / categoriesPerPage);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
    <div className="flex items-center justify-between h-[80px] ">
      <p className="text-3xl max-sm:text-sm font-bold">ALL Post Categories</p>
        
        
        <Link href="/admin/blog/post-category/addpostcategory" >
        <button className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
          Add a new category
          </button>
        </Link>
        
      </div>
      <div className="h-[50px] flex items-center ">
        <input
          type="text"
          placeholder="Search post categories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg max-w-max"
        />
      </div>
      <div className="h-[50vh] max-2xl:h-80 max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
          <tr className="bg-gray-800 ">
            
            <th className="px-4 py-3 w-1/3">Name</th>
            <th className="px-4 py-3 w-1/3"> Created By</th>
            <th className="px-4 py-3 w-1/3 text-center"> Action</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan={6}>
                <div className="flex justify-center items-center h-full w-full py-6">
                  <FaSpinner className="animate-spin text-[30px]" />
                </div>
              </td>
            </tr>
          </tbody>
        ) : filteredCategory.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={6}>
                <div className="text-center py-6 text-gray-600 w-full">
                  <p>Aucun blog trouvé.</p>
                </div>
              </td>
            </tr>
          </tbody>
        ) : (
        <tbody>
          {currentCategories.map((item, index) => (
            <tr key={index} className="even:bg-gray-100 odd:bg-white">
             <td className="border px-4 py-2 truncate">{item.name}</td>

              <td className="border px-4 py-2 truncate">{item?.user?.username}</td>

              <td className="flex gap-2 justify-center">
                    <div className="flex justify-center gap-2 ">
                <select
                    className={`w-full max-w-32 h-10 text-black rounded-md p-2 truncate ${
                      item.vadmin === "not-approve"
                        ? "bg-gray-400 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    value={item.vadmin}
                    onChange={(e) =>
                      updatePostCategoryStatus(item._id, e.target.value)
                    }
                  >
                    <option value="approve" className="text-white uppercase">
                      Approve
                    </option>
                    <option
                      value="not-approve"
                      className="text-white uppercase"
                    >
                      Not approve
                    </option>
                  </select>
                  <Link href={`/admin/blog/post-category/${item._id}`}>
                    <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                                          <FaRegEdit />
                                        </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="bg-gray-800 text-white pl-3 w-10 min-w-10 h-10 hover:bg-gray-600 rounded-md"
                        disabled={loadingCategoryId === item._id}
                  >
                    {loadingCategoryId ===item._id ? "Processing..." :<FaTrashAlt />}
                  </button>
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={DeleteCategory}
                      id={selectedCatgory.id}
                      name={selectedCatgory.name}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>)}
      </table></div>
      <div className=" md:hidden">
        {currentCategories.map((item, index) => (
          <div
            key={index}
            className="p-4 mb-4 bg-gray-100 rounded shadow-md text-lg"
          >
            <p>Name :&nbsp;{item.name}</p>
            <p>Created By :&nbsp; {item?.user?.username}</p>
            <div className="flex flex-col items-center mt-2 gap-2">
            <select
                    className={`w-full max-w-44 h-10 text-black rounded-md p-2 truncate ${
                      item.vadmin === "not-approve"
                        ? "bg-gray-400 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    value={item.vadmin}
                    onChange={(e) =>
                      updatePostCategoryStatus(item._id, e.target.value)
                    }
                  >
                    <option value="approve" className="text-white uppercase">
                      Approve
                    </option>
                    <option
                      value="not-approve"
                      className="text-white uppercase"
                    >
                      Not approve
                    </option>
                  </select>
              
                  <div className="flex gap-4"> <Link href={`/admin/post-category/${item._id}`}>
                    <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                                          <FaRegEdit />
                                        </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="bg-gray-800 text-white pl-3 w-10 min-w-10 h-10 hover:bg-gray-600 rounded-md"
                        disabled={loadingCategoryId === item._id}
                  >
                    {loadingCategoryId ===item._id ? "Processing..." :<FaTrashAlt />}
                  </button>
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={DeleteCategory}
                      id={selectedCatgory.id}
                      name={selectedCatgory.name}
                    />
                  )}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        
      <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}/>
      </div>
    </div>
  );
};

export default AddedCategories;

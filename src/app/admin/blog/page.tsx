"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { toast } from "react-toastify";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";
import useIs2xl from "@/hooks/useIs2x";
import { FaRegEye, FaSpinner } from "react-icons/fa6";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

type Post = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  user: { _id: string; username: string; role: string };
  slug: string;
  vadmin: string;
  postcategory: PostCategory;
  createdAt: Date;
  updatedAt: Date;
};
interface PostCategory {
  _id: string;
  name: string;
  slug: string;
}

const BlogTable: React.FC = () => {
  const [postlist, setpostlist] = useState<Post[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setselectedPost] = useState<Post | null>(null);

  const is2xl = useIs2xl();
  const blogsPerPage = is2xl ? 7 : 5;

  const handleDeleteClick = (blog: Post) => {
    setselectedPost(blog);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setselectedPost(null);
  };

  const deleteBlog = async (blogId: string) => {
    try {
      const response = await fetch(`/api/blog/admin/DeletePost/${blogId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }
      setpostlist((prevBlogs) =>
        prevBlogs.filter((blog) => blog._id !== blogId)
      );
      toast.success("Blog deleted successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("An error occurred while fetching data.");
        console.error(error.message);
      } else {
        // Handle unexpected error types
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      handleClosePopup();
    }
  };

  const updateBlogStatus = async (blogId: string, newStatus: string) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(`/api/blog/admin/updatePostStatus/${blogId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setpostlist((prevData) =>
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
   const [colSpan, setColSpan] = useState(6);
  
    useEffect(() => {
      const updateColSpan = () => {
        const isSmallScreen = window.matchMedia("(max-width: 768px)").matches; // max-md
        const isMediumScreen = window.matchMedia("(max-width: 1024px)").matches; // max-lg
  
        if (isSmallScreen) {
          setColSpan(4); // max-md: colSpan = 4
        } else if (isMediumScreen) {
          setColSpan(5); // max-lg: colSpan = 5
        } else {
          setColSpan(6); // Default: colSpan = 6
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
    const getBlogs = async () => {
      try {
        const response = await fetch("/api/blog/admin/ListPostadmin", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        console.log(data);
        setpostlist(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Safe to access error.message
          console.error(error.message);
        } else {
          // Handle unexpected error types
          console.error("An unexpected error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    return postlist.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, postlist]);

  const currentBlogs = useMemo(() => {
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    return filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  }, [currentPage, filteredBlogs, blogsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBlogs.length / blogsPerPage);
  }, [filteredBlogs.length, blogsPerPage]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
      <div className="flex items-center justify-between h-[80px] ">
        <p className="text-3xl max-sm:text-sm font-bold">ALL POSTS</p>
        <div>
         
          <Link href="blog/addpost" className="w-full">
          <button className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
            Add New Post
            </button>
          </Link>
        </div>
      </div>
      <div className="h-[50px] flex items-center ">
        <input
          type="text"
          placeholder="Search blogs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg max-w-max"
        />
      </div>
      <div className="h-[50vh] max-2xl:h-80 max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 xl:w-2/12 lg:w-[15%] md:w-1/6">Title</th>
              <th className="px-4 py-3 xl:w-[13%] lg:w-[15%] md:w-1/6">Category</th>
              <th className="px-4 py-3 xl:w-[12%] lg:w-[15%] md:w-1/6">ImageURL</th>
              <th className="px-4 py-3 xl:w-[13%] lg:w-[15%] max-lg:hidden">Author</th>
              <th className="px-4 py-3 xl:w-[12%] max-xl:hidden">Role</th>
              <th className="px-4 py-3 xl:w-4/12 lg:w-[40%] md:w-1/2 text-center">Action</th>
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
          ) : filteredBlogs.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucun blog trouvé.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentBlogs.map((blog) => (
                <tr key={blog._id}  className="even:bg-gray-100 odd:bg-white">
                  <td className="border px-4 py-2 truncate">
                    {blog.title}
                  </td>
                  <td className="border px-4 py-2">
                    {blog.postcategory?.name}
                  </td>
                  <td className="border px-16 py-2">
                    <Link href={blog.imageUrl}>
                      <Image
                        src={blog.imageUrl}
                        alt={blog.title}
                        width={30}
                        height={30} // Makes image fill the container
                        // Ensures image covers the div without stretching/distorting
                        // Optional: rounded corners on the image
                      />
                    </Link>
                  </td>

                  <td className="border px-4 py-2 max-lg:hidden truncate">{blog?.user?.username}</td>
                  <td className="border px-4 py-2 max-xl:hidden">{blog?.user?.role}</td>
                  <td className="flex gap-2 justify-center">
                  <div className="flex justify-center gap-2 ">
                      <select
                        className={`w-32 h-10 text-black rounded-md truncate ${
                          blog.vadmin === "not-approve"
                            ? "bg-gray-400 text-white"
                            : "bg-green-500 text-white"
                        }`}
                        value={blog.vadmin}
                        onChange={(e) =>
                          updateBlogStatus(blog._id, e.target.value)
                        }
                      >
                        <option
                          value="approve"
                          className="text-white uppercase"
                        >
                          Approve
                        </option>
                        <option
                          value="not-approve"
                          className="text-white uppercase"
                        >
                          Not approve
                        </option>
                      </select>
                      <Link href={`/admin/blog/edit/${blog._id}`}>
                        <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                                                  <FaRegEdit/>
                                                </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(blog)}
                        className="bg-gray-800 text-white pl-3 w-10 min-w-10 h-10 hover:bg-gray-600 rounded-md"
                        disabled={selectedPost?._id === blog._id}
                      >
                        {selectedPost?._id === blog._id ? (
                          "Processing..."
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>

                      {blog.postcategory && (
                        <Link
                          href={`/${
                            blog.vadmin === "approve" ? "" : "admin/"
                          }blog/${blog.postcategory.slug}/${blog.slug}`}
                        >
                          <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                            <FaRegEye />
                          </button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="p-4 border rounded-lg shadow-md bg-gray-100  flex flex-col gap-4"
            >
              <div className="text-center ">
               <h3 className="text-2xl  font-semibold">Title : <span className=" font-normal">{blog.title}</span> </h3>
               
              </div>
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                width={300}
                height={200}
                className="rounded-lg mx-auto"
              />
               <div className="flex justify-center gap-2">
                      <select
                        className={`w-50 h-10 text-black rounded-md p-2 truncate ${
                          blog.vadmin === "not-approve"
                            ? "bg-gray-400 text-white"
                            : "bg-green-500 text-white"
                        }`}
                        value={blog.vadmin}
                        onChange={(e) =>
                          updateBlogStatus(blog._id, e.target.value)
                        }
                      >
                        <option
                          value="approve"
                          className="text-white uppercase"
                        >
                          Approve
                        </option>
                        <option
                          value="not-approve"
                          className="text-white uppercase"
                        >
                          Not approve
                        </option>
                      </select>
                      <Link href={`/admin/blog/edit/${blog._id}`}>
                        <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                                                  <FaRegEdit/>
                                                </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(blog)}
                        className="bg-gray-800 text-white pl-3 w-10 min-w-10 h-10 hover:bg-gray-600 rounded-md"
                        disabled={selectedPost?._id === blog._id}
                      >
                        {selectedPost?._id === blog._id ? (
                          "Processing..."
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>

                      {blog.postcategory && (
                        <Link
                          href={`/${
                            blog.vadmin === "approve" ? "" : "admin/"
                          }blog/${blog.postcategory.slug}/${blog.slug}`}
                        >
                          <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                            <FaRegEye />
                          </button>
                        </Link>
                      )}
                    </div>
            </div>
          ))}
        </div>
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {isPopupOpen && selectedPost && (
        <DeletePopup
          handleClosePopup={handleClosePopup}
          Delete={deleteBlog}
          id={selectedPost._id}
          name={selectedPost.title}
        />
      )}
    </div>
  );
};

export default BlogTable;

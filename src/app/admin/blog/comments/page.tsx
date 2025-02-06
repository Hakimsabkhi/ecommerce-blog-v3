"use client";
import React, { useState, useEffect, useMemo } from "react";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa6";


interface Postsecondsubsection {
  secondtitle: string;
  description: string;
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface Postfirstsubsection {
  fisttitle: string;
  description: string;
  Postsecondsubsections: Postsecondsubsection[];
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface blog {
  _id: string;
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  postcategory: postcategory;
  imageUrl: string;
  user: User;
  numbercomment: number;
  createdAt: string;
}
interface User {
  _id: string;
  username: string;
}
interface postcategory {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}
const BlogLikes = () => {
  const [postlist, setPostlist] = useState<blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const blogsPerPage = 5;
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

  const [colSpan, setColSpan] = useState(5);
  
    useEffect(() => {
      const updateColSpan = () => {
        const isSmallScreen = window.innerWidth <= 640; // max-md
        const isMediumScreen = window.innerWidth <= 1024; // max-lg
      
  
        if (isSmallScreen) {
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
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/comments/admin/getpostcomments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        setPostlist(data); // Assuming data is an array of products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    
  }, []);

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
      <div className="flex items-center justify-between h-[80px] ">
        <p className="text-3xl max-sm:text-sm font-bold">List blog comment</p></div>
        
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
            

              <th className="px-4 py-3 w-1/5">Title</th>
              <th className="px-4 py-3 w-1/5 md:max-lg:w-[25%]">Category</th>
              <th className="px-4 py-3 w-1/5">ImageURL</th>
              <th className="px-4 py-3 w-1/5 max-lg:hidden">Author</th>
              
              <th className="px-4 text-center py-3 w-1/5 md:max-lg:w-[35%]">Action</th>
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
            <tr key={blog._id} className="even:bg-gray-100 odd:bg-white">
              <td className="border px-4 py-2 truncate">{blog.title}</td>
              <td className="border px-4 py-2 truncate">{blog.postcategory?.name}</td>
              <td className="border px-4 py-2 max-sm:hidden">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-[40px] relative">
                  {" "}
                  {/* Set a desired height for the div */}
                  <Link href={blog.imageUrl}>
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      quality={100}
                      layout="fill" // Makes image fill the container
                      objectFit="cover" // Ensures image covers the div without stretching/distorting
                      // Optional: rounded corners on the image
                    />
                  </Link>
                </div>
              </td>

              <td className="border px-4 py-2 max-lg:hidden">{blog?.user?.username}</td>

              <td className="flex gap-2 justify-center">
                    <div className="flex justify-center gap-2 ">
                    <Link href={`/admin/blog/comments/${blog._id}`}>
                           <button className="bg-gray-800 text-white w-32 h-10  hover:bg-gray-600 rounded-md uppercase">
                         {blog.numbercomment} Comments
                      </button>
                    </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>)}
      </table></div>
      <div className="flex flex-col gap-4 md:hidden">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="p-4 mb-4 bg-gray-100 rounded shadow-md"
            >
              <div className="flex justify-between">
                <p className="font-bold">{blog.title}</p>
                <p>{blog.postcategory?.name}</p>
              </div>
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                width={100}
                height={100}
                className="rounded-lg"
              />
              <div className="text-right">
                <Link href={`/admin/blog/comments/${blog._id}`}>
                  <button className="bg-gray-800 text-white w-32 h-10  hover:bg-gray-600 rounded-md uppercase">
                         {blog.numbercomment} Comments
                      </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BlogLikes;

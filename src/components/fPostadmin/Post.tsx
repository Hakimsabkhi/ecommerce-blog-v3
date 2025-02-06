"use client";
import React, { useState } from "react";
import Image from "next/image";
import { itemsblog } from "@/assets/data";
import { FaArrowLeft, FaArrowRight, FaReadme } from "react-icons/fa6";
import Link from "next/link";
interface blog {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  postcategory:{slug:string};
  vadmin: string;
  createdAt: string;
}
interface blogprops {
  blogs: blog[];
}

const Blog: React.FC<blogprops> = ({ blogs }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // Adjust the number of items per page as needed

  // Calculate the total number of pages
  const totalPages = Math.ceil(itemsblog.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 800, behavior: "smooth" });
  };

  return (
    <div className="py-8 w-[96%] mx-auto items-center flex flex-col gap-5 justify-center">
      <div className="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 w-full group gap-10     ">
        {blogs.map((item, index) => (
          <div
            key={index}
            className="flex cursor-pointer duration-500  lg:group-hover:scale-[0.95] lg:hover:!scale-100 flex-col items-center relative"
          >
            <div className=" w-full   ">
              <Image
                width={1000}
                height={1000}
                className=" w-full h-80"
                src={item.imageUrl}
                alt=""
              />
            </div>
            <div className="flex flex-col border-x-2 border-b-2 gap-2 items-center bg-white w-full h-64">
              <div className="w-[302px]  max-sm:w-[90%] pt-2">
                <p className="text-[#525566]    ">
                  {new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="flex flex-col  gap-5 max-md:gap-2">
                  <div className="flex flex-col  gap-2">
                    <p className="text-[#525566] text-2xl max-sm:text-xl font-bold line-clamp-2 overflow-hidden">
                      {item.title}
                    </p>
                    <p className="text-[#525566] line-clamp-2 overflow-hidden">
                      {item.description}{" "}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${item.postcategory?.slug}/${item.slug}`}
                    aria-label="read more about blog"
                    className="bg-primary hover:bg-[#15335D] rounded-lg w-full h-14 items-center flex relative justify-center overflow-hidden transition duration-300 ease-out group/box text-white  "
                  >
                    <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform  ease text-xl  ">
                      continue reading
                    </p>
                    <p className="  text-white absolute flex items-center justify-center w-full h-full duration-500 translate-x-[-35%] translate-y-[3%] opacity-0 lg:group-hover/box:opacity-100 ease  ">
                      <FaReadme
                        className="w-8  h-8"
                        aria-hidden="true"
                        fill="currentColor"
                      />
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-x-4 pt-4">
        <div
          className="flex items-center gap-1 cursor-pointer  "
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FaArrowLeft className="cursor-pointer" />
          <p className="text-sm font-semibold">PREVIOUS</p>
        </div>
        {Array.from({ length: totalPages }, (_, i) => (
          <p
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`cursor-pointer text-xs rounded py-2 px-4 ${
              currentPage === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            {i + 1}
          </p>
        ))}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <p className="text-sm font-semibold">NEXT</p>
          <FaArrowRight className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Blog;

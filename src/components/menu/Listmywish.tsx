"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { removeFromWishlist } from "@/store/wishlistSlice";
import Pagination from "@/components/Pagination";

interface ListmywishProps {
  data: Product[];
}

interface Brand {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl?: string;
  brand?: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  category: Category;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
}

const Listmywish: React.FC<ListmywishProps> = ({ data }) => {
  const [isListVisible, setListVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null); // Ref for wishlist container
  const dispatch = useDispatch();
  const toggleListVisibility = () => {
    setListVisible((prev) => !prev);
  };

  const handleLinkClick = () => {
    setListVisible(false);
  };

  const handleDeleteFavorite = async (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setListVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 4;
  const totalPages = useMemo(() => Math.ceil(data.length / dataPerPage), [data.length]);

  const paginateddata = useMemo(() => {
    return data.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);
  }, [data, currentPage, dataPerPage]);

  // Ensure that the current page is within bounds when data change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  if (data.length === 0) {
    return null;
  }

  return (
    <div>
      <div
        onClick={toggleListVisibility}
        className="flex w-[200px] items-center justify-center gap-2 max-lg:w-fit text-white cursor-pointer select-none max-xl:hidden"
      >
        <div className="relative my-auto mx-2">
          <AiOutlineHeart size={45} className="text-white" />
          <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
            {data.length} {/* Show the number of wishlist items */}
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-[#C1C4D6] text-sm">Favorite</p>
          <p className="text-white font-bold max-md:hidden">My Wishlist</p>
        </div>
      </div>
      {/* Render the wishlist items based on visibility */}
      {isListVisible && (
        <div
          ref={listRef}
          className="absolute flex flex-col mt-2  w-[400px] max-md:w-[350px] max-h-64 overflow-y-auto
                                             border-[#15335D] border-4 rounded-lg bg-white z-30 right-52 "
        >
          {data.length > 0 ? (
            <div>
              <h1 className="text-lg font-bold text-black border-b-2 text-center py-2 max-md:text-sm">
                Your Wishlist
              </h1>
              <div className="py-2 text-gray-500 border-b-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
              {paginateddata.map((item) => {
                return (
                  <div
                    key={item._id}
                    className=" py-2 max-md:mx-[10%] border-b-2 px-4"
                  >
                    <Link
                      href={`/${item.category.slug}/${item.slug}`}
                      onClick={handleLinkClick}
                      className="flex justify-between items-center "
                    >
                      <Image
                        width={70}
                        height={60}
                        src={item.imageUrl || "/placeholder.jpg"} // Provide a default placeholder image
                        alt={item.name}
                        className="rounded-md "
                      />
                      <span>{item.name}</span>
                      {/* Product Price & Discount */}
                      <span className="flex flex-col ">
                        {item.discount ? (
                          <>
                            {/* Show discounted price */}
                            <span className="line-through text-red-500">
                              {item.price.toFixed(2)} TND
                            </span>
                            <span className="text-green-500">
                              {(
                                (item.price * (100 - item.discount)) /
                                100
                              ).toFixed(2)}{" "}
                              TND
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400">
                            {item.price.toFixed(2)} TND
                          </span>
                        )}
                      </span>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFavorite(item._id)}
                          className="p-1 hover:bg-[#15335E]  border-2 max-md:border-none border-[#15335E] rounded text-black hover:text-white cursor-pointer"
                   >
                          <FaRegTrashAlt />
                        </button>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-2 hidden">
              No items in your wishlist.
            </p> // Always show message
          )}
        </div>
      )}
    </div>
  );
};

export default Listmywish;

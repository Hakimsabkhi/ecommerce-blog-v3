"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRegEdit, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";
import useIs2xl from "@/hooks/useIs2x";

type Brand = {
  _id: string;
  name: string;
  place: string;
  imageUrl: string;
  logoUrl: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

interface User {
  _id: string;
  username: string;
}

const AddedBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const is2xl = useIs2xl();
  const brandsPerPage = is2xl ? 7 : 5; // Number of brands to display per page
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState({ id: "", name: "" });
  const [loadingBrandId, setLoadingBrandId] = useState<string | null>(null);

  const handleDeleteClick = (brand: Brand) => {
    setLoadingBrandId(brand._id);
    setSelectedBrand({ id: brand._id, name: brand.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingBrandId(null);
  };

  const deleteBrand = async (brandId: string) => {
    try {
      const response = await fetch(`/api/brand/admin/deleteBrand/${brandId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleClosePopup();
      toast.success("Brand deleted successfully!");
      setBrands(brands.filter((brand) => brand._id !== brandId));
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoadingBrandId(null);
    }
  };

  const getBrands = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/brand/admin/getAllBrandAdmin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Brand[] = await response.json();
      setBrands(data);
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    const filtered = brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, brands]);

  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBrands.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );
  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);

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

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
      <div className="flex items-center justify-between h-[80px] ">
        <p className="text-3xl max-sm:text-sm font-bold">ALL Brands</p>
        <div className="flex gap-2">
        <Link href="brand/costmize">
        <button className='bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4'>
       Costmize Brand
          </button>
        </Link>
        <Link href="brand/addbrand">
          <button className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
            Add a new Brand
          </button>
        </Link>
        </div>
      </div>

      <div className="h-[50px] flex items-center ">
        <input
          type="text"
          placeholder="Search brands"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg max-w-max"
        />
      </div>

      <div className="h-[50vh] max-2xl:h-80 max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 border-r-white py-3 w-[10%] md:max-lg:w-[10%]">
                Icon
              </th>
              <th className="px-4 text-left border-r-white py-3 w-[20%] md:max-lg:w-[30%]">
                ImageURL
              </th>
              <th className="px-4 text-left border-r-white py-3 w-[15%] md:max-lg:w-[20%]">
                Name
              </th>
              <th className="px-4 text-left border-r-white py-3 w-[20%] md:max-lg:w-[20%]">
                Place
              </th>
              <th className="px-4 text-left border-r-white py-3 w-[20%] max-lg:hidden">
                Created By
              </th>
              <th className="px-4 text-center border-r-white py-3 w-[20%] md:max-lg:w-[20%]">
                Action
              </th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px] items-center" />
                  </div>
                </td>
              </tr>
            </tbody>
          )  :    filteredBrands.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucune marque trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentBrands.map((item, index) => (
                <tr key={index} className="even:bg-gray-100 odd:bg-white">
                  <td className="border px-4 py-3">
                    <Image
                      src={item.logoUrl}
                      width={30}
                      height={30}
                      alt="icon"
                    />
                  </td>
                  <td className="border px-4 py-3 truncate">
                    <Link href={item.imageUrl}>
                      {item.imageUrl.split("/").pop()}
                    </Link>
                  </td>
                  <td className="border px-4 py-3">{item.name}</td>
                  <td className="border px-4 py-3 max-md:hidden">
                    {item.place}
                  </td>
                  <td className="border px-4 py-3 max-lg:hidden">
                    {item?.user?.username}
                  </td>
                  <td className="flex gap-2 justify-center">
                    <Link href={`/admin/brand/${item._id}`}>
                      <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                        <FaRegEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                    >
                      {loadingBrandId === item._id ? (
                        "Processing..."
                      ) : (
                        <FaTrashAlt />
                      )}
                    </button>
                    {isPopupOpen && (
                      <DeletePopup
                        handleClosePopup={handleClosePopup}
                        Delete={deleteBrand}
                        id={selectedBrand.id}
                        name={selectedBrand.name}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>{" "}
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {currentBrands.map((item) => (
          <div
            key={item._id}
            className="p-4 mb-4 flex flex-col gap-4 bg-gray-100 rounded shadow-md"
          >
            <div className="">
              <div>
                <div className="flex gap-1 text-3xl font-semibold uppercase text-center justify-center ">
                  <p className="text-gray-600 ">name:</p>
                  <p>{item.name}</p>
                </div>
                <hr className="border-white border-2 w-full my-2" />
                <div className="flex  gap-1 font-semibold pl-[15%]">
                  <p className="text-gray-600 w-1/4 mr-4">Place:</p>
                  <p className="truncate">{item.place}</p>
                </div>
                <div className="flex gap-1 font-semibold pl-[15%]">
                  <p className="text-gray-600  w-1/4 mr-4">Created by:</p>
                  <p>{item?.user?.username}</p>
                </div>
              </div>
              <div className="w-full flex justify-center py-2">
                <Image src={item.logoUrl} width={300} height={50} alt="icon" />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Link href={`/admin/brand/${item._id}`}>
                <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                  <FaRegEdit />
                </button>
              </Link>
              <button
                onClick={() => handleDeleteClick(item)}
                className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
              >
                {loadingBrandId === item._id ? "Processing..." : <FaTrashAlt />}
              </button>
              {isPopupOpen && (
                <DeletePopup
                  handleClosePopup={handleClosePopup}
                  Delete={deleteBrand}
                  id={selectedBrand.id}
                  name={selectedBrand.name}
                />
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
    </div>
  );
};

export default AddedBrands;

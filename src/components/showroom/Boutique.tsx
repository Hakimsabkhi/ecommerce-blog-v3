"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import Pagination from "../Pagination";
//import Pagination from "../Pagination";
interface OpeningHours {
  [day: string]: { open: string; close: string }[];
}

interface StoreData {
  _id: string;
  nom: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  openingHours: OpeningHours;
}
interface Boutiqueprops {
  boutiques: StoreData[];
}

const Boutique: React.FC<Boutiqueprops> = ({ boutiques }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
   
     const [filteredProducts, setFilteredProducts] = useState<StoreData[]>([]);
     useEffect(()=>{
      setFilteredProducts(boutiques);
      setCurrentPage(1);
     }, [boutiques])
     const productsPerPage = 6;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  return (
    <div className="mx-[2%]   py-8 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 py-8">
        {/* Repeated block */}
        {currentProducts.map((item: StoreData) => (
          <div key={item._id} className="bg-white shadow-lg flex overflow-hidden rounded-lg">
            
      <div className="w-1/3">
      {item.image && (
              <Image
                src={item.image} // Replace with your image path
                alt="Store Image"
                width={1920}
                height={1080}
            className="w-full h-full object-cover"
              />
            )}</div>

<div className="bg-white w-2/3 h-full overflow-hidden">
            <div className="p-6">
              <h2 className="text-center text-2xl font-bold uppercase mb-4">
                {item.nom}
              </h2>
          <div className="text-center text-black flex justify-center items-center gap-4">
            <div className="flex justify-center items-center">
              <span className="inline-block bg-black p-1 font-semibold mr-2 rounded-md">
                    <BsFillTelephoneFill className="text-white" size={15} />
                  </span>
                  <span className="font-bold"> {item.phoneNumber}</span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="inline-block text-black font-semibold mr-2">
                    <FaMapMarkerAlt size={23} />
                  </span>
                  <span className="font-bold">
                    {item.address} {item.city}
                  </span>
                </div>
              </div>
          <div className="mt-4 flex flex-col justify-center w-fit mx-auto">
            <h3 className="text-center text-black font-bold mb-4">
                  TEMPS OUVERT :
                </h3>
                <ul className="text-center text-sm space-y-1">
                  {item?.openingHours &&
                    Object.entries(item.openingHours).map(([day, hours]) => (
                      <li key={day} className="flex gap-8 text-left">
                        <span className="font-medium w-20">{day}:</span>{" "}
                        {Array.isArray(hours) && hours.length > 0
                          ? hours
                              .map((hour) => {
                                const openTime = hour.open || ""; // Fallback to "-" if open is invalid
                                const closeTime = hour.close || ""; // Fallback to "-" if close is invalid
                                if (!openTime && !closeTime) return "";
                                return `${openTime} - ${closeTime}`;
                              })
                              .filter(Boolean) // Remove any null or empty entries from the array
                              .join(" / ") || "Closed" // If the array is empty after filtering, display "Closed"
                          : "Closed"}
                      </li>
                    ))}
                </ul>
              </div>
            </div></div>
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

export default Boutique;

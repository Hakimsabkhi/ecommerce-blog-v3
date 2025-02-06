"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegEdit, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";
import useIs2xl from "@/hooks/useIs2x";

type Boutique = {
  _id: string;
  nom: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  user: User;
  vadmin: string;
  createdAt: Date;
  updatedAt: Date;
};

interface User {
  _id: string;
  username: string;
}

const Store: React.FC = () => {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [filteredBoutique, setFilteredBoutique] = useState<Boutique[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const is2xl = useIs2xl();
  const brandsPerPage = is2xl ? 7 : 5; // Number of brands to display per page
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState({ id: "", name: "" });
  const [loadingBrandId, setLoadingBrandId] = useState<string | null>(null);

  const handleDeleteClick = (boutique: Boutique) => {
    setLoadingBrandId(boutique._id);
    setSelectedBrand({ id: boutique._id, name: boutique.nom });
    setIsPopupOpen(true);
  };
  const updateboutiqueIdvadmin = async (
    boutiqueId: string,
    newStatus: string
  ) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);

      const response = await fetch(
        `/api/store/admin/updatestorevadmin/${boutiqueId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setBoutiques((prevData) =>
        prevData.map((item) =>
          item._id === boutiqueId ? { ...item, vadmin: newStatus } : item
        )
      );
      const data = await response.json();
      console.log("boutique status updated successfully:", data);
    } catch (error) {
      console.error("Failed to update boutique status:", error);
      toast.error("Failed to update boutique status");
    }
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingBrandId(null);
  };

  const deletestore = async (boutiquesId: string) => {
    try {
      const response = await fetch(
        `/api/store/admin/deletestore/${boutiquesId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      handleClosePopup();
      toast.success("Brand deleted successfully!");
      setBoutiques(
        boutiques.filter((boutique) => boutique._id !== boutiquesId)
      );
    } catch (error: unknown) {
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

  const getcompany = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/store/admin/getallstore`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Boutique[] = await response.json();
      setBoutiques(data);
    } catch (error: unknown) {
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
    getcompany();
  }, []);

  useEffect(() => {
    const filtered = boutiques.filter((boutique) =>
      boutique.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBoutique(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, boutiques]);

  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBoutique.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );
  const totalPages = Math.ceil(filteredBoutique.length / brandsPerPage);

  const [colSpan, setColSpan] = useState(7);

  useEffect(() => {
    const updateColSpan = () => {
      const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
      const isMediumScreen = window.matchMedia("(max-width: 1024px)").matches;

      if (isSmallScreen) {
        setColSpan(4); // max-md: colSpan = 4
      } else if (isMediumScreen) {
        setColSpan(5); // max-lg: colSpan = 5
      } else {
        setColSpan(7); // Default: colSpan = 6
      }
    };

    updateColSpan();

    window.addEventListener("resize", updateColSpan);

    return () => window.removeEventListener("resize", updateColSpan);
  }, []);

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
      <div className="flex items-center justify-between h-[80px] ">
        <p className="text-3xl max-sm:text-sm font-bold">ALL Boutique</p>
        <Link href="store/addstore">
          <button className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
            Add a new Boutique
          </button>
        </Link>
      </div>

      <div className="h-[50px] flex items-center ">
        <input
          type="text"
          placeholder="Search Boutique"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg max-w-max"
        />
      </div>

      <div className="h-[50vh] max-2xl:h-80 max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 text-left border-r-white py-3 w-[10%] md:max-lg:w-[25%]">
                Image
              </th>
              <th className="px-4 text-left border-r-white py-3 w-[10%] md:max-lg:w-[20%]">
                Name
              </th>
              <th className="px-4 text-left border-r-white py-3 w-[10%] md:max-lg:w-[20%]  max-lg:hidden">
                Localisation
              </th>
              <th className="px-4 text-left border-r-white py-3 w-[10%] max-lg:hidden md:max-lg:w-[20%]">
                Address
              </th>
              <th className="px-4 text-left border-r-white py-3 w-[10%] md:max-lg:w-[25%]">
                City
              </th>
            <th className="px-4 text-left border-r-white py-3 w-[10%] max-lg:hidden">
                Created By
              </th>
              <th className="px-4 text-center border-r-white py-3 w-[20%] md:max-lg:w-[30%]">
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
          ) : filteredBoutique.length === 0 ? (
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
                  <td className="border px-4 py-3 truncate">
                    <Link href={item.image}>{item.image.split("/").pop()}</Link>
                  </td>
                  <td className="border px-4 py-3 truncate">{item.nom}</td>
                  <td className="border px-4 py-3 max-md:hidden  max-lg:hidden">
                    {item.localisation}
                  </td>
                  <td className="border px-4 py-3 max-md:hidden  max-lg:hidden">
                    {item.address}
                  </td>
                  <td className="border px-4 py-3 max-md:hidden">
                    {item.city}
                  </td>
                  <td className="border px-4 py-3 max-lg:hidden truncate">
                    {item?.user?.username}
                  </td>
                  <td className="flex gap-2 justify-center">
                    <select
                      className={`w-32 text-black rounded-md h-10 ${
                        item.vadmin === "not-approve"
                          ? "bg-gray-400 text-white"
                          : "bg-green-500 text-white"
                      }`}
                      value={item.vadmin}
                      onChange={(e) =>
                        updateboutiqueIdvadmin(item._id, e.target.value)
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
                    <Link href={`/admin/store/${item._id}`}>
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
                        Delete={deletestore}
                        id={selectedBrand.id}
                        name={selectedBrand.name}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {currentBrands.map((item) => (
          <div
            key={item._id}
            className="p-4 mb-4 flex flex-col gap-4 bg-gray-100 rounded shadow-md"
          >
            <div>
              <div className="flex gap-1 text-3xl font-semibold uppercase text-center justify-center ">
                <p className="text-gray-600 ">name:</p>
                <p>{item.nom}</p>
              </div>
              <hr className="border-white border-2 w-full my-2" />
              <div className="flex gap-1 font-semibold pl-[15%]">
                <p className="text-gray-600 w-1/4 mr-4">Place:</p>
                <p className="truncate">{item.localisation}</p>
              </div>
              <div className="flex gap-1 font-semibold pl-[15%]">
                <p className="text-gray-600 w-1/4 mr-4">Address:</p>
                <p className="truncate">{item.address}</p>
              </div>
              <div className="flex gap-1 font-semibold pl-[15%]">
                <p className="text-gray-600 w-1/4 mr-4">City:</p>
                <p className="truncate">{item.city}</p>
              </div>
              <div className="flex gap-1 font-semibold pl-[15%]">
                <p className="text-gray-600 w-1/4 mr-4">Telephone:</p>
                <p className="truncate">{item.phoneNumber}</p>
              </div>
              <div className="flex gap-1 font-semibold pl-[15%]">
                <p className="text-gray-600  w-1/4 mr-4">Created by:</p>
                <p>{item?.user?.username}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex flex-col gap-2 w-3/5 mx-auto">
                <select
                  className={`w-32 text-black rounded-md h-10 ${
                    item.vadmin === "not-approve"
                      ? "bg-gray-400 text-white"
                      : "bg-green-500 text-white"
                  }`}
                  value={item.vadmin}
                  onChange={(e) =>
                    updateboutiqueIdvadmin(item._id, e.target.value)
                  }
                >
                  <option value="approve" className="text-white uppercase">
                    approve
                  </option>
                  <option value="not-approve" className="text-white uppercase">
                    Not approve
                  </option>
                </select>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <Link href={`/admin/store/${item._id}`}>
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
              </div>
              {isPopupOpen && (
                <DeletePopup
                  handleClosePopup={handleClosePopup}
                  Delete={deletestore}
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

export default Store;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegEdit, FaSpinner, FaTrashAlt } from "react-icons/fa";
import DeletePopup from "@/components/Popup/DeletePopup";
import Pagination from "@/components/Pagination";
import useIs2xl from "@/hooks/useIs2x";

type User = {
  _id: string;
  username: string;
};

type Companies = {
  _id: string;
  name: string;
  matriculefiscal: string;
  address: string;
  numtele: string;
  gerantsoc: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

const Page = () => {
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Companies[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string }>({ id: "", name: "" });
  const [loadingCompanyId, setLoadingCompanyId] = useState<string | null>(null);

  const is2xl = useIs2xl();
  const CompaniesPerPage = is2xl ? 7 : 5;
  const [colSpan, setColSpan] = useState(6);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`/api/companies/admin/getcompanies`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Companies[] = await response.json();
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);
 // ─────────────────────────────────────────────────────────────────────────────
  // 2) CALCULATE COLSPAN DYNAMICALLY
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const updateColSpan = () => {
      const isSmallestScreen = window.innerWidth <= 640; // max-sm
      const isSmallScreen = window.innerWidth <= 768; // max-md
      const isMediumScreen = window.innerWidth <= 1024; // max-lg
      const isXlLScreen = window.innerWidth <= 1280; // max-xl

      if (isSmallestScreen) {
        setColSpan(1);
      } else if (isSmallScreen) {
        setColSpan(2);
      } else if (isMediumScreen) {
        setColSpan(3);
      } else if (isXlLScreen) {
        setColSpan(4);
      } else {
        setColSpan(6); // default
      }
    };

    updateColSpan();
    window.addEventListener("resize", updateColSpan);
    return () => window.removeEventListener("resize", updateColSpan);
  }, []);
  useEffect(() => {
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [searchTerm, companies]);

  const handleDeleteClick = (company: Companies) => {
    setSelectedCompany({ id: company._id, name: company.name });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingCompanyId(null);
  };

  const deleteCompany = async (id: string) => {
    try {
      setLoadingCompanyId(id);
      const response = await fetch(`/api/companies/admin/deletecompanies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setCompanies(companies.filter((company) => company._id !== id));
      handleClosePopup();
    } catch (error) {
      console.error("Error deleting company:", error);
    } finally {
      setLoadingCompanyId(null);
    }
  };

  const indexOfLastCompany = currentPage * CompaniesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - CompaniesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / CompaniesPerPage);

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
      <div className="flex items-center justify-between h-[80px] ">
        <p className="text-3xl max-sm:text-sm font-bold">All Enterprises</p>
        <Link href="/admin/companies/addcompanies">
          <button className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
            Add a New Enterprise
          </button>
        </Link>
      </div>
      <div className="h-[50px] flex items-center ">
        <input
          type="text"
          placeholder="Search Enterprise"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg max-w-max"
        />
      </div>

     
        <div className='max-2xl:h-80 h-[50vh] max-md:hidden'>
        <table className="w-full rounded overflow-hidden table-fixed">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-3">Matricule Fiscale</th>
              <th className="px-4 py-3">Enterprise Name</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Manager</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3 text-center">Actions</th>
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
      )  : currentCompanies.length === 0 ? (
        <tbody>
          <tr>
            <td colSpan={colSpan}>
              <div className="text-center py-6 text-gray-600 w-full">
                <p>Aucune companies trouvée.</p>
              </div>
            </td>
          </tr>
        </tbody>
      ) : (
          <tbody>
            {currentCompanies.map((company) => (
              <tr key={company._id} className="even:bg-gray-100 odd:bg-white">
                <td className="border px-4 py-3">{company.matriculefiscal}</td>
                <td className="border px-4 py-3 truncate">{company.name}</td>
                <td className="border px-4 py-3">{company.address}</td>
                <td className="border px-4 py-3">{company.gerantsoc}</td>
                <td className="border px-4 py-3">{company.user?.username}</td>
                <td className="flex gap-2 justify-center">
                <div className="flex justify-center gap-2 ">
                  <Link href={`/admin/companies/${company._id}`}>
                  <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                        <FaRegEdit />
                      </button>
                  </Link>
                  <button
                    aria-label="Delete Company"
                    className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                    onClick={() => handleDeleteClick(company)}
                  >
                    {loadingCompanyId === company._id ? "Processing..." : <FaTrashAlt />}
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          )}
        </table>
        </div>
      

      {isPopupOpen && (
        <DeletePopup
          handleClosePopup={handleClosePopup}
          Delete={deleteCompany}
          id={selectedCompany.id}
          name={selectedCompany.name}
        />
      )}

      
        <div className="md:hidden flex flex-col gap-4">
          {currentCompanies.map((item) => (
            <div key={item._id} 
            className="p-4 mb-4 flex flex-col gap-4 bg-gray-100 rounded shadow-md">
              <div className="">
                
                <div>
                <div className="flex gap-1 text-3xl font-semibold uppercase text-center justify-center ">
                  <p className="text-gray-600 ">Matricule Fiscale:</p>
                  <p>{item.matriculefiscal}</p>
                </div>
                <hr className="border-white border-2 w-full my-2" />
                <div className="flex  gap-1 font-semibold pl-[15%]">
                  <p className="text-gray-600 w-1/3 mr-4">Nom Enterprise:</p>
                  <p className="truncate">{item.name}</p>
                </div>
                <div className="flex gap-1 font-semibold pl-[15%]">
                  <p className="text-gray-600  w-1/3 mr-4">Created by:</p>
                  <p>{item?.user?.username}</p>
                </div>
                </div>
                <div className="flex gap-1 font-semibold pl-[15%]">
                <p className="text-gray-600  w-1/3 mr-4">Gerant Enterprise:</p>
                <p>{item.gerantsoc}</p></div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
              <Link href={`/admin/companies/${item._id}`}>
                  <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                    <FaRegEdit />
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                >
                  {loadingCompanyId === item._id ? "Processing..." : <FaTrashAlt />}
                </button>
                 {isPopupOpen && (
                  <DeletePopup
                    handleClosePopup={handleClosePopup}
                    Delete={deleteCompany}
                    id={selectedCompany.id}
                    name={selectedCompany.name}
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

export default Page;

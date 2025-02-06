"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import useIs2xl from "@/hooks/useIs2x";
import { FaTrashAlt, FaSpinner, FaRegEdit } from "react-icons/fa";
import Pagination from "@/components/Pagination";
import DeletePopup from "@/components/Popup/DeletePopup";

type User = {
  _id: string;
  username: string;
};

interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface Companies {
  name: string;
  matriculefiscal: string;
  address: string;
  numtele: string;
  gerantsoc: string;
}

interface Invoice {
  _id: string;
  user: User;
  ref: string;
  companies: Companies;
  address: Address;
  paymentMethod: string;
  deliveryMethod: string;
  createdAt: string;
  total: number;
}

type Timeframe = "all" | "year" | "month" | "day";

const Listinvoice: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Popup & loading states
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInvoice, setSelectedInvoice] = useState({ id: "", name: "" });
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null);

  // Pagination
  const is2xl = useIs2xl();
  const invoicesPerPage = is2xl ? 7 : 5;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Timeframe state
  const [timeframe, setTimeframe] = useState<Timeframe>("all");

  /**
   * We'll store the user’s chosen date string in one of:
   * - "YYYY" (for year)
   * - "YYYY-MM" (for month)
   * - "YYYY-MM-DD" (for day)
   * - "" (for all)
   */
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Used to adjust table colSpan on smaller screens
  const [colSpan, setColSpan] = useState<number>(5);

  // ─────────────────────────────────────────────────────────────────────────────
  // FETCH & DELETE
  // ─────────────────────────────────────────────────────────────────────────────
  const getAllInvoices = useCallback(async () => {
    try {
      const response = await fetch("/api/invoice/getallinvoice", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const data = await response.json();
      setInvoices(data);
      setFiltered(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching invoices:", err.message);
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteClick = (inv: Invoice) => {
    setLoadingInvoiceId(inv._id);
    setSelectedInvoice({ id: inv._id, name: inv.ref });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingInvoiceId(null);
  };

  const deleteInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoice/deleteinvoicebyid/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      handleClosePopup();
      toast.success("Invoice deleted successfully!");
      await getAllInvoices();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error deleting invoice:", err.message);
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    getAllInvoices();
  }, [getAllInvoices]);

  useEffect(() => {
    // If timeframe = "all", reset selectedDate to ""
    if (timeframe === "all") {
      setSelectedDate("");
      return;
    }

    // Otherwise, set a default value for each timeframe
    const now = new Date();
    if (timeframe === "year") {
      // e.g. "2025"
      setSelectedDate(String(now.getFullYear()));
    } else if (timeframe === "month") {
      // e.g. "2025-01"
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      setSelectedDate(`${year}-${month}`);
    } else if (timeframe === "day") {
      // e.g. "2025-01-21"
      setSelectedDate(now.toISOString().split("T")[0]); // "YYYY-MM-DD"
    }
  }, [timeframe]);

  // Dynamically update colSpan based on screen size
  useEffect(() => {
    const updateColSpan = () => {
      const isSmallScreen = window.innerWidth <= 768; // max-md
      const isMediumScreen = window.innerWidth <= 1024; // max-lg
      const isXlScreen = window.innerWidth <= 1280; // max-xl

      if (isSmallScreen) {
        setColSpan(3);
      } else if (isMediumScreen) {
        setColSpan(4);
      } else if (isXlScreen) {
        setColSpan(5);
      } else {
        setColSpan(6); // default
      }
    };
    updateColSpan();
    window.addEventListener("resize", updateColSpan);
    return () => window.removeEventListener("resize", updateColSpan);
  }, []);

  /**
   * FILTER invoices based on:
   * - searchTerm
   * - timeframe
   * - selectedDate (which can be "YYYY", "YYYY-MM", "YYYY-MM-DD", or "")
   */
  useEffect(() => {
    const filteredList = invoices.filter((inv) => {
      // 1. Basic search match
      const searchMatch =
        inv.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      // If timeframe === "all", skip date checking
      if (timeframe === "all") {
        return searchMatch;
      }

      // Otherwise, parse invoice date
      const invoiceDate = new Date(inv.createdAt);

      // 2. Does invoice fall within the chosen timeframe?
      let invoiceMatchesTimeframe = false;

      switch (timeframe) {
        case "year": {
          // selectedDate should be "YYYY"
          const selectedYear = parseInt(selectedDate, 10);
          if (invoiceDate.getFullYear() === selectedYear) {
            invoiceMatchesTimeframe = true;
          }
          break;
        }
        case "month": {
          // selectedDate should be "YYYY-MM"
          // => e.g. "2025-01"
          const [y, m] = selectedDate.split("-");
          const selectedYear = parseInt(y, 10);
          const selectedMonth = parseInt(m, 10); // 1-based
          if (
            invoiceDate.getFullYear() === selectedYear &&
            invoiceDate.getMonth() + 1 === selectedMonth
          ) {
            invoiceMatchesTimeframe = true;
          }
          break;
        }
        case "day": {
          // selectedDate should be "YYYY-MM-DD"
          // => e.g. "2025-01-21"
          const [y, m, d] = selectedDate.split("-");
          const selectedYear = parseInt(y, 10);
          const selectedMonth = parseInt(m, 10);
          const selectedDay = parseInt(d, 10);
          if (
            invoiceDate.getFullYear() === selectedYear &&
            invoiceDate.getMonth() + 1 === selectedMonth &&
            invoiceDate.getDate() === selectedDay
          ) {
            invoiceMatchesTimeframe = true;
          }
          break;
        }
      }

      return searchMatch && invoiceMatchesTimeframe;
    });

    setFiltered(filteredList);
    setCurrentPage(1);
  }, [searchTerm, invoices, timeframe, selectedDate]);

  // PAGINATION
  const indexOfLastItem = currentPage * invoicesPerPage;
  const indexOfFirstItem = indexOfLastItem - invoicesPerPage;
  const currentInvoices = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / invoicesPerPage);
  function getdatetime(date:string){
    const dates=new Date(date).getDate();
    const nowdate=new Date().getDate();
    console.log(nowdate)
    if(dates==nowdate){
      return true
    }else{
      return false
    } 
  }
  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
    <div className="flex items-center justify-between h-[80px] ">
      <p className="text-3xl max-sm:text-sm font-bold">ALL INVOICES</p>
        <Link
          href={"/admin/invoice/addinvoice"}
          className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
        
          Create Invoice
        </Link>
      </div>

      {/* SEARCH + TIMEFRAME FILTER */}
      <div className="flex max-lg:flex-col max-lg:gap-4 justify-between mt-1">
        {/* Search */}
        <input
          type="text"
          placeholder="Search invoices"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg md:max-xl:w-[30%] lg:w-1/5"
        />

        {/* Timeframe Controls */}
        <div className="flex justify-between gap-2">
          <button
            onClick={() => setTimeframe("all")}
            className={`w-[90px] rounded ${
              timeframe === "all"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTimeframe("year")}
            className={`w-[90px] rounded ${
              timeframe === "year"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Year
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`w-[90px] rounded ${
              timeframe === "month"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe("day")}
            className={`w-[90px] rounded ${
              timeframe === "day"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            Day
          </button>

          {/* Conditionally show an input based on timeframe */}
{timeframe !== "all" ? (
  <div>
    {timeframe === "year" && (
      /**
       * We'll use a text or number input for just "YYYY".
       * Example: "2025"
       */
      <input
        type="text"
        className="border rounded-lg p-2 w-[190px]"
        value={selectedDate} // e.g. "2025"
        placeholder="YYYY"
        onChange={(e) => setSelectedDate(e.target.value)}
        pattern="\d{4}"
      />
    )}

    {timeframe === "month" && (
      /**
       * HTML5 month input => returns "YYYY-MM"
       * e.g. "2025-01"
       */
      <input
        type="month"
        className="border rounded-lg p-2 w-[190px]"
        value={selectedDate} // "YYYY-MM"
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    )}

    {timeframe === "day" && (
      /**
       * HTML5 date input => returns "YYYY-MM-DD"
       * e.g. "2025-01-21"
       */
      <input
        type="date"
        className="border rounded-lg p-2 w-[190px]"
        value={selectedDate} // "YYYY-MM-DD"
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    )}
  </div>
) : (
  /**
   * Always show an empty date input when timeframe is "all"
   */
  <input
  
  className="border rounded-lg p-2 w-[190px]"
  value={""} // Always empty
  disabled
/>
)}

        </div>
      </div>

      {/* TABLE (Desktop) */}
      <div className="max-2xl:h-80 h-[500px] max-md:hidden mt-1">
        <table className="w-full rounded overflow-hidden table-fixed">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-3 w-[15%] md:max-lg:w-[25%] lg:max-xl:w-[15%]">
                REF
              </th>
              <th className="px-4 py-3 w-[15%] lg:max-xl:w-[18%] max-lg:hidden">
                Customer
              </th>
              <th className="px-4 py-3 w-[10%] lg:max-xl:w-[15%] lg:table-cell hidden">
                Total
              </th>
              <th className="px-4 py-3 w-[20%] max-xl:hidden">
                Payment Method
              </th>
              <th className="px-4 py-3 w-[15%] md:max-lg:w-[25%] lg:max-xl:w-[20%]">
                Date
              </th>
              <th className="px-4 text-center py-3 w-[25%] md:max-lg:w-[50%] lg:max-xl:w-[32%]">
                Action
              </th>
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
          ) : filtered.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>No invoices found.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentInvoices.map((inv) => {
                // Format date/time as "DD/MM/YYYY - HH:mm" (24-hour)
                const datePart = new Date(inv.createdAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                );
                const timePart = new Date(inv.createdAt).toLocaleTimeString(
                  "en-GB",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                );
                const fullDateTime = `${datePart} - ${timePart}`;

                return (
                  <tr key={inv._id} className="even:bg-gray-100 odd:bg-white">
                    <td className="border px-4 py-2 truncate">{inv.ref}</td>
                    <td className="border px-4 py-2 uppercase max-lg:hidden truncate">
                      {inv.user?.username || inv.companies?.name}
                    </td>
                    <td className="border px-4 py-2 text-start lg:table-cell hidden truncate">
                      {inv.total.toFixed(2)} TND
                    </td>
                    <td className="border px-4 py-2 uppercase truncate max-xl:hidden">
                      {inv.paymentMethod}
                    </td>
                    <td className="border px-4 py-2 truncate">
                      {fullDateTime}
                    </td>
                    <td className="flex gap-2 justify-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/invoice/editinvoice/${inv._id}`}>
                          <button
                            title="Edit Invoice"
                            className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                          >
                            <FaRegEdit />
                          </button>
                        </Link>
                        <Link href={`/admin/invoice/${inv._id}`}>
                          <button
                            type="button"
                            className="bg-gray-800 text-white w-32 h-10 hover:bg-gray-600 rounded-md uppercase"
                          >
                            Facture
                          </button>
                        </Link>
                        {getdatetime(inv.createdAt)==true  && <button
                          onClick={() => handleDeleteClick(inv)}
                          className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                          disabled={loadingInvoiceId === inv._id}
                        >
                          {loadingInvoiceId === inv._id ? "..." : <FaTrashAlt />}
                        </button>}
                        {isPopupOpen && (
                          <DeletePopup
                            handleClosePopup={handleClosePopup}
                            Delete={deleteInvoice}
                            id={selectedInvoice.id}
                            name={selectedInvoice.name}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* LIST (Mobile) */}
      <div className="block md:hidden">
        {currentInvoices.map((inv) => {
          // Same date/time formatting for mobile
          const datePart = new Date(inv.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const timePart = new Date(inv.createdAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          const fullDateTime = `${datePart} - ${timePart}`;

          return (
            <div
              key={inv._id}
              className="bg-white rounded shadow p-4 mb-4 border"
            >
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">{inv.ref}</p>
                  <p className="uppercase">
                    {inv.user?.username || inv.companies?.name}
                  </p>
                  <p className="uppercase">{inv.paymentMethod}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p>{inv.total.toFixed(2)} TND</p>
                  <p>{fullDateTime}</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <Link href={`/admin/invoice/editinvoice/${inv._id}`}>
                  <button
                    title="Edit Invoice"
                    className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                  >
                    <FaRegEdit />
                  </button>
                </Link>
                <Link href={`/admin/invoice/${inv._id}`}>
                  <button
                    type="button"
                    className="bg-gray-800 text-white w-32 h-10 hover:bg-gray-600 rounded-md uppercase"
                  >
                    Facture
                  </button>
                </Link>
              {getdatetime(inv.createdAt)==true  &&<button
                  onClick={() => handleDeleteClick(inv)}
                  className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                  disabled={loadingInvoiceId === inv._id}
                >
                  {loadingInvoiceId === inv._id ? "..." : <FaTrashAlt />}
                </button>}
                {isPopupOpen && (
                  <DeletePopup
                    handleClosePopup={handleClosePopup}
                    Delete={deleteInvoice}
                    id={selectedInvoice.id}
                    name={selectedInvoice.name}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
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

export default Listinvoice;

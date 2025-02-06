"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import DeletePopup from "../Popup/DeletePopup";
import ConfirmPopup from "../Popup/ConfirmPopup";
import { FaSpinner, FaTrashAlt, FaRegEye, FaRegEdit } from "react-icons/fa";
import Pagination from "../Pagination";
import useIs2xl from "@/hooks/useIs2x";
type User = {
  _id: string;
  username: string;
  // other user fields
};

interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface Order {
  _id: string;
  user: User;
  ref: string;
  address: Address;
  paymentMethod: string;
  deliveryMethod: string;
  createdAt: string;
  total: number;
  orderStatus: string;
  statusinvoice: boolean;
}
type Timeframe = "all" | "year" | "month" | "day";

const ListOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // All orders
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Filtered orders
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const is2xl = useIs2xl();
  const ordersPerPage = is2xl ? 7 : 5;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState({ id: "", name: "" });
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState(""); // Initial value
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isPopupOpeninvoice, setIsPopupOpeninvoice] = useState(false);
  const [selectedorderid, setSelectedorderid] = useState<string>("");
  const [selectedval, setSelectedval] = useState<string>("");
  const [colSpan, setColSpan] = useState(5);
  
    // Timeframe state
    const [timeframe, setTimeframe] = useState<Timeframe>("all");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    console.log(e.target.value); // Do something with the selected value (e.g., filter data)
  };
  const handleDeleteClick = (order: Order) => {
    setLoadingOrderId(order._id);

    setSelectedOrder({ id: order._id, name: order.ref });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingOrderId(null);
  };
  const handleClosePopupinvoice = () => {
    setIsPopupOpeninvoice(false);
  };
  const handleinvoice = async (order: string) => {
    try {
      const response = await fetch(`/api/invoice/postinvoice`, {
        method: "POST",

        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      window.open(`/admin/invoice/${data.ref._id}`, "_blank");
      setIsPopupOpeninvoice(false);
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
    }
  };
  const DeleteOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/order/admin/deleteorderbyid/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      handleClosePopup();
      toast.success("order delete successfully!");

      await getOrders();
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
      setLoadingOrderId(null);
    }
  };
  const getOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/order/admin/getallorder", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data); // Store all orders
      setFilteredOrders(data); // Initially, filteredOrders are the same as orders
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
      setLoading(false);
    }
  }, []);
  const handleinvoiceconfirm = async (orderId: string, newStatus: string) => {
    try {
      const updateFormData = new FormData();
      updateFormData.append("vadmin", newStatus);
      const response = await fetch(
        `/api/order/admin/updatestatusinvoice/${orderId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setOrders((prevData) =>
        prevData.map((item) =>
          item._id === orderId
            ? { ...item, statusinvoice: JSON.parse(newStatus) }
            : item
        )
      );
      handleinvoice(orderId);
      const data = await response.json();
      console.log("Order status updated successfully:", data);
    } catch (error) {
      console.error("Failed to update Order status:", error);
      toast.error("Failed to update Order status");
    }
  };
  const updatestatusinvoice = async (orderId: string, newStatus: string) => {
    if (newStatus == "false") {
      try {
        const updateFormData = new FormData();
        updateFormData.append("vadmin", newStatus);
        const response = await fetch(
          `/api/order/admin/updatestatusinvoice/${orderId}`,
          {
            method: "PUT",
            body: updateFormData,
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        setOrders((prevData) =>
          prevData.map((item) =>
            item._id === orderId
              ? { ...item, statusinvoice: JSON.parse(newStatus) }
              : item
          )
        );
        const data = await response.json();
        console.log("Order status updated successfully:", data);
      } catch (error) {
        console.error("Failed to update Order status:", error);
        toast.error("Failed to update Order status");
      }
    } else {
      setIsPopupOpeninvoice(true);
      setSelectedorderid(orderId);
      setSelectedval(newStatus);
    }
  };
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoadingOrderId(orderId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("status", newStatus);

      const response = await fetch(
        `/api/order/admin/updateStatusorder/${orderId}`,
        {
          method: "PUT",
          body: updateFormData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Order status updated successfully:", data);

      getOrders(); // Refresh the orders
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setLoadingOrderId(null);
    }
  };

  useEffect(() => {
    const updateColSpan = () => {
      const isSmallScreen = window.innerWidth <= 768; // max-md
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
    getOrders();
  }, [getOrders]);

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

  useEffect(() => {
    // Apply search and status filter
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.username.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = status === "" || order.orderStatus === status;

      // Apply date filtering based on the selected timeframe
      const matchesDateFilter = (date: string) => {
        const orderDate = new Date(order.createdAt);
        const selectedDateObj = new Date(date);

        if (timeframe === "year") {
          return orderDate.getFullYear() === selectedDateObj.getFullYear();
        } else if (timeframe === "month") {
          return (
            orderDate.getFullYear() === selectedDateObj.getFullYear() &&
            orderDate.getMonth() === selectedDateObj.getMonth()
          );
        } else if (timeframe === "day") {
          return (
            orderDate.getFullYear() === selectedDateObj.getFullYear() &&
            orderDate.getMonth() === selectedDateObj.getMonth() &&
            orderDate.getDate() === selectedDateObj.getDate()
          );
        }
        return true; // No filter if no timeframe is selected
      };

      return matchesSearch && matchesStatus && matchesDateFilter(selectedDate);
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to the first page
  }, [searchTerm, status, orders, timeframe, selectedDate]);

  

  useEffect(() => {
      const filtered = orders.filter((order) => {
        // 1. Basic search match
        const searchMatch =
          order.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ;
  
        // If timeframe === "all", skip date checking
        if (timeframe === "all") {
          return searchMatch;
        }
  
        // Otherwise, parse invoice date
        const invoiceDate = new Date(order.createdAt);
  
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
  
      setFilteredOrders(filtered);
      setCurrentPage(1);
    }, [searchTerm, orders, timeframe, selectedDate]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
    <div className="flex items-center justify-between h-[80px] ">
      <p className="text-3xl max-sm:text-sm font-bold">ALL Orders</p>
        <Link
          href={"order/addorder"}
          className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4">
        
          create order
        </Link>
      </div>

      <div className="flex max-lg:flex-col max-lg:gap-4 justify-between mt-1">
        <input
          type="text"
          placeholder="Search orders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg md:max-xl:w-[30%] lg:w-1/5"
        />

        <select
          name="category"
          value={status}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg md:max-xl:w-[30%] lg:w-1/5 h-10 block"
          required
        >
          <option value="">All</option>
          <option value="Processing">En cours de traitement</option>
          <option value="Pack">Expédiée</option>
          <option value="Deliver">Livrée</option>
          <option value="Cancelled">Annulée</option>
          <option value="Refunded">Remboursée</option>
        </select>

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
      <div className="max-2xl:h-80 h-[50vh] max-md:hidden mt-1">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 w-[12%] lg:max-xl:w-[13%] md:w-[15%]">
                REF
              </th>
              <th className="px-4 py-3 w-[15%] max-xl:hidden">Customer Name</th>
              <th className="px-4 py-3 w-[12%] lg:max-xl:w-[15%] lg:table-cell hidden">
                Total
              </th>
              <th className="px-4 py-3 w-[16%] lg:max-xl:w-[19%] md:w-[17%]">
                Date
              </th>
              <th className="px-4 text-center py-3 w-[45%] lg:max-xl:w-[53%] md:max-lg:w-[68%]">
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
          ) : filteredOrders.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucune commande trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentOrders.map((item) =>  {
                // Format date/time as "DD/MM/YYYY - HH:mm" (24-hour)
                const datePart = new Date(item.createdAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                );
                const timePart = new Date(item.createdAt).toLocaleTimeString(
                  "en-GB",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                );
                const fullDateTime = `${datePart} - ${timePart}`;

                return (
                <tr key={item._id} className="even:bg-gray-100 odd:bg-white">
                  <td className="border px-4 py-2 uppercase truncate">
                    {item.ref}
                  </td>
                  <td className="border px-4 py-2 uppercase max-xl:hidden truncate">
                    {item?.user?.username}
                  </td>
                  <td className="border px-4 py-2 text-start lg:table-cell hidden">
                    {item.total.toFixed(2)} TND
                  </td>
                  <td className="border px-4 py-2 truncate">
                  {fullDateTime}
                  </td>
                  <td className="flex gap-2 justify-center">
                    <div className="flex justify-center gap-2">
                      <select
                        className={`w-full max-w-40 h-10 text-black rounded-md p-2 truncate ${
                          item.orderStatus === "Processing"
                            ? "bg-gray-800 text-white"
                            : "bg-red-700 text-white"
                        }`}
                        value={item.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(item._id, e.target.value)
                        }
                      >
                        <option value="Processing">En cours</option>
                        <option value="Pack">Expédiée</option>
                        <option value="Deliver">Livrée</option>
                        <option value="Cancelled">Annulée</option>
                        <option value="Refunded">Remboursée</option>
                      </select>
                      <Link href={`/admin/order/${item.ref}`}>
                        <button className="bg-gray-800 text-white p-3 hover:bg-gray-600 rounded-md uppercase">
                          <FaRegEye />
                        </button>
                      </Link>
                      <Link href={`/admin/order/editorder/${item.ref}`}>
                        <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                          <FaRegEdit />
                        </button>
                      </Link>
                      <select
                        className={`w-full max-w-40 h-10 text-black rounded-md p-2 truncate ${
                          item.statusinvoice === false
                            ? "bg-gray-400 text-white"
                            : "bg-green-500 text-white"
                        }`}
                        value={item.statusinvoice.toString()}
                        onChange={(e) =>
                          updatestatusinvoice(item._id, e.target.value)
                        }
                      >
                        <option value="true" className="text-white uppercase">
                          approve
                        </option>
                        <option value="false" className="text-white uppercase">
                          Not approve
                        </option>
                      </select>
                      {item.statusinvoice === false ? (
                        <Link href={`/admin/order/bondelivraison/${item.ref}`}>
                          <button className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase">
                            INVOICE
                          </button>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleinvoice(item._id)}
                          className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase"
                        >
                          Invoice
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="bg-gray-800 text-white pl-3 w-10 min-w-10 h-10 hover:bg-gray-600 rounded-md"
                        disabled={loadingOrderId === item._id}
                      >
                        {loadingOrderId === item._id ? (
                          "Processing..."
                        ) : (
                          <FaTrashAlt />
                        )}
                      </button>
                      {isPopupOpen && (
                        <DeletePopup
                          handleClosePopup={handleClosePopup}
                          Delete={DeleteOrder}
                          id={selectedOrder.id} // Pass selected user's id
                          name={selectedOrder.name}
                        />
                      )}
                    </div>
                  </td>
                </tr>);
              })}
            </tbody>
          )}
        </table>
      </div>
      <div className="space-y-4 md:hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full py-6">
            <FaSpinner className="animate-spin text-[30px]" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-6 text-gray-600 w-full">
            <p>Aucune commande trouvée.</p>
          </div>
        ) : (
          currentOrders.map((item) => (
            <div
              key={item._id}
              className="p-4 mb-4 flex flex-col gap-4 bg-gray-100 rounded shadow-md"
            >
              <div>
                <div className="flex justify-between">
                  <p className=" px-4 py-2 uppercase truncate">{item.ref}</p>
                  <p className=" px-4 py-2 text-start  truncate ">
                    {item.total.toFixed(2)} TND
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className=" px-4 py-2 uppercase  truncate">
                    {item?.user?.username}
                  </p>
                  <div className=" px-4 py-2 truncate">
                    {new Date(item.createdAt).toLocaleDateString("en-GB")} -{" "}
                    {new Date(item.createdAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <div className=" px-4 py-2">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center gap-2">
                    <select
                      className={`w-50 h-10 text-black rounded-md p-2 truncate ${
                        item.orderStatus === "Processing"
                          ? "bg-gray-800 text-white"
                          : "bg-red-700 text-white"
                      }`}
                      value={item.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(item._id, e.target.value)
                      }
                    >
                      <option value="Processing">En cours</option>
                      <option value="Pack">Expédiée</option>
                      <option value="Deliver">Livrée</option>
                      <option value="Cancelled">Annulée</option>
                      <option value="Refunded">Remboursée</option>
                    </select>

                    <select
                      className={`w-50 h-10 text-black rounded-md p-2 truncate ${
                        item.statusinvoice === false
                          ? "bg-gray-400 text-white"
                          : "bg-green-500 text-white"
                      }`}
                      value={item.statusinvoice.toString()}
                      onChange={(e) =>
                        updatestatusinvoice(item._id, e.target.value)
                      }
                    >
                      <option value="true" className="text-white uppercase">
                        approve
                      </option>
                      <option value="false" className="text-white uppercase">
                        Not approve
                      </option>
                    </select>
                  </div>
                  <div className="flex justify-center gap-2">
                    {item.statusinvoice === false ? (
                      <Link href={`/admin/order/bondelivraison/${item.ref}`}>
                        <button className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase">
                          INVOICE
                        </button>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleinvoice(item._id)}
                        className="bg-gray-800 text-white px-4 h-10 hover:bg-gray-600 rounded-md uppercase"
                      >
                        Invoice
                      </button>
                    )}
                    <Link href={`/admin/order/${item.ref}`}>
                      <button className="bg-gray-800 text-white p-3 hover:bg-gray-600 rounded-md uppercase">
                        <FaRegEye />
                      </button>
                    </Link>
                    <Link href={`/admin/order/editorder/${item.ref}`}>
                      <button className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md">
                        <FaRegEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="bg-gray-800 text-white pl-3 w-10 h-10 hover:bg-gray-600 rounded-md"
                      disabled={loadingOrderId === item._id}
                    >
                      {loadingOrderId === item._id ? (
                        "Processing..."
                      ) : (
                        <FaTrashAlt />
                      )}
                    </button>
                  </div>
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={DeleteOrder}
                      id={selectedOrder.id} // Pass selected user's id
                      name={selectedOrder.name}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}
        />
      </div>
      {isPopupOpeninvoice && (
        <ConfirmPopup
          handleClosePopupinvoice={handleClosePopupinvoice}
          handleinvoiceconfirm={handleinvoiceconfirm}
          selectedorderid={selectedorderid}
          selectedval={selectedval}
        />
      )}
    </div>
  );
};

export default ListOrders;

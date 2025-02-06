import React, { useState, useMemo, useEffect } from "react";
import { Notification } from "./Notification";
import Pagination from "@/components/Pagination";
import { FaSpinner } from "react-icons/fa";

interface ListNotificationProps {
  handleViewOrder: (item: Notification) => void;
}

const ListNotification: React.FC<ListNotificationProps> = ({
  handleViewOrder,
}) => {
  // 1) Local state for notifications data
  const [data, setData] = useState<Notification[]>([]);

  // 2) Global loading spinner for the entire list
  const [isLoading, setIsLoading] = useState(true);

  // 3) Item-level loading indicator (per-notification)
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  // 4) Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 5;

  // Derived total pages
  const totalPages = useMemo(
    () => Math.ceil(data.length / dataPerPage),
    [data.length]
  );

  /**
   * Fetch notifications from the API (moved from parent)
   */
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/notification/getnotification", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const { notifications } = await response.json();
      setData(notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * On mount (when the dropdown is opened in the parent), fetch the data
   */
  useEffect(() => {
    fetchNotifications();
  }, []);

  /**
   * Derived data for the current page
   */
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * dataPerPage;
    const endIndex = currentPage * dataPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, dataPerPage]);

  /**
   * Ensure the current page is within bounds when data changes
   */
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /**
   * Local click handler to show item-level loading, then call parent’s `handleViewOrder`
   */
  const handleItemClick = async (item: Notification) => {
    setLoadingItemId(item._id);
    await handleViewOrder(item);
    setLoadingItemId(null);
  };

  /**
   * Render
   */
  return (
    <div>
      <h1 className="text-lg font-bold text-black text-center py-2 max-md:text-sm">
        Order Notification
      </h1>

      {isLoading ? (
        // Show global loading spinner
        <div className="flex justify-center items-center h-full w-full py-6">
          <FaSpinner className="animate-spin text-[30px] items-center" />
        </div>
      ) : data.length === 0 ? (
        // If no notifications
        <p className="text-center text-black">No notifications.</p>
      ) : (
        // Otherwise, map paginated data
        paginatedData.map((item) => (
          <div
            key={item._id}
            className="border-b last:border-b-0 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {loadingItemId === item._id ? (
              <div className="flex justify-center items-center py-6">
                <FaSpinner className="animate-spin text-[30px] text-gray-800" />
              </div>
            ) : (
              <div className={`p-2  ${item.seen === false ? 'bg-blue-900 text-white' : 'bg-default'} hover:bg-primary hover:text-white`}>
                <p>Order Ref: {item.order.ref}</p>
              </div>
            )}
          </div>
        ))
      )}

      {/* Pagination controls */}
      <div className="py-2 text-gray-500">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ListNotification;

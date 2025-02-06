"use client";

import React, { useRef, useState, useEffect } from "react";
import { AiOutlineBell } from "react-icons/ai";
import ListNotification from "./listNotification";
import useClickOutside from "@/hooks/useClickOutside";
import { usePathname, useRouter } from "next/navigation";

/**
 * Types for clarity
 */
export interface User {
  username: string;
}

export interface Order {
  _id: string;
  user: User;
  ref: string;
}

export interface Notification {
  _id: string;
  order: Order;
  seen: boolean;
  look: boolean; // unread or read
  createdAt: string;
  updatedAt: string;
}

const Notification: React.FC = () => {
  const [notif, setNotif] = useState<number>(0); // tracks the unread count
  const [notificationState, setNotificationState] = useState({ isOpen: false });

  const pathname = usePathname();
  const router = useRouter();
  const ListNotificationsWrapperRef = useRef<HTMLDivElement>(null);

  /**
   * 1) Poll the unread count
   */
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/notification/unreadcount");
      if (!response.ok) {
        throw new Error("Failed to fetch unread count");
      }
      const { unreadCount } = await response.json();
      setNotif(unreadCount);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  /**
   * 2) Toggle the dropdown list of notifications
   *    (We no longer fetch notifications here; it happens inside `ListNotification`)
   */
  const toggleListNotifications = () => {
    setNotificationState((prevState) => {
      const isOpening = !prevState.isOpen;
      return { isOpen: isOpening };
    });
    ViewNotification();
  };

  /**
   * 3) Close the dropdown
   */
  const closeListNotifications = () => {
    setNotificationState({ isOpen: false });
  };

  /**
   * 4) Mark notification as read & navigate
   */
  const handleViewOrder = async (item: Notification) => {
    try {
      const response = await fetch(
        `/api/notification/updatenotification/${item._id}`,
        { method: "PUT" }
      );
      if (response.ok) {
        // Navigate to the order page
        router.push(`/admin/order/${item.order.ref}`);

        // Refresh the unread count (since we’ve marked one more as read)
      } else {
        console.error("Error updating notification to 'read'");
      }
    } catch (err) {
      console.error("Error handling order view:", err);
    }
  };
  const ViewNotification = async () => {
    try {
      const response = await fetch(
        `/api/notification/markallread`,
        { method: "PUT" }
      );
      if (response.ok) {
        // Navigate to the order page

        // Refresh the unread count (since we’ve marked one more as read)
        fetchUnreadCount();
      } else {
        console.error("Error updating notification to 'read'");
      }
    } catch (err) {
      console.error("Error handling order view:", err);
    }
  };

  /**
   * 5) Use a custom hook to close dropdown if user clicks outside
   */
  useClickOutside(ListNotificationsWrapperRef, closeListNotifications);

  /**
   * 6) Close dropdown if route changes
   */
  useEffect(() => {
    closeListNotifications();
  }, [pathname]);

  /**
   * 7) Poll for unread count every 30 seconds + on initial mount
   */
  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Poll
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  /**
   * 8) Render
   */
  return (
    <div className="flex items-center justify-center w-fit text-primary cursor-pointer select-none">
      <div
        className="flex items-center justify-center gap-2 w-fit text-primary"
        onClick={toggleListNotifications}
      >
        <div className="relative my-auto mx-2" ref={ListNotificationsWrapperRef}>
          <AiOutlineBell size={40} aria-label="Notification bell" />

          {notif > 0 && (
            <span className="w-5 h-5 flex justify-center items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
              {notif}
            </span>
          )}

          {notificationState.isOpen && (
            <div
              className="absolute shadow-xl z-30 flex gap-2 flex-col top-12 left-1/2 -translate-x-1/2 bg-white p-2 w-[300px] border-4 rounded-lg border-[#15335D]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Render the list of notifications, now fetched inside child */}
              <ListNotification handleViewOrder={handleViewOrder} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;

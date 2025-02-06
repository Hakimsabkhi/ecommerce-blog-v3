"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/Pagination";

interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  quantity: number;
  image: string;
  discount: number;
  price: number;
}

interface Order {
  _id: string;
  user: string;
  ref: string;
  address: Address;
  orderItems: OrderItem[];
  paymentMethod: string;
  deliveryCost: number;
  deliveryMethod: string;
  total: number;
  orderStatus: string;
  createdAt: string;
}

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const ordersPerPage = 5; // Display 10 orders per page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order/getoderbyuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data: Order[] = await response.json();
        setOrders(data);
        setTotalPages(Math.ceil(data.length / ordersPerPage)); // Calculate total pages
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get the orders for the current page
  const getCurrentPageOrders = () => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return orders.slice(startIndex, endIndex);
  };

  return (
    <div className="w-full py-20 flex justify-center">
      <div className="w-[80%] max-lg:w-[95%] rounded-lg p-8 border-2 flex flex-col gap-2">
        <div className="max-md:flex-col max-md:flex max-md:items-center ">
          <p className="text-2xl font-bold">Order HISTORY</p>
          <p className="text-gray-400 text-sm max-md:text-center">
            Check the status of recent orders, manage returns, and download invoices
          </p>
        </div>
        {/* Display the orders for the current page */}
        {getCurrentPageOrders().map((order) => (
          <div key={order._id} className="flex flex-col gap-4">
            <div className="bg-[#EFEFEF] rounded-lg p-6 justify-between flex max-md:flex-col max-md:items-center max-md:gap-4">
              <div className="max-md:flex max-md:justify-between max-md:w-full">
                <p>Date Order</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div className="max-md:flex max-md:justify-between max-md:w-full">
                <p>Order number</p>
                <p>{order.ref}</p>
              </div>
              <div className="max-md:flex max-md:justify-between max-md:w-full">
                <p>Method Delivery</p>
                <p className="uppercase">{order.deliveryMethod}</p>
              </div>
              <div className="max-md:flex max-md:justify-between max-md:w-full">
                <p>Total amount</p>
                <p>{order.total} TND</p>
              </div>
              <Link
                href={`/orderhistory/bondelivraison/${order.ref}`}
                className="bg-[#F7F7F7] border-2 h-10 w-[15%] max-md:w-full rounded-lg flex items-center justify-center"
              >
                View
              </Link>
            </div>
          </div>
        ))}
        {/* Pagination Component */}
       {currentPage===0 && <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />}
      </div>
    </div>
  );
};

export default Page;

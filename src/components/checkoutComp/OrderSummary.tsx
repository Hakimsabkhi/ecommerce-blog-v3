"use client";

import React, { Key, useEffect, useState } from 'react';
import Image from 'next/image';
import { FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../LoadingSpinner';
import { useRouter } from 'next/navigation';


// Define interfaces
interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface OrderItem {
  _id: Key | null | undefined;
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
  deliveryMethod:string;
  deliveryCost:string;
  total: number;
  orderStatus: string;
}

interface OrderSummaryProps {
  data: string;
}


// Fetch data from the API
async function fetchData(orderRef: string): Promise<Order> {
  const res = await fetch(
    `api/order/getorderbyref/${orderRef}`,
    {
      method: 'GET',
      next: { revalidate: 0 }, // Disable caching to always fetch the latest data
    }
  );
  if (!res.ok) {
    throw new Error("Order not found");
  }

  const data: Order = await res.json();
 
  return data;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ data }) => {
  const [order, setOrder] = useState<Order | null>(null); 
  const [loading, setLoading] = useState(true);
  const router =useRouter();
  // Fetch the order data when the component mounts


  useEffect(() => {
    const getOrderData = async () => {
      try {
        const result: Order = await fetchData(data);
       
        setOrder(result);
       
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getOrderData();
  }, [data]);

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (!order) {
    return <div>Order data not found.</div>;
  }

  return (
    <div className="w-full flex flex-col items-center py-8 pt-16">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[50%]">
        {/* Success Icon and Thank You Message */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <FiCheckCircle className="text-green-500 w-12 h-12" />
          <h2 className="text-3xl font-bold text-green-500">Thanks for your order!</h2>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-300 mt-4 pt-4">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <p className="text-gray-700">
            Your order <span className="font-bold">#{order.ref}</span> has been successfully paid.
          </p>

          <div className="flex justify-between mt-4">
            <span className="text-lg font-bold">Total paid (TTC):</span>
            <span className="text-lg font-bold">
              {order.total ? order.total.toFixed(2) : '0.00'} TND
            </span>
          </div>

          {/* Product Summary */}
          <div className="mt-6">
            <p className="font-semibold text-lg mb-2">Article:</p>
            <div className="flex flex-col divide-y divide-gray-200">
              {order.orderItems.length > 0 ? (
                order.orderItems.map((item: OrderItem) => (
                  <div key={item._id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Image
                        className="rounded-lg"
                        src={item.image || "/path/to/default-image.jpg"}
                        alt={item.name}
                        width={100}
                        height={100}
                      />
                      <div>
                        <p className="text-lg font-semibold">{item.name}</p>
                        {item.discount > 0 ? (
                          <p className="text-sm text-gray-600">
                            {(item.price - (item.price * item.discount) / 100).toFixed(2)} TND
                            (Discounted)
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">{item.price.toFixed(2)} TND</p>
                        )}
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold">
                      {(
                        item.discount > 0
                          ? (item.price - (item.price * item.discount) / 100) * item.quantity
                          : item.price * item.quantity
                      ).toFixed(2)}{' '}
                      TND
                    </p>
                  </div>
                ))
              ) : (
                <p>No items found</p>
              )}
            </div>
          </div>

          {/* Thank You Message */}
          
          <div className="mt-8">
            <p className="text-gray-700">
         Payment Method : <span className="font-bold">{order.paymentMethod}</span>
            </p>
          </div>
          <div className="mt-8">
            <p className="text-gray-700">
          Delivery Methods : <span className="font-bold uppercase">{order.deliveryMethod}</span>
            </p>
          </div>
         {Number(order.deliveryCost)!=0 && <div className="mt-8">
            <p className="text-gray-700">
            Shopping Fees : <span className="font-bold">{Number(order.deliveryCost).toFixed(2)} TND</span>
            </p>
          </div>}
          <div className="mt-8">
            <p className="text-gray-700">
              Your order <span className="font-bold">#{order.ref}</span> was successfully paid.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-gray-700 uppercase font-bold">
              Your address {order.address.governorate}/{order.address.city}/{order.address.zipcode}/{order.address.address} .
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          
          <button  onClick={()=>router.push("/")} className="nav-btn hover:bg-NavbuttonH uppercase font-bold px-4 py-2">
            Go to Home Page
          </button>

          <button onClick={()=>router.push("/orderhistory")} className="nav-btn hover:bg-NavbuttonH uppercase font-bold px-4 py-2">
            Check Order Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

 "use client"
import React, { Key, useEffect, useState } from 'react';

import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { useParams, useRouter } from 'next/navigation';

import LoadingSpinner from '../LoadingSpinner';
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
    refproduct:string;
    product: string;
    name: string;
    quantity: number;
    image: string;
    discount: number;
    price: number;
  }
  
  interface Order {
    _id: string;
    user: User;
    ref: string;
    address: Address;
    orderItems: OrderItem[];
    paymentMethod: string;
    deliveryMethod:string;
    deliveryCost:number;
    total: number;
    orderStatus: string;
    createdAt:string
  }
  interface User{
    username:string
    phone:number
  }
const Orderone = () => {
    const params = useParams() as { id: string }; // Explicitly type the params object
   const router =useRouter();
    const [order, setOrder] = useState<Order | null>(null); 
    const [loading, setLoading] = useState(true);
  

    useEffect(() => {
      // Fetch category data by ID
      const fetchOrderData = async () => {
        try {
          const response = await fetch(`/api/order/admin/getorderbyref/${params.id}`);
    
          if (!response.ok) {
            throw new Error('Failed to fetch order data');
          }
    
          const data = await response.json();
          setOrder(data);
          setLoading(false);
    
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
      };
      
      fetchOrderData();
     
    }, [params.id]);

if(!order){
    <div>no data</div>
}
if (loading) {
  return <LoadingSpinner />;
}
    return (
        <div className="w-full flex justify-center py-40">
            <div className="rounded-xl w-[80%] max-lg:w-[95%] border-2 flex flex-col justify-center itesm-center">
                <div className="flex max-xl:flex-col justify-between items-center p-8 border-b-2 ">
                    <div className='flex flex-col gap-4'>
                        <p className="flex items-center gap-1">
                            Order ID:
                            <span className='text-blue-500'>
                               {order?.ref}
                            </span>
                        </p>
                        <p className="flex items-center gap-1">
                            Order :
                            <span className='text-gray-400'>    {order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Date not available'}</span>
                        </p>
                    </div>
                    <div className='bg-primary rounded-md text-white  h-[auto] w-[15%] max-xl:w-[50%]  items-center justify-center flex-grow-1 p-5'>
                    <p className='rounded-lg font-bold text-left '>Name : {order?.user?.username}</p>
                    <p className='rounded-lg font-bold text-left '>Phone Number : {order?.user?.phone}</p>
                    <p className='rounded-lg font-bold text-left '>Address : {order?.address.address}</p>
                    <p className='rounded-lg font-bold text-left '>{order?.address.governorate}</p>
                    <p className='rounded-lg font-bold text-left '>{order?.address.city}/{order?.address.zipcode}</p>
                  
                    </div>
                   
                </div>
                {order?.orderItems.map((item) => (          <div key={item._id} className='flex flex-col  w-[80%] max-lg:w-[95%] divide-y-2  mx-auto border-b-2'>
                    <div className='flex max-xl:flex-col items-center justify-between py-4 max-xl:gap-10 '>
                        <div className="flex max-lg:justify-between max-lg:w-full gap-4 max-md:flex-col max-md:items-center">
                            <Image src={item.image} alt={item.name} width={200} height={200} />
                            <div className='flex flex-col justify-between max-md:items-center'>
                                <span className='text-2xl font-bold'>{item.name}</span>
                               
                                <div className='flex items-center text-xl'>
                                    <div className='pr-6 py-2 border-r-2'>ref : <span className='text-gray-400'>{item.refproduct}</span></div>
                                    <div className='px-6 py-2'>QTY : <span className='text-gray-400'>{item.quantity}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-start gap-8 max-lg:w-full max-lg:justify-between max-md:flex-col max-md:items-center'>
                            <div className='flex lg:flex-col gap-2 text-xl'>
                                <p>price</p>
                                <div className='text-blue-500'>{item.discount != null && item.discount > 0 ? (
                        <p>
                          {" "}
                          {(
                            item.price -
                            (item.price * (item.discount ?? 0)) / 100
                          ).toFixed(2)}
                          TND
                        </p>
                      ) : (
                        <p>{item.price.toFixed(2)} TND</p>
                      )}</div>
                            </div>
                            
                        </div>
                    </div>
                    
                </div>))}
                <div className="flex max-md:flex-col border-t-2">
                <div className="flex items-center cursor-pointer justify-center gap-4 p-8 w-[20%] max-md:w-full lg:border-r-2">
                <button onClick={()=>router.push("/admin/order")} type='button' className='flex flex-col-2 items-center gap-2'>  <RxCross1 size={35}/>
                        <p className='text-xl font-bold'>Cancel </p></button> 
                    </div>
                    <div className="flex items-center justify-between p-8 w-[80%] max-md:w-full max-md:border-t-2 text-xl font-bold font-poppins  ">
                        <div className='grid grid-rows-2 capitalize'>
                       <div className='grid grid-cols-2 gap-3'> <p>Payment Method </p><span className='text-gray-400 '>{order?.paymentMethod}</span></div>
                        {order?.deliveryMethod && (<div className='grid grid-cols-2 gap-2'><p> Delivery Method </p><span className='text-gray-400'> {order?.deliveryMethod} </span></div>)}
                        </div>
                        <div className='grid grid-cols-2'>
                        { order?.deliveryCost!=0 &&    (<><p> Fee Shopping </p><span className='text-blue-400 flex justify-end'> {order?.deliveryCost} TND</span></> )}
                        <p>Total Price </p><span className='text-blue-500 flex justify-end'>{order?.total} TND</span>
                        </div>
                    </div>
                
                </div>
            </div>            
        </div>
    );
}

export default Orderone;

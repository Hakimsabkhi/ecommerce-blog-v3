import React, { useCallback, useEffect, useState } from 'react'
import FormAddress from './FormAddress'

type Address = {
    _id: string;
    governorate: string;
    city: string;
    address: string;
    zipcode: string;
  };

const Addresse: React.FC = () => {
    
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const toggleFormVisibility = () => {
        setIsFormVisible(true);
      };
      const toggleForminVisibility = () => {
        setIsFormVisible(false);
      };
    
      const getAddress = useCallback(async () => {
      try {
        const response = await fetch("/api/address/getaddressbyuser", {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch address");
        }
  
        const data = await response.json();
        setIsFormVisible(false);
        setAddresses(data); // Update state with fetched data
      } catch (error: unknown) {
        // Handle different error types effectively
        if (error instanceof Error) {
          console.error("Error deleting category:", error.message);
        } else if (typeof error === "string") {
          console.error("String error:", error);
        } else {
          console.error("Unknown error:", error);
        }
      }
    }, []);
  
    useEffect(() => {
      getAddress(); // Call the async function when the component mounts
    }, [getAddress]);
    
  return (
    <><FormAddress isFormVisible={isFormVisible}toggleForminVisibility={toggleForminVisibility}  getAddress={getAddress}/>
    <div className="sm:col-span-2 ">
    <h3 className="text-xl font-semibold pb-3 text-gray-900 dark:text-white">
           Delivery Address
         </h3>
       <div className="grid grid-cols-1 gap-4 md:grid-cols-1 mb-4">
         <select
           name="address-method"
           className="rounded-lg border w-border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800 w-full"
         >
          <option>
              Select Address
             </option>
           {addresses.map((address) => (
             <option key={address._id} value={address._id}>
               {address.address}, {address.governorate}/{address.city}/
               {address.zipcode}
             </option>
           ))}
         </select>
       </div>
       <button 
        onClick={toggleFormVisibility}
               type="button"
               className="flex w-full items-center justify-center gap-2  rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
             >
               <svg
                 className="h-5 w-5"
                 aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="24"
                 fill="none"
                 viewBox="0 0 24 24"
               >
                 <path
                   stroke="currentColor"
                   
                   
                   
                   d="M5 12h14m-7 7V5"
                 />
               </svg>
              Add new address
             </button>
           
             </div></>
  )
}

export default Addresse
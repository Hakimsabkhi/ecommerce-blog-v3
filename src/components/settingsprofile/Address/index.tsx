"use client"

import React, { useCallback, useEffect, useState } from 'react'
import AddAddress from './AddAddress';
import { toast } from 'react-toastify';
import UpdateAddress from './UpdateAddress';

type Address = {
  _id: string;
  governorate: string;
  city: string;
  address: string;
  zipcode: string;
};
const Address = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressData, setAddressData] = useState({
    _id: "",
    governorate: "",
    city: "",
    address: "",
    zipcode: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFormupdate,setIsFormupdate]= useState(false);
  const toggleFormVisibility = () => {
      setIsFormVisible(true);
    };
    const toggleForminVisibility = () => {
      setIsFormVisible(false);
    };
    const DeleteAddress = async (id: string) => {
      try {
        const response = await fetch(
          `/api/address/deleteAddressbyuser/${id}`,
          {
            method: "DELETE",
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to delete category");
        }
  
        // Refresh categories after deletion
      
       
        getAddress();
        toast.success("address delete successfully!");
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
    };
   function togglecloseUpdateVisibility(){
    setIsFormupdate(false)
   }
   function hendlupdate(address:Address){
    setAddressData(address)
    setIsFormupdate(true)
   }
  const getAddress = useCallback(async () => {
    try {
      const response = await fetch("/api/address/getaddressbyuser", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const data = await response.json();
   
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
    
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Address</h2>
      <p className="text-sm text-gray-500 mb-6">liste address you have for delivery .</p>
      {addresses.map((address) => (   <div key={address._id} className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2 pt-2">
          <div>
            <p className="font-medium text-gray-900  "> {address.address} {address.city} {address.governorate} {address.zipcode}</p>
          </div>
          <div className='gap-2 flex'>
          <button type='button' onClick={()=>hendlupdate(address)} className="text-indigo-600 text-sm font-semibold hover:underline">
            Update
          </button>
          <button type='button' onClick={()=>DeleteAddress(address._id)} className="text-indigo-600 text-sm font-semibold hover:underline">
            delete
          </button>
          </div>
        </div>
    { isFormupdate && <UpdateAddress address={addressData} togglecloseUpdateVisibility={togglecloseUpdateVisibility}   getAddress={getAddress}/>}
        
      </div>))}
      <button type="button"  onClick={toggleFormVisibility} className="text-indigo-600 text-sm font-semibold hover:underline">
          + Add New Address
        </button>
     <AddAddress isFormVisible={isFormVisible}toggleForminVisibility={toggleForminVisibility}  getAddress={getAddress} />  </div>
  )
}

export default Address
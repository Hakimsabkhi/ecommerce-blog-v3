import React, { useEffect, useState } from 'react'
import { Governorate, city } from "@/assets/tunisia";
import { toast } from 'react-toastify';
interface AddAddressProps{
    isFormVisible:boolean;

    getAddress():void;
    toggleForminVisibility():void;
    
}
interface Governorate {
    id: number;
    name: string;
  }
  interface Municipality {
    id: number;
    name: string;
    governorate_id: number;
  }
  const governorates: Governorate[] = Governorate;

const municipalities: Municipality[] = city;
const AddAddress: React.FC<AddAddressProps> = ({ isFormVisible , toggleForminVisibility,getAddress}) => {
  const [selectedGovernorate, setSelectedGovernorate] = useState<
    number | undefined
  >(undefined);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState<
    Municipality[]
  >([]);
  const [addressData, setAddressData] = useState({
    governorate: "",
    city: "",
    address: "",
    phone: "",
    zipcode: "",
  });
  useEffect(() => {
    // Update municipalities based on selected governorate
    if (selectedGovernorate !== undefined) {
      setFilteredMunicipalities(
        municipalities.filter(
          (municipality) => municipality.governorate_id === selectedGovernorate
        )
      );
    }
  }, [selectedGovernorate]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressData({ ...addressData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("governorate", addressData.governorate);
    formData.append("city", addressData.city);
    formData.append("address", addressData.address);
    formData.append("zipcode", addressData.zipcode);

    try {
      const response = await fetch("/api/address/postAddress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json(); // Parse the response JSON
        // Handle different statuses with specific messages
        switch (response.status) {
          case 400:
            toast.error(result.message || "All fields are required.");
            break;
          case 405:
            toast.error(
              result.message || "You have reached the limit of 2 addresses."
            );
            break;
          case 500:
            toast.error(result.message || "Error creating address.");
            break;
          default:
            toast.error(result.message || "An unexpected error occurred.");
        }
        return; // Exit function to avoid proceeding with the success case
      }
      toggleForminVisibility()
      getAddress();
      toast.success(`Address added successfully!`);
      await response.json(); // or await response.text() if you expect text response
    } catch (error) {
      console.log({ error });
      toast.error(
        `${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };
  const handleGovernorateChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedGovernorate(Number(event.target.value));
    setAddressData((prevData) => ({
      ...prevData,
      governorate: event.target.options[event.target.selectedIndex].text, // Update state with selected governorate name
    }));
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAddressData((prevData) => ({
      ...prevData,
      city: event.target.options[event.target.selectedIndex].text, // Update state with selected city name
    }));
  };

  return (

    <>
    {isFormVisible && (
        <div
        className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover backdrop-filter backdrop-brightness-75"      
      >
        <div className="absoluteopacity-80 inset-0 z-0 "></div>
       <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
         <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
           New Address 
         </h2>

         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           <div>
             <div className="mb-2 flex items-center gap-2">
               <label className="block text-sm font-medium text-gray-900 dark:text-white">
                 {" "}
                 Governorate*{" "}
               </label>
             </div>
             <select
               name="governorate"
               id="select-governorate"
               onChange={handleGovernorateChange}
               className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
             >
               <option value="">Select Governorate</option>
               {governorates.map((governorate) => (
                 <option key={governorate.id} value={governorate.id}>
                   {governorate.name}
                 </option>
               ))}
             </select>
           </div>

           <div>
             <div className="mb-2 flex items-center gap-2">
               <label className="block text-sm font-medium text-gray-900 dark:text-white">
                 {" "}
                 City*{" "}
               </label>
             </div>
             <select
               name="city"
               onChange={handleCityChange}
               id="select-city-input-3"
               className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
             >
               <option value="">Select City</option>
               {filteredMunicipalities.map((municipality) => (
                 <option key={municipality.id} value={municipality.id}>
                   {municipality.name}
                 </option>
               ))}
             </select>
           </div>

        
           <div>
             <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
               {" "}
               Zip Code*{" "}
             </label>
             <input
               value={addressData.zipcode}
               onChange={handleChange}
               name="zipcode"
               type="zipcode"
               id="zipcode"
               className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
               placeholder="xxxx "
               required
             />
           </div>

        
             <div className="mb-4 ">
               <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                 {" "}
                 Address*{" "}
               </label>
               <input
                 value={addressData.address}
                 onChange={handleChange}
                 name="address"
                 type="Address"
                 id="Address"
                 className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                 placeholder="xx street "
                 required
               />
             </div>
           
           </div>
           <div className="flex justify-end items-end gap-2">
             <button
               type="submit"
               className="flex w-full items-end justify-end gap-2 rounded-lg text-indigo-600 text-sm font-semibold hover:underline "
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
               Add  Address
             </button>
             <button
             onClick={()=>toggleForminVisibility()}
             type="button"
             className="text-indigo-600 text-sm font-semibold hover:underline"

             >Canncel</button>
           </div>
       </form>
       </div>)}
      </>
  )
}

export default AddAddress
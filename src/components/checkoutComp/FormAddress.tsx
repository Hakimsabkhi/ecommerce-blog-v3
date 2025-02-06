import React, { useEffect, useState } from 'react'
import { Governorate, city } from "@/assets/tunisia";
import { toast } from 'react-toastify';
interface FormAddressProps{
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
const FormAddress: React.FC<FormAddressProps> = ({ isFormVisible , toggleForminVisibility,getAddress}) => {
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
    formData.append("phone", addressData.phone);
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
      toggleForminVisibility();
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
           Delivery Details
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
               Phone Number*
             </label>
             <div className="flex items-center">
               <button
                 id="dropdown-phone-button-3"
                 data-dropdown-toggle="dropdown-phone-3"
                 className="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                 type="button"
               >
                 <svg
                   version="1.1"
                   id="Layer_1"
                   xmlns="http://www.w3.org/2000/svg"
                   xmlnsXlink="http://www.w3.org/1999/xlink"
                   viewBox="0 0 512 512"
                   xmlSpace="preserve"
                 >
                   <path
                     style={{ fill: "#FF4B55" }}
                     d="M473.655,423.724H38.345C17.167,423.724,0,406.557,0,385.379V126.621 c0-21.177,17.167-38.345,38.345-38.345h435.31c21.177,0,38.345,17.167,38.345,38.345V385.38 C512,406.557,494.833,423.724,473.655,423.724z"
                   />
                   <path
                     style={{ fill: "#F5F5F5" }}
                     d="M257.002,167.724c48.718,0,88.205,39.594,88.205,88.276c0,48.823-39.488,88.276-88.205,88.276 c-48.822,0-88.346-39.453-88.346-88.276C168.655,207.318,208.179,167.724,257.002,167.724"
                   />
                   <g>
                     <path
                       style={{ fill: "#FF4B55" }}
                       d="M273.042,305.466c-27.327,0-49.493-22.165-49.493-49.461c0-27.23,22.165-49.395,49.493-49.395 c9.295,0,17.981,2.604,25.405,7.102c1.112,0.674,2.282-0.782,1.355-1.695c-11.138-10.974-26.389-17.771-43.236-17.771 c-34.2,0-61.891,27.692-61.891,61.761c0,34.135,27.691,61.825,61.891,61.825c16.838,0,32.083-6.792,43.219-17.763 c0.927-0.913-0.243-2.369-1.355-1.696C291.01,302.867,282.33,305.466,273.042,305.466z"
                     />
                     <path
                       style={{ fill: "#FF4B55" }}
                       d="M268.52,221.387l13.644,18.526l21.945-6.912c2.841-0.895,5.186,2.342,3.452,4.762l-13.402,18.701 l13.355,18.735c1.729,2.425-0.625,5.656-3.464,4.754l-21.927-6.968l-13.692,18.49c-1.772,2.393-5.572,1.154-5.591-1.825 l-0.149-23.007l-21.816-7.307c-2.825-0.946-2.819-4.943,0.008-5.881l21.835-7.252l0.207-23.007 C262.951,220.218,266.753,218.988,268.52,221.387z"
                     />
                   </g>
                 </svg>
                 +216
                 <svg
                   className="-me-0.5 ms-2 h-4 w-7"
                   aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
                   width="24"
                   height="24"
                   fill="none"
                   viewBox="0 0 24 24"
                 >
                   <path
                     stroke="currentColor"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="m19 9-7 7-7-7"
                   />
                 </svg>
               </button>

               <div className="relative w-full">
                 <input
                   name="phone"
                   value={addressData.phone}
                   onChange={handleChange}
                   type="tel"
                   id="phone-input"
                   className="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500"
                   pattern="[0-9]{8}"
                   minLength={8} // Enforce minimum length of 8
                   maxLength={8}
                   placeholder="XX XXX XXX"
                   required
                 />
               </div>
             </div>
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

           <div className="sm:col-span-2">
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
             <div className="flex justify-start gap-2">
             <button
               type="submit"
               className="flex w-full items-center justify-center gap-2 rounded-lg border text-white border-primary bg-primary px-5 py-2.5 text-sm font-medium  hover:bg-[#15335E] hover:border-[#15335E] "
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
               Add  address
             </button>
             <button
             onClick={()=>toggleForminVisibility()}
             type="button"
             className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"

             >Canncel</button>
           </div>
           </div>
         </div>
       </form>
       </div>)}
      </>
  )
}

export default FormAddress
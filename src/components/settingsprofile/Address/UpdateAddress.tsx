import React, { useState, useEffect } from 'react';
import { Governorate, city } from "@/assets/tunisia";
import { toast } from 'react-toastify';

interface AddressProps {
  address: Address;
  togglecloseUpdateVisibility: () => void;
  getAddress:()=>void;
}

interface Address {
  _id:string;
  governorate: string;
  city: string;
  address: string;
  zipcode: string;
}

const UpdateAddress: React.FC<AddressProps> = ({ address, togglecloseUpdateVisibility ,getAddress}) => {
  const [addressData, setAddressData] = useState({
    governorate: '',
    city: '',
    address: '',
    zipcode: '',
  });

  const [filteredMunicipalities, setFilteredMunicipalities] = useState<{ id: number, name: string }[]>([]);
  
  useEffect(() => {
    if (address) {
      setAddressData(address);
    }
  }, [address]);

  const handleGovernorateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const governorateId = e.target.value;
    setAddressData((prevData) => ({
      ...prevData,
      governorate: governorateId,
      city: '', // Reset city when governorate changes
    }));

    const filteredCities = city.filter((c) => c.governorate_id === parseInt(governorateId));
    setFilteredMunicipalities(filteredCities);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setAddressData((prevData) => ({
      ...prevData,
      city,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('governorate', addressData.governorate);
    formData.append('city', addressData.city);
    formData.append('address', addressData.address);
    formData.append('zipcode', addressData.zipcode);

    try {
      const response = await fetch(`/api/address/updateAddressbyid/${address._id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update address');
      }

      // Display success message or perform additional actions
      getAddress();
      togglecloseUpdateVisibility();
      toast.success( result.message);
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

  return (
    <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover backdrop-filter backdrop-brightness-75">
      <div className="absolute opacity-80 inset-0 z-0"></div>
      <div className="space-y-4 w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
        <h2 className="text-xl font-semibold mb-4">Update Address</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Governorate</label>
              <select
                value={addressData.governorate}
                onChange={handleGovernorateChange}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select Governorate</option>
                {Governorate.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {gov.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select
                value={addressData.city}
                onChange={handleCityChange}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                disabled={!addressData.governorate}
              >
                <option value="">Select City</option>
                {filteredMunicipalities.map((municipality) => (
                  <option key={municipality.id} value={municipality.name}>
                    {municipality.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={addressData.address}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter your address"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Zipcode</label>
              <input
                type="text"
                name="zipcode"
                value={addressData.zipcode}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter your zipcode"
              />
            </div>
          </div>

          <div className="flex justify-end items-end gap-2">
            <button type="submit" className="flex w-full items-center justify-end gap-2 rounded-lg text-indigo-600 text-sm font-semibold hover:underline ">
              Update
            </button>
            <button
              type="button"
              onClick={togglecloseUpdateVisibility}
              className="text-indigo-600 text-sm font-semibold hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAddress;

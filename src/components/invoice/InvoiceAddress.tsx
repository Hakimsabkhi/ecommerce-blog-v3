import React from 'react';

// Define an interface for the address state
interface Address {
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

// Define the component's props interface (if applicable)
interface InvoiceAddressProps {
  showNewAddressModal: boolean;
  handleAddNewAddress: (e: React.FormEvent) => void;
  handlecloseAddress: () => void;
  setNewAddress: (address: Address) => void; // Update this line with correct type
  newAddress: Address; // Type the newAddress properly

}

const InvoiceAddress: React.FC<InvoiceAddressProps> = ({
  showNewAddressModal,
  handleAddNewAddress,
  handlecloseAddress,
  setNewAddress,
  newAddress,

}) => {


  return (
    <div>
                  {/* showNewAddressModal*/} 
                  {showNewAddressModal && (
  <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-md w-[90%] max-w-md">
      <h3 className="text-lg font-bold mb-4">Add New Address</h3>
      <form
        onSubmit={handleAddNewAddress}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          placeholder="Governorate"
          required
          value={newAddress.governorate}
          onChange={(e) =>
            setNewAddress({ ...newAddress, governorate: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="City"
          required
          value={newAddress.city}
          onChange={(e) =>
            setNewAddress({ ...newAddress, city: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Zip Code"
          required
          value={newAddress.zipcode}
          onChange={(e) =>
            setNewAddress({ ...newAddress, zipcode: e.target.value })
          }
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Address"
          required
          value={newAddress.address}
          onChange={(e) =>
            setNewAddress({ ...newAddress, address: e.target.value })
          }
          className="border p-2 rounded"
        ></textarea>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => handlecloseAddress()}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
           
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  )
}

export default InvoiceAddress
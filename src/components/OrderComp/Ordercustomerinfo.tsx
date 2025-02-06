import React from 'react'
interface User {
    _id: string;
    username: string;
    phone: number;
  }
  
interface Address {
    _id: string;
    user: User;
    governorate: string;
    city: string;
    zipcode: string;
    address: string;
  }
  interface DeliveryMethod {
    id: string;
    label: string;
    cost: number;
  }
interface OrdercustomerinfoProps {
    searchTerm: string;
    handleSearchCustomers: (e: React.ChangeEvent<HTMLInputElement>) => void;
    OpenCustomer:boolean;
    filteredCustomers:User[];
    handleCustomerSelect:(customerId: string, username: string)=>void;
    address:string;
    setAddress:React.Dispatch<React.SetStateAction<string>>;
    addresses:Address[];
    setShowNewAddressModal:React.Dispatch<React.SetStateAction<boolean>>;
    Deliverymethod:string;
    handleDeliveryChange:(e: React.ChangeEvent<HTMLSelectElement>)=>void;
    deliveryMethods: DeliveryMethod[];
    paymentMethod:string;
    setPaymentMethod:React.Dispatch<React.SetStateAction<string>>;
    isOn:boolean;
    handleToggle:()=>void;
  }
const Ordercustomerinfo :React.FC<OrdercustomerinfoProps> = ({
    searchTerm,
    handleSearchCustomers,
    OpenCustomer,
    filteredCustomers,
    handleCustomerSelect,
    address,
    setAddress,
    addresses,
    setShowNewAddressModal,
    Deliverymethod,
    handleDeliveryChange,
    deliveryMethods,
    paymentMethod,
    setPaymentMethod,
    isOn,
  handleToggle,
  }) =>  {
  return (
    <div className="grid grid-cols-2 justify-center  gap-2">
    <div className="w-full">
      <label htmlFor="customer">Customer</label>
      <div className="relative">
        <input
          id="customer"
          type="text"
            className=" p-2 border  rounded-sm mb-3 w-full"
          placeholder="Search customer by name"
          value={searchTerm}
          onChange={handleSearchCustomers} // Call this on input change
        />
        <ul className="absolute top-full mt-1 w-full bg-white  rounded-md shadow-md max-h-60 overflow-auto">
          {OpenCustomer && filteredCustomers.map((cust) => (
            <li
              key={cust._id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleCustomerSelect(cust._id, cust.username)}
            >
              {cust.username}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="w-full">
      <label htmlFor="address">Address</label>
      <select
        className="border-[1px] p-2 rounded-sm mb-3 w-full"
        required
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      >
        <option value="" disabled>
          Select an address
        </option>
        {addresses.map((addr) => (
          <option key={addr._id} value={addr._id}>
            {`${addr.address}, ${addr.city}, ${addr.governorate} - ${addr.zipcode}`}
          </option>
        ))}
      </select>
      <button
type="button"
onClick={() => setShowNewAddressModal(true)}
className="text-blue-600 underline"
>
Add New Address
</button>


    </div>
      {/* Delivery Method */}
    <div className="w-full">
      <label htmlFor="deliveryMethod">Mode de livraison</label>
      <select
        className="border-[1px] p-2 rounded-sm mb-3 w-full"
        required
        value={Deliverymethod}
        onChange={handleDeliveryChange}
      >
        <option value="" disabled>
          Select Mode de livraison
        </option>
        {deliveryMethods.map((method) => (
          <option key={method.id} value={method.id} >
           {method.label}-{method.cost === 0 ? "free" : `${method.cost} DT`}
          </option>
        ))}
      </select>
    </div>
 {/* Payment Method */}
 <div className="w-full">
      <label htmlFor="paymentMethod">Mode de Payment</label>
      <select
        className="border-[1px] p-2 rounded-sm mb-3 w-full"
        required
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="" disabled>
          Select Mode de Payment
        </option>
        <option value="virement">Virement</option>
        <option value="carte">Carte Bancaire</option>
        <option value="onDelivery">Payment on Delivery</option>
        <option value="express">Paiement Express</option>
      </select>
    </div>
    <div className="w-full">
      <label htmlFor="paymentMethod">Timbre Fiscale</label>
    
<label htmlFor="toggle" className="flex items-center cursor-pointer">
{/* Label text */}
<span className="mr-3 text-gray-700">{isOn ? 'On' : 'Off'}</span>

{/* Toggle container */}
<div
onClick={handleToggle}
className={`relative inline-block w-12 h-6 rounded-full ${isOn ? 'bg-green-500' : 'bg-gray-300'}`}
>
{/* Circle inside the toggle */}
<div
  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isOn ? 'transform translate-x-6' : ''}`}
></div>
</div>
</label>

    </div>
    
  </div>
  )
}

export default Ordercustomerinfo
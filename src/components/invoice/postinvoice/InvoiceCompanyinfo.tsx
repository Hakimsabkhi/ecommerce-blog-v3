import React from 'react'

        

interface Companies {
  _id: string;
    name: string;
    matriculefiscal:string;
    gerantsoc:string;
}
             
  interface DeliveryMethod {
    id: string;
    label: string;
    cost: number;
  }
interface InvoiceCustomerinfoProps {
    searchTerm: string;
    handleSearchCompany: (e: React.ChangeEvent<HTMLInputElement>) => void;
    OpenCompany:boolean;
    filteredCompany:Companies[];
    handleCompanySelect:(customerId: string, username: string)=>void;
    Deliverymethod:string;
    handleDeliveryChange:(e: React.ChangeEvent<HTMLSelectElement>)=>void;
    deliveryMethods: DeliveryMethod[];
    paymentMethod:string;
    setPaymentMethod:React.Dispatch<React.SetStateAction<string>>;
  
  }
const InvoiceCustomerinfo:React.FC<InvoiceCustomerinfoProps> = ({
    searchTerm,
    handleSearchCompany,
    OpenCompany,
    filteredCompany,
    handleCompanySelect,
    Deliverymethod,
    handleDeliveryChange,
    deliveryMethods,
    paymentMethod,
    setPaymentMethod,
  
  }) =>  {
  return (
    <div className="grid grid-cols-1 justify-center  gap-2">
    <div className="w-full">
      <label htmlFor="company">Company</label>
      <div className="relative">
        <input
          id="company"
          type="text"
            className=" p-2 border  rounded-sm mb-3 w-full"
          placeholder="Search company by name"
          value={searchTerm}
          onChange={handleSearchCompany} // Call this on input change
        />
        <ul className="absolute top-full mt-1 w-full bg-white  rounded-md shadow-md max-h-60 overflow-auto">
          {OpenCompany && filteredCompany.map((cust) => (
            <li
              key={cust._id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleCompanySelect(cust._id, cust.name)}
            >
             {cust.matriculefiscal}- {cust.name}-{cust.gerantsoc}
            </li>
          ))}
        </ul>
      </div>
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

    
  </div>

  )
}

export default InvoiceCustomerinfo
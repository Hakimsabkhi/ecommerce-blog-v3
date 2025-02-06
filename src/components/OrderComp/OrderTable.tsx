import React from 'react';

import { IoIosCloseCircleOutline } from 'react-icons/io';

interface orderItem {
  refproduct: string;
  product: string;
  name: string;
  tva: number;
  quantity: number;
  image: string;
  discount: number;
  price: number;

}

interface OrderTableProps {
  items: orderItem[]; // Assuming orderItem is defined elsewhere
  handleDeleteItem: (ref: string) => void; // Define the type of the function
  calculateTotal:(items:orderItem[],costs:number,isOn:boolean)=>void;
  costs:number;
  isOn:boolean;
}

const OrderTable: React.FC<OrderTableProps> = ({ items,handleDeleteItem,calculateTotal ,costs,isOn}) => {
  // Calculate total amount, including discount and TVA
const total=calculateTotal(items,costs,isOn);  


  return (
    <div className="invoice-table">
      <h2 className="font-bold text-xl mb-4">Order Items</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Quantity</th>
            <th className="border p-2 text-left">Pr Brut</th>
            <th className="border p-2 text-left">Rem</th>
            <th className="border p-2 text-left">TVA</th>
            <th className="border p-2 text-left">Total HT</th>
            <th className="border p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className=" bg-slate-50">
              <td className="p-2">{item.name}</td>
              <td className=" p-2">{item.quantity}</td>
              <td className=" p-2">{item.price.toFixed()} TND</td>
              <td className=" p-2">{item.discount}%</td>
              <td className=" p-2">{item.tva}%</td>
              <td className=" p-2">
                {(
                 (((item.price - item.price * (item.discount / 100))/(1+(item.tva/100)))*item.quantity) 
                ).toFixed(3)} TND
              </td>
              <td className="p-2"><button onClick={() => handleDeleteItem(item.refproduct)}type="button" className='text-red-700' ><IoIosCloseCircleOutline  size={25}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-bold mt-4">Total: {Number(total).toFixed(3)} TND</h3>
    </div>
  );
};

export default OrderTable;

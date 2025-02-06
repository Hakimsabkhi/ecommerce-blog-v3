
import React from 'react';
interface CartItem {
    _id: string;
    name: string;
    description: string;
    ref: string;
    price: number;
    imageUrl?: string;
    stock: number;
    discount?: number;
    color?: string;
    material?: string;
    status?: string;
    quantity: number;
  }
  
  // Define the props the component expects
  interface TotalProps {
    items: CartItem[];
  }
  
  const Total: React.FC<TotalProps> = ({ items }) => {
 
    const totalPrice = items.reduce((total, item) => {
        const finalPrice = item.discount != null && item.discount > 0 
          ? item.price - (item.price * item.discount / 100)
          : item.price;
        return total + finalPrice * item.quantity;
      }, 0);
    return (
        <span className=" w-[120px] text-lg max-lg:hidden ">{totalPrice.toFixed(2).slice(0,8)} TND</span>
    );
};

export default Total;

"use client"
import React from 'react';
import ProductCard from '../ProductPage/ProductCard';


interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva:number;
  price: number;
  imageUrl?: string;
  category:category
  brand?: Brand; // Make brand optional
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  slug:string;
}
interface category{
  _id:string;
  name:string;
  slug:string;
}

interface Brand {
  _id: string;
  place: string;
  name: string;
  imageUrl: string;
}
interface FifthBlockProp{
  products :ProductData
}
const FifthBlock: React.FC<FifthBlockProp> = ({products}) => {
  const getRandomProducts = (products: ProductData, n: number) => {
    const productArray = Object.values(products); // Convert the object to an array of values
    const shuffled = [...productArray].sort(() => Math.random() - 0.5); // Shuffle the array
    return shuffled.slice(0, n); // Return the first 'n' items
};


  // Get 4 random products
  const randomProducts = getRandomProducts(products, 4);
    return (
      <main className=' desktop bg-white py-10 flex justify-center flex-col  gap-8 p-4 '>
      <hr></hr>
        <p className="text-xl ">Produit Similaire</p>
      
      <div className="grid grid-cols-4 w-full max-sm:grid-cols-1 max-xl:grid-cols-2 group max-2xl:grid-cols-3 gap-8 max-md:gap-3">
        { 
          randomProducts.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))
        }
      </div>
    </main>
    );
}

export default FifthBlock;
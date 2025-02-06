// ProductPage/ProductList.tsx
import React from "react";
import ProductCard from "../Categorys/NotApproved/ProductCard";


interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl?: string;
  brand?: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  category:Category;
  slug:string;
}
interface Category {
  name: string;
  slug:string;
}
interface Brand {
  _id: string;
  name: string;
}

interface ProductListProps {
  products: ProductData[];
 

}

const ProductList: React.FC<ProductListProps> = ({ products   }) => {
  return (
    <div>
    
      {products.length !== 0  ?(
        <div className="grid group grid-cols-3 max-md:grid-cols-1 max-xl:grid-cols-2 max-md:gap-3 gap-8 border-2 p-2">
          {products.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      ):(
        <div className=" text-xl  w-full h-full flex justify-center ">no products available</div>
      )}
    </div>
  );
};

export default ProductList;

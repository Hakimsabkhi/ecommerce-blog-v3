// ProductPage/ProductList.tsx
"use client"
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "@/components/Pagination";


interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva?:number;
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

  const [currentPage, setCurrentPage] = useState<number>(1);
     
       const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
       useEffect(()=>{
        setFilteredProducts(products);
        setCurrentPage(1);
       }, [products])
       const productsPerPage = 9;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  return (
    <div>
    
    
        <div className="grid group grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 max-md:gap-3 gap-8">
          {currentProducts.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
     
        <div className="mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
     
    </div>
  );
};

export default ProductList;

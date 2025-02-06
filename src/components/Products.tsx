import React from "react";
import ProductFilterClient from "@/components/Products/ProductPage/ProductFilterClient"; // <-- Our client component
import { getproductbycatgory } from "@/lib/StaticCatgoryproduct";


interface ProductsPageProps {
  params: {
    slugCategory?: string;
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { slugCategory } = params;
  const category = slugCategory || ""; 
  try {

    const productsRe= await getproductbycatgory(category)
    
    const products = JSON.parse(productsRe)

    return (
      <ProductFilterClient
        products={products}
    
      />
    );
  } catch (error) {
    return <div className="text-red-500 text-center">Error: {String(error)}</div>;
  }
}

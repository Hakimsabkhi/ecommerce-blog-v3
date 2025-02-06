import React from 'react';
import { getproductpromotionData } from '@/lib/StaticCatgoryproduct';
import ProductFilterClient from '@/components/Products/ProductPage/ProductFilterClient';
import { gettitleproduct } from '@/lib/StaticDataHomePage';
import Chairsproduct from '@/components/Chairsproduct';







export default async function promotionPage() {
 
  try {
    const productstitledata= await gettitleproduct()
    const productsRe= await getproductpromotionData()
    
    const products = JSON.parse(productsRe)
    const producttitle = JSON.parse(productstitledata)
    return (
      <><Chairsproduct title={producttitle?.cptitle} banner={producttitle?.cpbanner} url={"/bestcollection"} />
      <ProductFilterClient
        products={products} /></>
    );
  } catch (error) {
    return <div className="text-red-500 text-center">Error: {String(error)}</div>;
  }
}


// 1) Export a `revalidate` constant so the page re-generates every 60 seconds
export const revalidate =1000;

import React from "react";
import ProductCard from "@/components/Products/ProductPage/ProductCard";
import { getproductstatusData, gettitleproduct } from "@/lib/StaticDataHomePage";

interface Brand {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Products {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva: number;
  price: number;
  imageUrl?: string;
  brand?: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  statuspage: string;
  category: Category;
  slug: string;
}



const Collection: React.FC = async () => {
  const rawProducts = await getproductstatusData();
  const rawProduct=JSON.parse(rawProducts)
  const datatitleproduct=await gettitleproduct();
    const titleproduct = JSON.parse(datatitleproduct)
  // Cast `rawProducts` to match the `Products[]` type
  const products: Products[] = Array.isArray(rawProduct) 
  ? rawProduct.map((product: Products) => ({
      ...product,
      _id: product._id?.toString() ?? '', // Ensure _id is treated as a string or fallback to empty string
    }))
  : [];  

  const filteredProductsCount = products.filter(
    (item) => item.statuspage === "best-collection"
  ).length;

  return (
    <div className="desktop max-lg:w-[95%] flex flex-col justify-center items-center gap-10 py-8">
      {filteredProductsCount > 0 && (
        <div className="col-span-full flex flex-col items-center gap-2">
          <h2 className="font-bold text-HomePageTitles text-4xl">
          {titleproduct?.pctitle}
          </h2>
          <p className="text-base text-[#525566]">
            {titleproduct?.pcsubtitle}
            </p>
        </div>
      )}

      <div className="grid grid-cols-4 w-full max-sm:grid-cols-1 max-xl:grid-cols-2 group max-2xl:grid-cols-3 gap-8 max-md:gap-3">
        {products.map(
          (item) =>
            item.statuspage === "best-collection" && (
              <ProductCard key={item._id} item={item} />
            )
        )}
      </div>
    </div>
  );
};

export default Collection;

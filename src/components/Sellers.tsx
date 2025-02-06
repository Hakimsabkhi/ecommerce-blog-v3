import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getBestsellersData, gettitleproduct } from "@/lib/StaticDataHomePage";

// 1) Incremental Static Regeneration at the page level
export const revalidate =1000;

// 2) Fetch sellers (best-selling products) directly from the DB


export default async function Sellers() {
  // 3) Fetch your data
  const bestsellers = await getBestsellersData();
const datatitleproduct=await gettitleproduct();
  const titleproduct = JSON.parse(datatitleproduct)
  // 4) Return a grid similar to Categories
  return (
    <div className="desktop max-md:w-[95%] flex flex-col gap-10 py-8 mx-auto">
      {bestsellers.length > 0 && (
        <div>
          {/* Title + Subtitle */}
          <div className="flex-col flex gap-2 items-center w-full max-lg:text-center">
            <h3 className="font-bold text-4xl text-HomePageTitles">
            {titleproduct?.wbtitle}
            </h3>
            <p className="text-base text-[#525566]">
            {titleproduct?.wbsubtitle}
            </p>
          </div>

          {/* Grid */}
          <div className="gap-4 w-full grid grid-cols-5 max-xl:grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-2 mt-6">
            {bestsellers.map((item, index) => (
              <Link
                className="cursor-pointer"
                key={item._id}
                href={`/${item.slug}`} // or wherever your product page lives
              >
                <div className="relative rounded-full w-full group overflow-hidden">
                  {/* Hover overlay */}
                  <div className="w-full h-full bg-black/60 absolute rounded-full opacity-0 group-hover:opacity-80 duration-500" />
                  
                  {/* Product Name */}
                  <p
                    className="cursor-pointer absolute top-1/2 left-1/2 
                               transform -translate-x-1/2 -translate-y-1/2 
                               bg-white text-black text-lg text-center px-3 py-1 
                               rounded-3xl opacity-90 duration-500"
                  >
                    {item.name}
                  </p>

                  {/* You can display price, discount, etc. similarly */}

                  {/* Product Image */}
                  <Image
                    className="w-full rounded-full"
                    src={item.imageUrl}
                    alt={`Image of ${item.name}`} 
                    width={500}
                    height={500}
                    style={{ objectFit: "contain" }}
                    priority={index === 0} // give priority to first image
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

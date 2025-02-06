import React from "react";
import Image from "next/image";

// Mongoose models & DB connection
import connectToDatabase from "@/lib/db";
import Brand from "@/models/Brand";
import { gettitlebrand } from "@/lib/StaticDataHomePage";

// Enable ISR at the page level
export const revalidate =1000; // Re-generate this page every 60s

// Fetch brands data directly from MongoDB
async function getAllBrands() {
  await connectToDatabase();
  
  const brands = await Brand.find({})
    .populate("user", "_id username")
    .lean();

  return brands.map((brand) => ({
    ...brand,
    _id: brand._id.toString(),
    imageUrl: brand.imageUrl || "/fallback.jpg",
    logoUrl: brand.logoUrl || "/brand-logo-fallback.png",
  }));
}

export default async function BrandsPage() {
  const brands = await getAllBrands();
const datatitlebarnd=await gettitlebrand();
  const titlebrand = JSON.parse(datatitlebarnd)
  // Helper function for the accordion card classes
  const getBrandCardClasses = () =>
    "group/article relative w-full rounded-xl overflow-hidden md:group-hover:[&:not(:hover)]:w-[20%] md:group-focus-within:[&:not(:focus-within):not(:hover)]:w-[20%] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] focus-within:ring focus-within:ring-indigo-300";

  return (
    <div className=" max-md:w-[95%] flex flex-col gap-10 max-md:gap-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 max-md:gap-1 text-center w-full ">
        <h3 className="font-bold text-4xl text-HomePageTitles">
          {titlebrand.title}
        </h3>
        <p className="text-base text-[#525566]">
        {titlebrand.subtitle}
        </p>
      </div>

      {/* Accordion-like Brand Cards */}
      <div className="group w-[80%] flex max-md:flex-col justify-center gap-2 h-[500px] mx-auto">
        {brands.map((brand) => (
          <div key={brand._id} className={getBrandCardClasses()}>
            {/* Background Image */}
            <Image
              className="object-cover w-full h-full"
              src={brand.imageUrl}
              alt={brand.name ?? "Brand image"}
              width={800}
              height={500}
              quality={75}
              priority
            />

            {/* Top Black Overlay (30% height, 50% opacity) */}
            <div className="absolute max-md:hidden top-0 left-0 w-full h-[15%] bg-black/70 z-10"></div>

            {/* Bottom Black Overlay (20% height, 50% opacity) - appears on hover */}
            <div className="absolute max-md:hidden bottom-0 left-0 w-full h-[15%] bg-black/70 opacity-0 group-hover/article:opacity-100 transition-opacity duration-200 z-[15]"></div>

            {/* Overlay with brand details */}
            <div
              className="absolute inset-0 text-white z-20"
            >
              <span className="absolute inset-x-0 top-0 text-2xl max-lg:text-xs max-xl:text-sm uppercase tracking-widest font-bold p-6 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)]">
                {brand.place}
              </span>
              <span className="absolute inset-x-0 bottom-0 max-md:hidden text-2xl uppercase tracking-widest font-bold p-6 opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)]">
                {brand.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

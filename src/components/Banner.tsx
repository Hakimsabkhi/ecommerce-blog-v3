// app/banner/page.tsx
import React from "react";
import Image from "next/image";
import { getWebsiteinfoData } from "@/lib/StaticDataHomePage";

export const revalidate =1000;

export default async function Banner() {
  const companyData = await getWebsiteinfoData();

  return (
    <div className="relative md:h-[600px] shadow-lg">
      <Image
        className="w-full md:h-full"
        fill
        style={{ objectFit: "cover" }}
        alt="banner"
        src={companyData?.imageUrl || "/fallback.jpg"}
        sizes="(max-width: 900px) 400px, 900px"
        loading="eager"
        decoding="async"
        priority // Preload the image
      />
    </div>
  );
}

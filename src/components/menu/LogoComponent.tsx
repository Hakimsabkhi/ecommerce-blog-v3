

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getWebsiteinfo } from "@/lib/StaticDataHomePage";




const Header: React.FC = async() => {
 const company = await getWebsiteinfo();
      const companyData = JSON.parse(company);
  return (
    
      <div className="flex w-fit max-lg:w-[50%] gap-4 items-center justify-around">
        <Link href="/" aria-label="Home page">    
          <Image
              width={300}
              height={300}
              className="w-[300px]"
              src={companyData?.logoUrl}
              alt="Luxe Home logo"
            />
        </Link>       
      </div>
  
  );
};

export default Header;

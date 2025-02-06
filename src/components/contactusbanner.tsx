import React from 'react';
import Image from 'next/image';
interface CompanyData {
    bannercontacts: string;
  }
const Contactusbanner = ({ companyData }: { companyData: CompanyData }) => {

    return (
        <div className="max-lg:pt-16">
            <div className='relative  w-full '>
                <div className='absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/4 text-white'>
                    <h1 className='text-8xl font-bold max-lg:text-6xl max-md:text-xl'>Contact us</h1>
                    <p className='max-md:text-xs'>HOME / CONTACT US</p>
                </div>
                 <Image
          className="w-full h-[500px] "
          src={companyData.bannercontacts}
          alt="banner"
          width={1920} // Adjust width and height as per your requirements
          height={1080}
          priority // Ensures the image is loaded as a priority
        />
            </div>
        </div>
    );
}

export default Contactusbanner;
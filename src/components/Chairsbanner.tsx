
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


interface ChairsbannerProps {
  category?: {
    slug:string;
    name: string;
    bannerUrl?: string;
  };
}

const Chairsbanner: React.FC <ChairsbannerProps>= ({ category }) => {




  return (
   
      <div className='relative w-full'>
        <Link 
          href={`/${category?.slug}`}

          className='max-2xl:pl-40 max-sm:pl-2 text-xl md:text-4xl lg:text-7xl  text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/4 absolute font-bold'>
          { category?.name }
        </Link>
        <div className='w-full h-full flex items-center justify-center'>        
              <Image
              className='object-cover w-full h-[400px]'
              src={category?.bannerUrl || 'default'}
              alt='category logo'
              height={400}
              width={1920}
              priority // This will preload the image
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={75} // Adjust quality for better performance
              placeholder="blur" // Optional: add a placeholder while the image loads
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" // Optional: base64-encoded low-res image for the placeholder
              />
         
        </div>
      </div>
   
  );
}

export default Chairsbanner;

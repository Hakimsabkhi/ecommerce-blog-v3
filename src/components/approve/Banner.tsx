import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BannerProps {
  category?: categoryData;
}

interface categoryData {
  name: string;
  slug: string;
  bannerUrl: string;
}

const Banner: React.FC<BannerProps> = ({ category }) => {
 
  return (
    <div className="max-lg:pt-16">
      <div className="relative w-full">
        {category ?(
    
            <div key={category.slug} className="relative w-full h-[400px] mb-4">
              <Link
                href={`/${category.slug}`}
                className="text-8xl max-md:text-3xl text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/4 absolute font-bold"
              >
                {category.name}
              </Link>
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  className="object-cover w-full h-[400px]"
                  src={category.bannerUrl} // Fallback to default image if bannerUrl is undefined
                  alt={`${category.name} logo`}
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
        
        ) : (
          <p className="text-center text-white text-2xl">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Banner;

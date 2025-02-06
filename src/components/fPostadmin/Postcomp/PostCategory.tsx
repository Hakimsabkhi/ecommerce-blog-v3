"use client";
import Blog from '@/components/PostComponents/Post';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaReadme } from 'react-icons/fa';
import Image from 'next/image'; // Import Image component from next/image

// Define the blog interface
interface Blog {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  postcategory: { slug: string };
  vadmin: string;
  createdAt: string;
}

const fetchBlogData = async (id: string): Promise<Blog[]> => {
  const res = await fetch(`/api/blog/PostBySlugCategoryCustomer/${id}`, {
    method: 'GET',
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    notFound();
  }

  const data: Blog[] = await res.json();
  console.log(data);
  return data;
};

// Function to shuffle an array randomly
const shuffleArray = (array: Blog[]): Blog[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

function PostCategory() {
  const params = useParams(); // Get the slug from params
  const [blogData, setBlogData] = useState<Blog[]>([]); // State to store blog data
  const [loading, setLoading] = useState(true); // Loading state

  // Get the id from the URL params
  const id = params.CategorySlug;
 
  // Use useEffect to fetch blog data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        
        
        const fetchedData = await fetchBlogData(id.toString());
        const randomBlogs = shuffleArray(fetchedData).slice(0, 4); // Shuffle and slice the first 5
        setBlogData(randomBlogs); // Update the state with the 5 random blogs
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, [id]); // Dependency array ensures it only re-fetches when the id changes

  // If data is still loading, show a loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col gap-4'>
    <p className='text-4xl font-bold'>Read More...</p>
    <div className='flex  flex-col gap-2 '>
      {blogData.map((item, index) => (
        <div
          key={index}
          className="flex cursor-pointer duration-500 lg:group-hover:scale-[0.95] lg:hover:!scale-100 flex-col items-center relative"
        >
          <div className="w-full ">
            <Image
              width={1000}
              height={1000}
              className="w-full h-40 rounded-t-xl"
              src={item.imageUrl}
              alt={item.title} // It's a good practice to provide alt text
            />
          </div>
          <div className="flex flex-col border-x-2 border-b-2 rounded-b-xl gap-1 items-center bg-white w-full h-52">
            <div className="w-[302px] max-sm:w-[90%] pt-1 pl-2 ">
              <p className="text-[#525566]">
                {new Date(item.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="flex flex-col gap-1 max-md:gap-1 ">
                <div className="flex flex-col gap-1">
                  <p className="text-[#525566] text-xl max-sm:text-xl font-bold line-clamp-2 overflow-hidden">
                    {item.title}
                  </p>
                  <p className="text-[#525566] line-clamp-2 overflow-hidden">
                    {item.description}{" "}
                  </p>
                </div>

             
              </div>
              
            </div>
            <Link
                  href={`/blog/${item.postcategory?.slug}/${item.slug}`}
                  aria-label="read more about blog"
                  className="bg-primary hover:bg-[#15335D] rounded-lg w-[90%] h-14 items-center flex relative justify-center overflow-hidden transition duration-300 ease-out group/box text-white"
                >
                  <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform ease text-xl">
                    continue reading
                  </p>
                  <p className="text-white absolute flex items-center justify-center w-full h-full duration-500 translate-x-[-35%] translate-y-[3%] opacity-0 lg:group-hover/box:opacity-100 ease">
                    <FaReadme className="w-8 h-8" aria-hidden="true" fill="currentColor" />
                  </p>
                </Link>
          </div>
        </div>
      ))} {/* Pass the blog data to the Blog component */}
    </div>
    </div>
  );
}

export default PostCategory;

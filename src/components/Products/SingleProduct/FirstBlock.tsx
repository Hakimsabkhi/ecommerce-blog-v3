"use client";
import React, { useState, MouseEvent, useEffect } from "react";
import Image from "next/image";
import { IoCheckboxOutline } from "react-icons/io5";
import Head from "next/head";
import ProductQ from "./ProductQ";
import { useDispatch} from "react-redux";
import { addItem } from "../../../store/cartSlice";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";

const noimage =
  "https://res.cloudinary.com/dx499gc6x/image/upload/v1723623372/na_mma1mw.webp";
  interface Product {
    _id: string;
    name: string;
    description: string;
    info: string;
    ref: string;
    tva?: number; 
    price: number;
    imageUrl?: string;
    images?: string[];
    brand?: Brand; 
    stock: number;
    dimensions?: string;
    discount?: number;
    warranty?: number;
    weight?: number;
    color?: string;
    material?: string;
    status?: string;
    boutique: { _id: string; nom: string; address:string;city:string;phoneNumber:string; vadmin:string; };
  }
interface Review {
  _id: string;
  name: string;
  email: string;
  text: string;
  reply: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface Brand {
  _id: string;
  place: string;
  name: string;
  imageUrl: string;
}
interface FirstBlockProps {
  product: Product | null;
}
const fetchReviews = async (productId: string) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const response = await fetch(
    `/api/review/getAllReviewByProduct?id=${productId}`
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // Ensure you return the fetched data
};
const FirstBlock: React.FC<FirstBlockProps> = ({ product }) => {
  const [mainImage, setMainImage] = useState<string>(
    product?.imageUrl || noimage
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    product?.imageUrl || noimage
  );
  const hasNoImages =
    Array.isArray(product?.images) && product.images.length === 0;
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    const loadReviews = async () => {
      if(product?._id){
        const data = await fetchReviews(product._id);
        setReviews(data);
       }
      } 
  
  
    loadReviews();
  }, [product?._id]);
  
  const countRatings = (reviews: Review[]): Record<number, number> => {
    const counts: Record<number, number> = {};
  
    reviews.forEach((review) => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
  
    return counts;
  };
  
  const ratingCounts = countRatings(reviews);
  const ratingCounts1 = ratingCounts[1] || 0;
  const ratingCounts2 = ratingCounts[2] || 0;
  const ratingCounts3 = ratingCounts[3] || 0;
  const ratingCounts4 = ratingCounts[4] || 0;
  const ratingCounts5 = ratingCounts[5] || 0;
  
  const numberOfReviews = reviews.length;
  const reatingstatictotal=((ratingCounts1*1)+(ratingCounts2*2)+(ratingCounts3*3)+(ratingCounts4*4)+(ratingCounts5*5))/numberOfReviews;
  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };
  const handleImageClick = (image: string) => {
    setMainImage(image); // Set the clicked image as the main image
    setSelectedImage(image); // Set the selected image
  };


  const dispatch = useDispatch();

  const addToCartHandler = (product: Product, quantity: number) => {
    // Ensure dispatch is available

    // Dispatch the action with item and quantity
    dispatch(addItem({ item: product, quantity }));

    
   
  };
  return (
    <>
      <Head>
        <link rel="preload" as="image" href={product?.imageUrl || noimage} />
      </Head>
      <main className="p-10 flex justify-center">
        {product ? (
          <div className="flex max-xl:flex-col gap-10 2xl:w-[80%] xl:w-[95%] max-xl:w-[95%]">
            <div className="mx-auto">
              <div
                className="relative max-lg:h-96 max-md:h-80 xl:w-[800px] xl:h-[430px] 
                            lg:w-[866px] lg:h-[513px] overflow-hidden cursor-zoom-in"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={mainImage}
                  alt={product.name || "Product image"}
                  loading="eager"
                  width={1000}
                  height={1000}
                  className="transition-transform duration-300 ease-in-out"
          
                />
                {isZoomed && (
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-no-repeat"
                    style={{
                      backgroundImage: `url(${mainImage})`,
                      backgroundSize: "200%",
                      backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                      transform: "scale(1.5)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>

              <div className="gap-8 flex justify-center p-4">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden cursor-pointer max-sm:w-[20%] w-[100px] h-[60px]   ${
                                    selectedImage === image
                                      ? "border-2 border-[#15335D]"
                                      : ""
                                  }`}
                    >
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        onClick={() => handleImageClick(image)}
                        layout="" // Ensures the image scales correctly
                        width={1000} // Example width, can be adjusted
                        height={1000} // Example height, can be adjusted
                        // Adjust height to 50% of parent container
                      />
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div
              className={`flex flex-col  max-lg:w-[100%] ${
                hasNoImages ? "w-[50%]" : ""
              } gap-2`}
            >
              <p className="text-4xl uppercase">{product.name}</p>

              <div className=" gap-4 flex">
                <p className="flex items-center font-bold">
                  SKU :&nbsp;
                  <span className="text-[#525566]">{product.ref}</span>
                </p>
                <p className="text-[#525566] font-bold flex items-center gap-2">
                  <IoCheckboxOutline size={25} /> {product.status}
                </p>
              </div>

              <div className="flex gap-3 items-center pb-5">
                <div className="flex gap-1 text-secondary">
                {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    if (starValue <= reatingstatictotal) {
                        return <FaStar key={index} />;  // Full star
                    } else if (starValue - 0.5 <= reatingstatictotal) {
                        return <FaStarHalfAlt key={index} />;  // Half star
                    } else {
                        return <FaRegStar key={index} />;  // Empty star
                    }
                })}
                </div>
                <p>({numberOfReviews} customer reviews)</p>
              </div>
              <p className="text-sm">{product.info}</p>
              <hr className="bg-gray-500 mt-5 mb-5"></hr>

              <ProductQ product={product} addToCartHandler={addToCartHandler} />
            
            </div>
          </div>
        ) : (
          <div className=""></div>
        )}
      </main>
    </>
  );
};

export default FirstBlock;
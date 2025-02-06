// components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { star } from "@/assets/image";


interface Brand {
  _id: string;
  name: string;
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  price: number;
  imageUrl?: string;
  brand?: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  category: Category;
  slug:string;
}
interface Category {
  name: string;
  slug:string;
}

interface ProductCardProps {
  item: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
 /*  const params = useParams() as { product?: string };
  const product = params.product;
 */

  const noimage =
    "https://res.cloudinary.com/dx499gc6x/image/upload/v1723623372/na_mma1mw.webp";

  return (
    <div className="bg-white rounded-lg duration-500 lg:group-hover:scale-[0.85] lg:hover:!scale-100 h-[481px] max-md:h-[320px] relative m-4">
      <Link href={`/admin/${item.category.slug}/${item.slug}`}>
        <Image
          className="absolute inset-0 mx-auto top-5"
          src={item.imageUrl || noimage}
          alt={item.name}
          height={300}
          width={300}
        />
      </Link>
      <div className="flex-col flex bottom-0 gap-2 absolute w-full px-2">
        <Link href={`/admin/${item.category.slug}/${item.slug}`}>
          <div className="h-24 max-md:h-20">
            <p className="text-gray-700 cursor-pointer text-3xl max-md:text-xl font-bold">
              {item.name}
            </p>
            <div className="flex-col gap-1">
              {item.discount && item.discount !== 0 ? (
                <div className="flex-col flex gap-1">
                  <p className="text-2xl font-bold rounded-lg text-primary">
                    {item.price - item.price * (item.discount / 100)} TND
                  </p>
                  <span className="text-primary line-through text-xl font-bold">
                  <p className="text-gray-300" >{item.price} TND</p>  
                  </span>
                </div>
              ) : (
                <p className="text-primary text-2xl max-md:text-lg font-bold">
                  {item.price} TND
                </p>
              )}
            </div>
          </div>
        </Link>
        <div className="flex gap-2 items-center">
          <Image className="size-5 max-md:size-4" src={star} alt="star" />
          <Image className="size-5 max-md:size-4" src={star} alt="star" />
          <Image className="size-5 max-md:size-4" src={star} alt="star" />
          <Image className="size-5 max-md:size-4" src={star} alt="star" />
          <Image className="size-5 max-md:size-4" src={star} alt="star" />
          <p className="flex gap-2 text-xl max-md:text-sm font-bold items-center">
            5
          </p>
        </div>
        <div className="flex mb-1 text-lg max-md:text-sm justify-between">

        {item.status != 'out-of-stock' ? (item.stock > 0 ? ( <button
           
            className="AddtoCart bg-primary hover:bg-[#15335D] text-white w-[50%] max-md:rounded-[3px] max-2xl:text-sm group/box"
          >
            <p className="absolute  flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-x-[10%] ease">
              Add to cart
            </p>
            <p className="text-white absolute flex items-center justify-center w-full h-full duration-300 -translate-x-[100%] lg:group-hover/box:translate-x-[-30%] ease">
              <FaCartShopping
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
              />
            </p>
          </button> ) : (
        <button className="AddtoCart bg-gray-400 hover:bg-gray-500 text-white w-[50%] max-md:rounded-[3px] max-2xl:text-sm group/box" disabled>
        <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-x-[10%] ease">
        Out of stock
        </p>
        
      </button>
     
      )):(<button className="AddtoCart bg-gray-400 hover:bg-gray-500 text-white w-[50%] max-md:rounded-[3px] max-2xl:text-sm group/box" disabled>
        <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300   ease">
        Out of stock
        </p>
       
      </button>)}

          <a href={`/admin/${item.category.slug}/${item.slug}`} className="w-[30%]">
            <button className="AddtoCart bg-white max-md:rounded-[3px] w-full group/box text-primary border border-primary">
              <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-y-[-100%] ease">
                View
              </p>
              <p className="text-primary absolute w-full h-full flex items-center justify-center duration-300 -translate-y-[-100%] lg:group-hover/box:translate-y-0 ease">
                <FaEye
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                />
              </p>
            </button>
          </a>
          <button
            
            className="relative bg-white hover:bg-primary max-md:rounded-[3px] AddtoCart w-[13%] group/box text-primary hover:text-white border border-[#8D4407]"
            aria-label="wishlist"
          >
            <p className="absolute flex items-center justify-center w-full h-full">
              <FaRegHeart
                className="w-5 h-5 max-2xl:w-3 max-2xl:h-3"
                aria-hidden="true"
                fill="currentColor"
              />
            </p>
            <p
              className={`absolute flex items-center justify-center w-full h-full  group-hover/box:opacity-100`}
            >
              <FaHeart
                className="w-5 h-5 max-2xl:w-3 max-2xl:h-3"
                aria-hidden="true"
                fill="currentColor"
              />
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

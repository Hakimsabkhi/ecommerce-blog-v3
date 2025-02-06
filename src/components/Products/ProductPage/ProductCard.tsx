"use client";
import dynamic from "next/dynamic";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaEye,
  FaRegHeart,
  FaHeart,
  FaCartShopping,
} from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/cartSlice";
import { addToWishlist } from "@/store/wishlistSlice";

interface Brand {
  _id: string;
  name: string;
}

interface Category {
  name: string;
  slug: string;
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva?: number;
  price: number;
  imageUrl?: string;
  brand?: Brand;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  category: Category;
  slug: string;
}

interface ProductCardProps {
  item: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const dispatch = useDispatch();
  const Reviews = dynamic(() => import("@/components/Reviews"), {
    loading: () => <p>Loading reviews...</p>,
  });
  const addToCartHandler = (product: ProductData, quantity: number) => {
    dispatch(addItem({ item: product, quantity }));
  };

  const handleWishlistClick = (product: ProductData) => {
    dispatch(addToWishlist(product));
  };

  return (
    <div className="flex gap-1 max-sm:mb-5  h-fit flex-col duration-500 lg:group-hover:scale-[0.85] lg:hover:!scale-100 max-md:h-fit relative">
      <Link href={`/${item.category?.slug}/${item.slug}`}>
        <Image
          className="w-full h-auto mx-auto top-5"
          src={item.imageUrl || ""}
          alt={item.name}
          height={300}
          width={300}
        />
      </Link>
      <div className="flex-col flex pl-2 pr-2 w-full">
        <Link href={`/${item.category?.slug}/${item.slug}`}>
          <div className="flex justify-between h-20 max-sm:h-16 max-md:h-20">
            <div className="flex-col flex gap-1">
              <p className="text-productNameCard cursor-pointer text-2xl max-md:text-lg font-bold first-letter:uppercase">
                {item.name}
              </p>
              {/* Render the Reviews component in summary mode.
                  It will display the star ratings using the same CSS as your original file. */}
              <Reviews productId={item._id} summary={true} />
            </div>
            <div className="flex-col gap-1 text-right truncate">
              {item.discount && item.discount !== 0 ? (
                <div className="flex-col flex gap-1">
                  <p className="text-2xl max-md:text-lg font-bold rounded-lg text-primary">
                    {item.price - item.price * (item.discount / 100)} TND
                  </p>
                  <span className="text-primary line-through text-xl max-md:text-sm font-bold">
                    <p className="text-gray-500">{item.price} TND</p>
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

        <div className="flex text-lg max-md:text-sm justify-between">
          {item.status !== "out-of-stock" ? (
            item.stock > 0 ? (
              <button
                onClick={() => addToCartHandler(item, 1)}
                className="AddtoCart bg-primary hover:bg-[#15335D] text-white w-[50%] max-lg:w-[60%] max-md:rounded-[3px] group/box"
              >
                <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-x-[10%] ease max-md:text-xs">
                  Add to cart
                </p>
                <p className="text-white absolute flex items-center justify-center w-full h-full duration-300 -translate-x-[100%] lg:group-hover/box:translate-x-[-30%] ease">
                  <FaCartShopping
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                  />
                </p>
              </button>
            ) : (
              <button
                className="AddtoCart bg-gray-400 hover:bg-gray-500 text-white w-[50%] max-lg:w-[60%] max-md:rounded-[3px] max-2xl:text-sm group/box"
                disabled
              >
                <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-x-[10%] ease max-md:text-xs">
                  Out of stock
                </p>
              </button>
            )
          ) : (
            <button
              className="AddtoCart bg-gray-400 hover:bg-gray-500 text-white max-lg:w-[60%] w-[50%] max-md:rounded-[3px] max-2xl:text-sm group/box"
              disabled
            >
              <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 ease max-md:text-xs">
                Out of stock
              </p>
            </button>
          )}

          <a href={`/${item.category?.slug}/${item.slug}`} className="w-[25%] max-lg:w-[30%]">
            <button className="AddtoCart bg-white max-md:rounded-[3px] w-full group/box text-primary border border-primary">
              <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform lg:group-hover/box:translate-y-[-100%] ease max-md:text-xs">
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
            onClick={() => handleWishlistClick(item)}
            className="relative bg-white hover:bg-primary max-md:rounded-[3px] AddtoCart w-[15%] group/box text-primary hover:text-white border border-primary max-lg:hidden"
            aria-label="wishlist"
          >
            <p className="absolute flex items-center justify-center w-full h-full">
              <FaRegHeart
                className="w-5 h-5 max-2xl:w-3 max-2xl:h-3"
                aria-hidden="true"
                fill="currentColor"
              />
            </p>
            <p className="absolute flex items-center justify-center w-full h-full group-hover/box:opacity-100">
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

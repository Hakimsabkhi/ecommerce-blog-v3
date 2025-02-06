"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  description: string;
  info: string;
  ref: string;
  tva?:number
  price: number;
  imageUrl?: string;
  images?: string[];
  stock: number;
  dimensions?: string;
  discount?: number;
  warranty?: number;
  weight?: number;
  color?: string;
  material?: string;
  status?: string;
  boutique: { _id: string; nom: string; address:string;city:string;phoneNumber:string;vadmin:string};
}

interface ProductQuantityProps {
  product: Product | null;

}

const ProductQuantity: React.FC<ProductQuantityProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  if (!product) {
    return null; // Ensure the component returns null if product is not available
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      1,
      Math.min(product.stock, parseInt(event.target.value, 10) || 1)
    );
    setQuantity(value);
  };

  return (
    <>
      {product?.discount && product?.discount !== 0 ? (
        <div className="items-center max-xl:justify-center flex gap-4">
          <p className="text-primary text-2xl font-bold max-xl:justify-center flex">
            {product.price - product.price * (product.discount / 100)} TND
          </p>
          <span className="   text-xl font-bold">
            <p className="text-gray-300 line-through"> {product.price} TND</p>
          </span>
        </div>
      ) : (
        <p className="text-primary text-2xl font-bold max-xl:justify-center flex">
          {product?.price} TND
        </p>
      )}

      <hr className=" mt-5 mb-5"></hr>
      <div className="xl:flex xl:items-center  gap-3 ">
        {product.status != "out-of-stock" ? (
          product.stock > 0 ? (
            <div className="flex max-md:flex-col xl:flex-col justify-between gap-5">
              <div className=" items-center md:max-xl:w-2/5 ">
                <div className="flex items-center max-md:justify-center space-x-2">
                  <p>Quantity:&nbsp;</p>
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 border text-xl text-gray-700"
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <input
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stock}
                    className="p-2 border text-xl text-center w-[20%] "
                  />
                  <button
                    onClick={increaseQuantity}
                    className="p-2 border text-xl text-gray-700"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                {/* Assuming you want to show the quantity here */}
              </div>
              <div className="flex gap-4 md:max-xl:w-2/5">
                <button
               
                  className="text-white bg-primary hover:bg-[#15335D] h-10 w-[60%]  font-bold rounded-md"
                >
                  <p>Add to cart </p>
                </button>
                <Link
                  href={""}
                  className="text-white bg-black h-10 w-[60%]  font-bold text-center rounded-md"
                >
                  <button
                    
                    className="text-white bg-black h-10 w-[60%] font-bold rounded-md"
                  >
                    <p>Buy now</p>
                  </button>
                </Link>
              </div>
               <div className="flex flex-col space-y-2">
                              <p className="font-bold">Disponibilité :</p>
                              <div className="flex items-center space-x-4">
                                <span className="font-semibold uppercase"> {product.boutique?.vadmin==="approve"   && (product.boutique?.nom || 'Disponible Dans notre magasin')||'Disponible Dans notre magasin'}</span>
                                {product.boutique  && product.boutique.vadmin==="approve" && <div>
                               <div className="flex items-center  space-x-1 ">
                                  <span className="inline-block bg-black p-1 font-semibold mr-2 rounded-md ">
                                    <BsFillTelephoneFill className="text-white" size={15} />
                                  </span>
                                  <span>{product.boutique?.phoneNumber}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="inline-block text-black font-semibold mr-2">
                                    <FaMapMarkerAlt size={23} />
                                  </span>
                                  <span>{product.boutique?.city}, {product.boutique?.address}</span>
                                </div>
                                </div>}
                              </div>
                            </div>
            </div>
          ) : (
            <button
              className="text-white bg-gray-500 h-10 w-[60%] font-bold rounded-md"
              disabled
            >
              <p>Out of stock</p>
            </button>
          )
        ) : (
          <button
            className="text-white bg-gray-500 h-10 w-[60%] font-bold rounded-md"
            disabled
          >
            <p>Out of stock</p>
          </button>
        )}
      </div>
    </>
  );
};

export default ProductQuantity;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { SlBag } from "react-icons/sl";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Total from "./Total";
import CartModal from "../CartModal";
import CartModalOnscroll from "../CartModalOnscroll";
import { usePathname } from "next/navigation";

const CartLogic = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOnscrollCart, setIsOnscrollCart] = useState(false);
  const items = useSelector((state: RootState) => state.cart.items);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const cartModalWrapperRef = useRef<HTMLDivElement>(null);
  const onscrollCartModalWrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleCartModal = () => {
    setIsOnscrollCart(false);
    setIsCartOpen((prev) => !prev);
  };

  const toggleCartOnscrollModal = () => {
    setIsOnscrollCart(true);
    setIsCartOpen((prev) => !prev);
  };

  const closeCartModal = () => {
    setIsCartOpen(false);
  };

  // Handle clicks outside of the cart modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCartOpen &&
        !isOnscrollCart &&
        cartModalWrapperRef.current &&
        !cartModalWrapperRef.current.contains(event.target as Node)
      ) {
        closeCartModal();
      }
      if (
        isCartOpen &&
        isOnscrollCart &&
        onscrollCartModalWrapperRef.current &&
        !onscrollCartModalWrapperRef.current.contains(event.target as Node)
      ) {
        closeCartModal();
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, isOnscrollCart]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (isCartOpen) {
        closeCartModal();
      }
      setIsScrolling(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCartOpen]);

  // Calculate total quantity of items in the cart
  useEffect(() => {
    if (items) {
      const quantity = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      setTotalQuantity(quantity);
    }
  }, [items]);

  // Close cart on route change
  useEffect(() => {
    closeCartModal();
  }, [pathname]);

  return (
    <>
      
        <div className="flex items-center justify-center w-[200px] max-lg:w-fit text-white cursor-pointer select-none">
          <div
            className="flex items-center justify-center gap-2 w-fit max-lg:w-fit text-white cursor-pointer"
            onClick={toggleCartModal}
            ref={cartModalWrapperRef}
          >
            <div className="relative my-auto mx-2">
              <div>
              <SlBag size={40} />
              <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
                {totalQuantity}
              </span>
              
              </div>
              <div
  className="absolute max-md:fixed shadow-xl z-30 flex gap-2 flex-col top-12 left-1/2 -translate-x-1/3 max-md:-translate-x-1/2 max-md:top-16 max-md:w-full"
  onClick={(e) => e.stopPropagation()} 
>
                {isCartOpen && !isOnscrollCart && items.length > 0 && (
                  <CartModal items={items} onClose={closeCartModal} />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-text text-sm max-md:hidden">Mon Panier</p>
              <Total items={items} />
            </div>
          </div>      
        </div>

      {/* Show the floating cart button when scrolling */}
      {isScrolling && (
        <div
          className="fixed top-5 right-5 rounded-full z-50 bg-[#15335D] w-fit p-4 flex items-center gap-4 border-10 border-black select-none"
          ref={onscrollCartModalWrapperRef} 
          onClick={toggleCartOnscrollModal}
        >
          <div className="relative">
            <SlBag size={25} className="text-white" />
            <span className="w-4 flex justify-center h-4 items-center text-xs rounded-full absolute -top-1 -right-1 text-white bg-secondary">
              <p>{totalQuantity}</p>
            </span>

            {/* Scrolling Cart Modal */}
            <div
              className="absolute max-md:fixed shadow-xl z-30 flex gap-2 top-12 right-0 flex-col max-md:top-[80px] max-md:right-[50%] max-md:transform max-md:translate-x-1/2 transition-all duration-900 ease-in-out "
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
            >
              {isCartOpen && isOnscrollCart && items.length > 0 && (
                <CartModalOnscroll items={items} onClose={closeCartModal} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartLogic;

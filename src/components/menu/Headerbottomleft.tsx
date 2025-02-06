"use client"
import React, { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import Link from 'next/link'
import { FaBars } from 'react-icons/fa6'

interface Category {
    _id: string;
    name: string;
    logoUrl?: string;
    slug: string;
  }
  
  interface Subcategory {
    _id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  }
  interface Headerbottomleftprop{
    categorys:Category[]
  }
  const Headerbottomleft: React.FC<Headerbottomleftprop> =  ({categorys}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<{ [key: string]: Subcategory[] }>({});
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuWrapperRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLDivElement>(null);
  
    // Fetch all categories on mount
    useEffect(() => {
     
          setCategories(categorys);
    
    }, [categorys]);
  
    // Fetch subcategories for a given category ID if not already loaded
    const fetchSubcategories = async (categoryId: string) => {
      try {
        const res = await fetch(`/api/SubCategory/getsubcategoraybycategoray/${categoryId}`);
        if (!res.ok) throw new Error("Failed to fetch subcategories");
        const data = await res.json();
        setSubcategories((prev) => ({
          ...prev,
          [categoryId]: data,
        }));
      } catch (error) {
        console.error(error);
      }
    };
  
    // When hovering over a category, set it as active and fetch its subcategories if needed
    const handleMouseEnter = (categoryId: string) => {
      setActiveCategory(categoryId);
      if (!subcategories[categoryId]) {
        fetchSubcategories(categoryId);
      }
    };
  
    // Toggle the category dropdown menu open/closed
    const toggleMenu = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen((prev) => !prev);
    };
  
    const closeMenu = () => {
      setIsMenuOpen(false);
      setActiveCategory(null);
    };
  
    // Close menu if a click is detected outside the menu or toggle button
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isMenuOpen &&
          !menuWrapperRef.current?.contains(event.target as Node) &&
          !toggleButtonRef.current?.contains(event.target as Node)
        ) {
          closeMenu();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);
  
    // Close menu on scroll
    useEffect(() => {
      const handleScroll = () => {
        if (isMenuOpen) closeMenu();
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [isMenuOpen]);
  return (
    <div
    className="relative w-[300px] h-[70%] bg-white text-primary font-bold flex justify-center items-center cursor-pointer"
    onClick={toggleMenu}
    ref={toggleButtonRef}
  >
    <div className="flex gap-6 items-center select-none">
      <FaBars />
      <p>ALL OUR CATEGORIES</p>
    </div>

    {/* Dropdown Menu */}
    {isMenuOpen && (
      <div
        className="absolute z-30 top-12 left-1/2 -translate-x-1/2 bg-white shadow-lg mt-4 select-none"
        ref={menuWrapperRef}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex flex-col w-[300px] bg-white z-30">
          {categories.map((category) => (
            <div
              key={category._id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(category._id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                href={`/${category.slug}`}
                onClick={closeMenu}
                className="flex items-center gap-3 duration-300 hover:bg-primary hover:text-white p-4"
              >
                {category.logoUrl && (
                  <Image
                    src={category.logoUrl}
                    alt={category.name}
                    width={20}
                    height={20}
                  />
                )}
                <span className="font-bold text-base">{category.name}</span>
              </Link>
              {activeCategory === category._id && subcategories[category._id] && (
                <div className="absolute top-0 left-full pl-4 w-[300px] ">
                  {subcategories[category._id].map((subCategory) => (
                    <Link
                      key={subCategory._id}
                      href={`/${subCategory.slug}`}
                      onClick={closeMenu}
                      className="flex bg-white items-center gap-3 duration-300 hover:bg-primary hover:text-white p-4"
                    >
                      {subCategory.logoUrl && (
                        <Image
                          src={subCategory.logoUrl}
                          alt={subCategory.name}
                          width={20}
                          height={20}
                          className="rounded-full object-cover"
                        />
                      )}
                      <span className="font-bold text-base">
                        {subCategory.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  )
}

export default Headerbottomleft
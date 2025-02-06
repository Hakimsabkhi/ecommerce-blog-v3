"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

interface OpeningHours {
  [day: string]: { open: string; close: string }[];
}

export interface StoreData {
  _id: string;
  nom: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  localisation: string;
  openingHours: OpeningHours;
}

interface BoutiqueProps {
  boutiques: StoreData[];
}

// Update BoutiqueCard to accept the dynamic itemsPerSlide prop so that we can set its width.
interface BoutiqueCardProps {
  boutique: StoreData;
  itemsPerSlide: number;
}

const BoutiqueCard: React.FC<BoutiqueCardProps> = ({
  boutique,
  itemsPerSlide,
}) => {
  return (
    // Instead of a fixed width class (e.g. w-1/3), we set the width based on itemsPerSlide.
    <div
      className="flex h-full gap-6 max-sm:flex-col"
      style={{ flex: `0 0 ${100 / itemsPerSlide}%` }}
    >
      {/* Image Section */}
      <div className="w-1/2 max-sm:w-full max-sm:h-[100px] max-sm:justify-center flex justify-end">
        {boutique.image && (
          <Image
            src={boutique.image}
            alt={boutique.nom}
            width={1920}
            height={1080}
            className="w-[300px] h-[400px] max-sm:h-[100px] object-cover"
          />
        )}
      </div>

      {/* Info Section */}
      <div className="w-1/2 max-sm:w-full my-auto">
        <div className=" flex flex-col gap-4 max-sm:items-center ">
          <h2 className=" text-2xl font-bold uppercase">{boutique.nom}</h2>
          <div className=" text-black flex  gap-2 flex-col max-sm:flex-row ">
            <div className="flex  gap-2 items-center">
              <span>
                <FaPhoneAlt size={20} />
              </span>
              <span className=" font-semibold ">:{boutique.phoneNumber}</span>
            </div>

            <div className="flex  gap-2 items-center">
              <span className="inline-block text-black font-semibold">
                <FaMapMarkerAlt size={20} />
              </span>
              <span className="font-semibold">
                {boutique.address} {boutique.city}
              </span>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex flex-col justify-center w-fit gap-2">
            <h3 className=" text-black font-semibold text-xl">
              TEMPS OUVERT :
            </h3>
            <ul className=" text-sm space-y-1">
              {boutique.openingHours &&
                Object.entries(boutique.openingHours).map(([day, hours]) => (
                  <li key={day} className="flex gap-2 text-left">
                    <span className="font-medium">{day.slice(0, 2)}:</span>
                    {Array.isArray(hours) && hours.length > 0
                      ? hours
                          .map((hour) => {
                            const openTime = hour.open || "";
                            const closeTime = hour.close || "";
                            if (!openTime && !closeTime) return "";
                            return `${openTime} - ${closeTime}`;
                          })
                          .filter(Boolean)
                          .join(" / ") || "Closed"
                      : "Closed"}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const BoutiqueCarousel: React.FC<BoutiqueProps> = ({ boutiques }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // itemsPerSlide will be dynamic based on viewport width.
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Update itemsPerSlide based on current window width.
  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      if (width < 1210) {
        // For screens smaller than "md" (max-md)
        setItemsPerSlide(1);
      } else if (width < 1620) {
        // For screens smaller than "xl" (changed from lg to xl)
        setItemsPerSlide(2);
      } else {
        // For screens larger than or equal to "lg"
        setItemsPerSlide(3);
      }
    };

    // Run on mount
    updateItemsPerSlide();

    // Listen for resize events
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  // Compute slides in groups of itemsPerSlide.
  const slides = useMemo(() => {
    const chunked: StoreData[][] = [];
    for (let i = 0; i < boutiques.length; i += itemsPerSlide) {
      chunked.push(boutiques.slice(i, i + itemsPerSlide));
    }
    return chunked;
  }, [boutiques, itemsPerSlide]);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  return (
    <div className="py-8 w-full">
      <div className="relative overflow-hidden">
        {/* Slides Wrapper */}
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideItems, slideIndex) => (
            <div
              key={`slide-${slideIndex}`}
              className="flex-shrink-0 w-full flex gap-4 px-16"
            >
              {slideItems.map((item) => (
                <BoutiqueCard
                  key={item._id}
                  boutique={item}
                  itemsPerSlide={itemsPerSlide}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -left-1 transform -translate-y-1/2 p-1 z-10"
          aria-label="Go to previous slide" // Adds an accessible name
        >
          <FaRegArrowAltCircleLeft size={50} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 -right-1 transform -translate-y-1/2 p-1 z-10"
          aria-label="Go to next slide" // Adds an accessible name
        >
          <FaRegArrowAltCircleRight size={50} />
        </button>
      </div>

      {/* Slider Indicators */}
      <div className="flex justify-center gap-2 mt-4 pt-4">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={`indicator-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === currentSlide ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BoutiqueCarousel;

import React from 'react';
import Image from 'next/image';

import {itemsarticle} from "@/assets/data"


import { FaArrowRight } from "react-icons/fa6";
import { FaReadme } from "react-icons/fa6";
import Link from 'next/link';
const Latestarticle = () => {
    return (
        <div className='py-8 h-fit w-[96%] mx-auto flex flex-col justify-center items-center gap-10 '>
            <div className='  max-md:text-center flex justify-between items-center max-md:4/5 w-full  max-md:gap-4  '>
                <h3 className=' font-bold max-md:text-2xl text-4xl text-gray-800'>
                    Latest articles
                </h3>
                <Link href="/blog">
                    <div className='relative flex items-center border-2 justify-center p-4 px-12 py-4 overflow-hidden  transition duration-300 ease-out  rounded-full group'>
                        <span className="absolute flex items-center  justify-center w-full h-full text-white duration-300 -translate-x-full bg-black lg:group-hover:translate-x-0 ease">
                            <FaArrowRight  className='w-5 h-5 ' />
                        </span>
                        <span className="absolute flex items-center text-xl font-bold justify-center w-full h-full bg-white text-black transition-all duration-300 transform lg:group-hover:translate-x-full ease ">
                            Visit the Blog
                        </span>
                        <span className="relative invisible">Visit the Blog</span>                          
                    </div>
                </Link>
            </div>
            <div className='grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 w-full group gap-10     '>
                {itemsarticle.map((item, index) => (
                <div key={index} className='flex cursor-pointer duration-500  lg:group-hover:scale-[0.95] lg:hover:!scale-100 flex-col items-center relative'>
                    <div key={index} className=" w-full   ">                        
                        <Image className=' w-full' src={item.src} alt="steak" />
                    </div>
                    <div className='flex flex-col  gap-2 items-center  border-x-2 border-b-2     bg-white w-full h-[235px]'>
                        <div className="w-[302px]  max-sm:w-[90%] pt-2">
                            <p className="text-[#525566]    ">{item.date}</p>
                            <div className="flex flex-col  gap-5 max-md:gap-2 ">
                                <div className="flex flex-col  gap-2">
                                    <p className="text-gray-800 text-2xl max-sm:text-xl font-bold">{item.title}</p>
                                    <p className="text-[#525566]">{item.text} </p>
                                </div>
                                <button className="bg-primary hover:bg-[#15335D] rounded-lg w-full h-14 items-center flex relative justify-center overflow-hidden transition duration-300 ease-out group/box text-white  ">
                                    <p className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform  ease text-xl  ">continue reading</p>
                                    <p className="  text-white absolute flex items-center justify-center w-full h-full duration-500 translate-x-[-35%] translate-y-[3%] opacity-0 lg:group-hover/box:opacity-100 ease  ">                                        
                                        <FaReadme    className="w-8  h-8" aria-hidden="true" fill="currentColor"/>                                                                                                                    
                                    </p>
                                </button> 
                            </div>
                        </div>
                    </div>
                </div>))}
            </div>
        </div>
    );
}

export default Latestarticle;

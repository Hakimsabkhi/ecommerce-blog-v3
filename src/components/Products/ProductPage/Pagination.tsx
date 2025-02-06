import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
interface PaginationProps  {
    currentPage: number;
    totalPages: number;
    onPagechange: (pageNumber: number) => void;


}
const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPagechange,

}) => {
    return (
        <div className="flex justify-center items-center gap-x-4 ">
          <div
            className="flex items-center gap-1 cursor-pointer  "
            onClick={() => onPagechange(currentPage - 1)}
            >
            <FaArrowLeft className="cursor-pointer" />
            <p className="text-sm font-semibold">PREVIOUS</p>
          </div>
          {Array.from({ length: totalPages }, (_, i) => (
            <p
              key={i + 1}
              onClick={() => onPagechange(i + 1)}
              className={`cursor-pointer text-xl rounded-full py-3 px-5 ${currentPage === i + 1 ? "bg-black text-white" : ""
                }`}
            >
              {i + 1}
            </p>
          ))}
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => onPagechange(currentPage + 1)}
            >
            <p className="text-sm font-semibold">NEXT</p>
            <FaArrowRight className="cursor-pointer" />
          </div>
        </div>
    );
}

export default Pagination;

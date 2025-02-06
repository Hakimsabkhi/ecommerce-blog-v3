import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center  h-[400px]">
      
      <AiOutlineLoading3Quarters className="w-16 h-16 text-blue-600 animate-spin" />  
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
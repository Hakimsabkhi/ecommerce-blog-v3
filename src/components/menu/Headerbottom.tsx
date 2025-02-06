import React from "react";
import Headerbottonright from "./Headerbottonright";
import Headerbottomleft from "./Headerbottomleft";
import { getcategoryData } from "@/lib/StaticDataHomePage";


const Headerbottom: React.FC = async () => {
  
const categorydata= await getcategoryData()

    const categorys = JSON.parse(categorydata)
  return (
    <header>
      <div className="w-full h-[80px] bg-primary flex justify-center items-center border-y border-gray-600">
        <div className="w-[90%] h-full flex justify-between max-md:justify-center items-center">
          {/* Toggle Button */}
            <Headerbottomleft categorys={categorys}/>
            <Headerbottonright/>
        </div>
      </div>
    </header>
  );
};

export default Headerbottom;

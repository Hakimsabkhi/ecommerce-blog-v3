import { getstores } from '@/lib/StaticDataHomePage';

import React from 'react'
import Boutiquecroserl from './showroom/Boutiquecroserl';



const Boutiquehomepage = async () => {
    const store = await getstores();
      const boutiques=JSON.parse(store)

  return (


    <div className=" w-[95%] mx-auto py-8">
       {boutiques  && (
        <div className="flex w-full flex-col gap-2 items-center">
          <h3 className="font-bold text-4xl text-HomePageTitles">
          Nos Boutiques
          </h3>
        </div>
      )}
    <Boutiquecroserl boutiques={boutiques} />
  </div>
      
  )
}

export default Boutiquehomepage
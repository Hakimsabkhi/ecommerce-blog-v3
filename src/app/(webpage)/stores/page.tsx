import {  getstores, getWebsiteinfo } from '@/lib/StaticDataHomePage';
import React from 'react'
import Showroombanner from './../../../components/showroom/showroombanner';
  


import Boutique from '@/components/showroom/Boutique';
const page = async () => {
    const store = await getstores();
      const boutiques=JSON.parse(store)
const company = await getWebsiteinfo();
  const companyData = JSON.parse(company);
  return (


 <div>
  <Showroombanner companyData={companyData}/>
  <Boutique boutiques={boutiques}/>
 </div>
      
  )
}

export default page
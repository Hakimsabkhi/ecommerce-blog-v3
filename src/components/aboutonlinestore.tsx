import React from 'react';
import Image from 'next/image';
import { decor3, decor4 } from "@/assets/image";
const Aboutonlinestore = () => {
    return (
        <div className='flex desktop  max-xl:w-[95%] justify-center items-center  py-8 '>
            <div className='w-full flex gap-20 justify-between items-center max-xl:flex-col-reverse max-lg:gap-10'>
                <div className='flex gap-10 max-lg:flex-col '>
                    <Image src={decor3} alt="decor" />
                    <Image src={decor4} alt="decor" />
                </div>
                <div className='w-2/5 max-xl:w-full'>
                    <h1 className='text-3xl font-bold ' >About our online store</h1>
                    <p className='text-[#525566]'>Risus suspendisse a orci pentibus a felis suscipit consectetur vestibulum sodales dui cum ultricies One morning, when gregor Sasa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a littlehe could see his brown belly, skightly domed and divided by arches into stiff. Dictumst per ante ctas suscipit nascetur ullamcorper in nullam fermentum condimentum torquent iaculis reden posuere potenti viverra condimentum dictumst id tellus suspendisse convallis condimentum.</p>
                </div>
            </div>
        </div>
    );
}

export default Aboutonlinestore;

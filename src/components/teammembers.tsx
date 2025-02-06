import React from 'react';
import Image from 'next/image';
import {  livingroom3,  } from "@/assets/image";
import {members} from "@/assets/data";
const Teammembers = () => {
    return (
        <div className='flex flex-col desktop  max-md:w-[95%] justify-center items-center py-8 gap-20 max-md:flex-col'>
            <div className='justify-center flex w-full flex-col items-center max-md:text-center'>
                <h1 className='text-2xl font-bold'>Teammembers</h1>
                <p className='text-[#525566]'>Explore product collections from our vendors</p>
            </div>
            <div className='flex w-full justify-between max-md:flex-col max-md:gap-10'>
                {members.map((member,index) => (
                    <div key={index} className='flex-col flex justify-center items-center gap-2'>
                        <Image src={member.src} alt='person' />
                        <p className='text-xl font-semibold'>{member.name}</p>
                        <p className='text-[#525566]'>{member.title}</p>
                        <div className='flex gap-4'>
                            <Image className='w-8 h-8 cursor-pointer' src={member.facebook} alt="socials" />
                            <Image className='w-8 h-8 cursor-pointer' src={member.X} alt="socials" />
                            <Image className='w-8 h-8 cursor-pointer' src={member.linkedin} alt="socials" />
                            {member.instagram &&(
                                <Image className='w-8 h-8 cursor-pointer' src={member.instagram} alt="socials" />
                            )}
                        </div>
                    </div> 
                ))}                               
            </div>
            <Image className='' src={livingroom3} alt="livingroom" />
        </div>
    );
}

export default Teammembers;

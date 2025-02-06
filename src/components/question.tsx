import React from 'react';

const Question = () => {
    return (

        <div className='desktop  max-md:w-[95%] py-4  flex flex-col justify-center items-center '>
            <p className=' w-full border-b border-black h-10 text-3xl max-md:text-xl'>Frequently asked questions</p>
            <div className='w-full'>
                <p className='border-b max-md:text-sm border-black h-10 flex items-center'>What is the difference between an e-Gift Card and physical Card ?</p>
                <p className='border-b max-md:text-sm border-black h-10 flex items-center'>When will i receive my e-Gift card ?</p>
                <p className='border-b max-md:text-sm border-black h-10 flex items-center'>Do I have to use my gift Card all at once ?</p>
                <p className='border-b max-md:text-sm border-black h-10 flex items-center'>Can I also find there gift cards at retailers ?</p>
                <p className='border-b max-md:text-sm border-black h-10 flex items-center'>How many gift cards can I purshase at one ?</p>
            </div>
            <div className='w-full flex justify-center max-md:flex-wrap max-md:text-sm items-center gap-1 '>
                <p className='text-gray-400'>If you want more information about Gift Cards</p>
                <a href="contactus">Contact us</a>
            </div>
        </div>
    );
}

export default Question;

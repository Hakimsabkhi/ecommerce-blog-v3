import Image from 'next/image'
import React from 'react'

interface Postsecondsubsection {
    secondtitle: string;
    description:string;
    imageUrl?: string;
    imageFile?: File; // Temporary property to store the selected file before upload
}

interface Postfirstsubsection {
    fisttitle: string;
    description:string;
    Postsecondsubsections: Postsecondsubsection[];
    imageUrl?: string; 
  imageFile?: File; // Temporary property to store the selected file before upload
}
interface PostafficheProps{
    title:string;
    previewUrl:string| null;
    description:string;
    postfirstsubsections:Postfirstsubsection[];
}
const Postaffiche : React.FC<PostafficheProps> = ({ title, previewUrl, description, postfirstsubsections })  => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 w-1/2 ">
    <div className='flex flex-col items-center gap-2'>
    <h1 className='text-2xl justify-end uppercase font-bold'>{title}</h1>
    {previewUrl && (
        <Image src={previewUrl} alt="Image preview" width={500} height={500} className=" rounded-md w-[100%] h-40" />
      )}
      </div>
      <p className='pt-6 '>{description}</p>
          {/* Subtitles */}
    {postfirstsubsections.map((subtitleItem, subtitleIndex) => (
      <div key={subtitleIndex} className=" p-4 space-y-2 bg-gray-50">
        <div className="flex space-x-2 items-center justify-between">
          <div className=' flex flex-col gap-4 w-[100%]' >
         
            <h1 className='text-2xl font-bold '>{subtitleItem.fisttitle}</h1>
            
          
        {/* Subtitle Image */}
        {subtitleItem.imageUrl && (
          <Image src={subtitleItem.imageUrl} alt="Subtitle Image" width={500} height={500} className="rounded-md w-[100%] h-40" />
        )}
        
               
            <p>{subtitleItem.description}</p>
             
          </div>
         
        </div>


        {/* Subtitlesubtitles */}
        {subtitleItem.Postsecondsubsections.map((subsubtitle, subsubtitleIndex) => (
          <div key={subsubtitleIndex} className=" p-4  space-y-2 bg-gray-50">
           <div className='flex space-x-2 items-center justify-between' >
            <div className=' flex flex-col gap-4 w-[100%]'>
          
            <h1 className='text-2xl font-bold'>{subsubtitle.secondtitle}</h1>
            
                {/* Subtitlesubtitle Image */}
                {subsubtitle.imageUrl && (
              <Image
                src={subsubtitle.imageUrl}
                alt="Subtitlesubtitle Image"
                width={500}
                height={500}
                className="rounded-md w-[100%] h-40"
              />
            )}
          
            
          
            <p>{subsubtitle.description}</p>
             
            </div>
            
            </div>
        
          </div>
        ))}

       
      </div>
    ))}
  </div>
  )
}

export default Postaffiche
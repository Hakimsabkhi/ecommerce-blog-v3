
import React from 'react';


import Blogcomp from './Postcomp/Postcomp';


interface Postsecondsubsection {
  secondtitle: string;
  description: string;
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface Postfirstsubsection {
  fisttitle: string;
  description: string;
  Postsecondsubsections: Postsecondsubsection[];
  imageUrl?: string;
  imageFile?: File; // Temporary property to store the selected file before upload
}

interface blog {
  _id:string;
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  postcategory: postcategory;
  imageUrl?: string;
  user:User;
  numbercomment:number;
  createdAt:string;
}
interface User{
 _id:string;
 username:string
}
interface postcategory {
  _id: string;
  name: string;
}

interface  User{
  _id:string;
  username:string;
  email:string;
}

  interface blogprops{
    blog:blog
  }
  
const BlogPost: React.FC<blogprops> = ({ blog }) => {
    return (
        /* whole page */
        <div className="desktop flex py-8 max-lg:py-20 gap-10 ">
            <div className='w-[900px] max-lg:w-full flex flex-col gap-16'>
              <Blogcomp blog={blog}/>
            </div>
            
        </div>
    );
};

export default BlogPost;

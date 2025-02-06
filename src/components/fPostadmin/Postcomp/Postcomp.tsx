import Image from "next/image";
import React from "react";

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
  title: string;
  description: string;

  Postfirstsubsections: Postfirstsubsection[];
  postcategory: postcategory;
  imageUrl?: string;
  user: User;
  createdAt: string;
}
interface User {
  _id: string;
  username: string;
}
interface postcategory {
  _id: string;
  name: string;
}


interface Blogcompprops {
  blog: blog;
}

const Blogcomp: React.FC<Blogcompprops> = ({ blog }) => {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Title */}
      <div className="flex flex-col gap-6">
        <p className="text-4xl font-bold">{blog.title}</p>
        <div className="flex flex-col gap-2">
          <p className="text-gray-400 text-sm">
            Posted on{" "}
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            by {blog.user?.username}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs px-4 py-2 rounded-md bg-gray-600 text-white">
              {blog.postcategory?.name}
            </p>
          </div>
        </div>
      </div>
      {/* Post */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          {blog.imageUrl && (
            <Image
              src={blog.imageUrl}
              width={1000}
              height={1000}
              alt="blogpost"
              className=" h-[320px]"
            />
          )}
          <div className="flex flex-col gap-4">{blog.description}</div>
        </div>
        {blog.Postfirstsubsections?.length > 0 ? (
          blog.Postfirstsubsections.map((blogers, index) => (
            <div key={index} className="flex flex-col gap-6">
              <p className="text-4xl font-bold">{blogers.fisttitle}</p>
              <div className="flex flex-col gap-4">
                {blogers.description && <p>{blogers.description}</p>}
                {blogers.imageUrl && (
                  <Image
                    src={blogers.imageUrl} // Fallback if imageUrl is empty
                    width={1000}
                    height={1000}
                    alt={`${blogers.fisttitle} image`} // Alt text includes title
                    className=" h-[320px]"
                  />
                )}
              </div>

              {/* Map over subbloggers instead of bloggers */}
              {blogers.Postsecondsubsections?.length > 0 &&
                blogers.Postsecondsubsections.map((subblog, subIndex) => (
                  <div key={subIndex} className="flex flex-col gap-6">
                    <p className="text-xl font-bold">{subblog.secondtitle}</p>
                    <div className="flex flex-col gap-4">
                      {subblog.description && <p>{subblog.description}</p>}
                      {subblog.imageUrl && (
                        <Image
                          src={subblog.imageUrl}
                          width={2000}
                          height={2000}
                          alt={`${subblog.secondtitle} image`} // Alt text includes title
                          className="h-[320px] "
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))
        ) : (
          <p className="hidden">No blogs available</p> // Fallback message if blog.bloggers is empty or undefined
        )}
      </div>
    </div>
  );
};

export default Blogcomp;

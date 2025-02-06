"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaRegCircleXmark } from "react-icons/fa6";
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

interface PostMainSection {
  title: string;
  description: string;
  Postfirstsubsections: Postfirstsubsection[];
  postcategory: postcategory;
  imageUrl?: string;
}
interface postcategory {
  _id: string;
  name: string;
}
const toRoman = (num: number): string => {
  const romanNumerals: { [key: number]: string } = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    20: "XX",
    30: "XXX",
    40: "XL",
    50: "L",
    60: "LX",
    70: "LXX",
    80: "LXXX",
    90: "XC",
    100: "C",
  };

  let roman = "";
  const digits = [100, 90, 50, 40, 10, 9, 5, 4, 1];

  for (let i = 0; i < digits.length; i++) {
    while (num >= digits[i]) {
      roman += romanNumerals[digits[i]];
      num -= digits[i];
    }
  }

  return roman;
};
const removedImageUrls: string[] = [];
///type Params = Promise<{ id: string }>;
export default function UpdatePost({ params }: { params:Promise< { id: string }> }) {
  const router = useRouter();

  const [postData, setpostData] = useState<PostMainSection | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [listPostCategorie, setListPostCategorie] = useState<
    { _id: string; name: string }[]
  >([]);
  

  const { id } = React.use(params);
 // Handle image removal for subtitle images
 const handleImageRemoval = (subtitleIndex: number, subsubtitleIndex?: number) => {
  if (postData) {
    const updatedSubtitles = [...postData.Postfirstsubsections];
 
    let imageUrlToRemove: string | undefined;
    if (subsubtitleIndex !== undefined) {
      imageUrlToRemove = updatedSubtitles[subtitleIndex].Postsecondsubsections[subsubtitleIndex].imageUrl;
      if (imageUrlToRemove) {
        removedImageUrls.push(imageUrlToRemove); // Add the URL to the array
      }
      updatedSubtitles[subtitleIndex].Postsecondsubsections[subsubtitleIndex].imageUrl = "";
      updatedSubtitles[subtitleIndex].Postsecondsubsections[subsubtitleIndex].imageFile = undefined;
    } else {
      imageUrlToRemove = updatedSubtitles[subtitleIndex].imageUrl;
      // Save the image URL to the array before removing
      if (imageUrlToRemove) {
        removedImageUrls.push(imageUrlToRemove); // Add the URL to the array
      }
     
      updatedSubtitles[subtitleIndex].imageUrl = "";
      updatedSubtitles[subtitleIndex].imageFile = undefined;
    }
  
    setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
  }
};
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/blog/PostCategory/admin/getAllCategory");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setListPostCategorie(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTitle = async () => {
      const response = await fetch(`/api/blog/admin/ListPostadmin/${id}`);
      if (response.ok) {
        const data = await response.json();
        setpostData(data);
      }
    };

    fetchCategories();
    fetchTitle();
  }, [id]);
const handleback=()=>{
  console.log('stage1',removedImageUrls)
  removedImageUrls.length=0;
  console.log('stage2',removedImageUrls)

 router.push("/admin/blog");
}
  const handleInputChangecategory = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (postData) {
      setpostData({
        ...postData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (postData) {
      setpostData({
        ...postData,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleInputChanget = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (postData) {
      setpostData({
        ...postData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
 
  const handleSubtitleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    subtitleIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (postData && file) {
      const updatedSubtitles = [...postData.Postfirstsubsections];
      updatedSubtitles[subtitleIndex].imageFile = file;
      updatedSubtitles[subtitleIndex].imageUrl = URL.createObjectURL(file);
      setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
    }
  };

  const handleSubtitlesubtitleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    subtitleIndex: number,
    subsubtitleIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (postData && file) {
      const updatedSubtitles = [...postData.Postfirstsubsections];
      updatedSubtitles[subtitleIndex].Postsecondsubsections[
        subsubtitleIndex
      ].imageFile = file;
      updatedSubtitles[subtitleIndex].Postsecondsubsections[
        subsubtitleIndex
      ].imageUrl = URL.createObjectURL(file);
      setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
    }
  };

  const handleSubtitleChange = (index: number, value: string) => {
    if (postData) {
      const updatedSubtitles = [...postData.Postfirstsubsections];
      updatedSubtitles[index].fisttitle = value;
      setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
    }
  };
  const handleSubdescriptionChange = (index: number, value: string) => {
    if (postData) {
      const updatedSubtitles = [...postData.Postfirstsubsections];
      updatedSubtitles[index].description = value;
      setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
    }
  };
  const handleSubtitlesubtitleChange = (
    subtitleIndex: number,
    subsubtitleIndex: number,
    value: string
  ) => {
    if (postData) {
      const updatedSubtitles = [...postData.Postfirstsubsections];
      updatedSubtitles[subtitleIndex].Postsecondsubsections[
        subsubtitleIndex
      ].secondtitle = value;
      setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
    }
  };
  const handleSubtitlesubdescriptionChange = (
    subtitleIndex: number,
    subsubtitleIndex: number,
    value: string
  ) => {
    if (postData) {
      const updatedSubtitles = [...postData.Postfirstsubsections];
      updatedSubtitles[subtitleIndex].Postsecondsubsections[
        subsubtitleIndex
      ].description = value;
      setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
    }
  };
  const addSubtitle = () => {
    if (postData) {
      setpostData({
        ...postData,
        Postfirstsubsections: [
          ...postData.Postfirstsubsections,
          {
            fisttitle: "",
            description: "",
            Postsecondsubsections: [],
            imageUrl: "",
          },
        ],
      });
    }
  };

  const addSubtitlesubtitle = (subtitleIndex: number) => {
    if (postData) {
      const updatedSubtitles = [...postData.Postfirstsubsections];
      updatedSubtitles[subtitleIndex].Postsecondsubsections.push({
        secondtitle: "",
        description: "",
        imageUrl: "",
      });
      setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
    }
  };

  const deleteSubtitle = (subtitleIndex: number) => {
    if (postData) {
      const Subtitles = [...postData.Postfirstsubsections];
      const imageUrl = Subtitles[subtitleIndex].imageUrl;
      if (imageUrl) {
        removedImageUrls.push(imageUrl);
       
      }
      if (Subtitles[subtitleIndex].Postsecondsubsections.length>0){
        for (let i = 0; i < removedImageUrls.length; i++) {
          const imageUrlsecon=Subtitles[subtitleIndex].Postsecondsubsections[i]?.imageUrl;
          if(imageUrlsecon){
        
          removedImageUrls.push(imageUrlsecon);
        }
        }
      }
      const updatedSubtitles = postData.Postfirstsubsections.filter(
        (_, index) => index !== subtitleIndex
      );
      setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
    }
  };

  const deleteSubtitlesubtitle = (
    subtitleIndex: number,
    subsubtitleIndex: number
  ) => {
    
    if (postData) {
      const updatedSubtitles = [...postData.Postfirstsubsections];
      const imageUrl = updatedSubtitles[subtitleIndex]?.Postsecondsubsections[subsubtitleIndex]?.imageUrl;
    if (imageUrl) {
      removedImageUrls.push(imageUrl);
     
    }

      updatedSubtitles[subtitleIndex].Postsecondsubsections = updatedSubtitles[
        subtitleIndex
      ].Postsecondsubsections.filter((_, index) => index !== subsubtitleIndex);
      

    
      setpostData({ ...postData, Postfirstsubsections: updatedSubtitles });
    }
  };

  const handleSaveUpdate = async () => {
    
    if (removedImageUrls.length>0)
      {

        for (let i = 0; i < removedImageUrls.length; i++) {
        
          const imageUrl = removedImageUrls[i]; // Get the current image URL

          try {
            // Perform the API request to delete the image
            await fetch(`/api/deleteImage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl }),
            });
      
            // Optionally log success
            console.log(`Image with URL: ${imageUrl} deleted successfully.`);
          } catch (error) {
            // Log any error that occurs during the fetch
            console.error(`Error deleting image with URL: ${imageUrl}`, error);
          }
        }
      }
      removedImageUrls.length = 0;
    if (postData) {
      // Step 1: Delete old main image if a new one is uploaded
 
      if (newImage && postData.imageUrl) {
        await fetch(`/api/deleteImage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: postData.imageUrl }),
        });
      }
      
      // Step 2: Upload main image if selected
      let uploadedImageUrl = postData.imageUrl || "";
      if (newImage) {
        const formData = new FormData();
        formData.append("file", newImage);
        const uploadResponse = await fetch(`/api/uploadImage`, {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        uploadedImageUrl = uploadData.url;
      }

      // Step 3: Handle subtitle and subtitlesubtitle images
      const updatedSubtitles = await Promise.all(
        postData.Postfirstsubsections.map(async (subtitle) => {
          let subtitleImageUrl = subtitle.imageUrl;
         
          if (subtitle.imageFile) {
            const formData = new FormData();
            formData.append("file", subtitle.imageFile);
            const response = await fetch("/api/uploadImage", {
              method: "POST",
              body: formData,
            });
            const data = await response.json();
            subtitleImageUrl = data.url;
 
          }
       
          const updatedSubtitlesubtitles = await Promise.all(
            subtitle.Postsecondsubsections.map(async (subsubtitle) => {
              let subsubtitleImageUrl = subsubtitle.imageUrl;
            
             
              if (subsubtitle.imageFile) {
                const formData = new FormData();
                formData.append("file", subsubtitle.imageFile);
                const response = await fetch("/api/uploadImage", {
                  method: "POST",
                  body: formData,
                });
                const data = await response.json();
                subsubtitleImageUrl = data.url;
              }
              return {
                secondtitle: subsubtitle.secondtitle,
                description: subsubtitle.description,
                imageUrl: subsubtitleImageUrl,
              };
            })
          );
        
          return {
            fisttitle: subtitle.fisttitle,
            description: subtitle.description,
            imageUrl: subtitleImageUrl,
            Postsecondsubsections: updatedSubtitlesubtitles,
          };
        })
      );
   
    

      // Step 4: Update the title with new data
      const response = await fetch(`/api/blog/admin/ListPostadmin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...postData,
          imageUrl: uploadedImageUrl,
          Postfirstsubsections: updatedSubtitles,
        }),
      });

      if (response.ok) {
        router.push("/admin/blog");
      }
    }
  };

  if (!postData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50">
      <h1 className="flex text-4xl font-bold uppercase pb-3 justify-center">
        Update Title
      </h1>
      <div className="mb-4">
        <label
          htmlFor="Category"
          className="block text-sm font-medium text-gray-700"
        >
          Post Category{" "}
        </label>
        <select
          name="postcategory"
          onChange={handleInputChangecategory}
          value={postData.postcategory?._id}
          className={`mt-1 block py-2.5 pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 `}
          required
        >
          <option value="">Select a category</option>
          {listPostCategorie.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <label
        htmlFor="Main Title"
        className="block text-sm font-medium text-gray-700"
      >
        Main Title{" "}
      </label>
      <input
        type="text"
        name="title"
        value={postData.title}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Main Title"
      />
       {/* Main Title Image */}
       <div className="space-y-2 mb-4">
       <label className="block text-sm font-medium text-gray-700">
          Main Title Image
        </label>
    
       {previewUrl && (
          <Image
            src={previewUrl}
            alt="New Image Preview"
            width={500}
            height={500}
            className="object-cover rounded-md w-[100%] h-40"
          />
        )}
        {postData.imageUrl && !previewUrl && (
        
          <Image
            src={postData.imageUrl}
            alt="Current Image"
            width={500}
            height={500}
            className="object-cover rounded-md w-[100%] h-40"
          />
        
      
        )}
        
        <input type="file" accept="image/*" onChange={handleImageChange} />
     
      </div>
      <label
        htmlFor="Main description"
        className="block text-sm font-medium text-gray-700"
      >
        Main description{" "}
      </label>
      <textarea
        name="description"
        value={postData.description}
        onChange={handleInputChanget}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        placeholder="Main Title"
      />

     

      {/* Subtitles and Subtitlesubtitles */}
      {postData.Postfirstsubsections.map((subtitle, subtitleIndex) => (
        <div
          key={subtitleIndex+1}
          className="border p-4 rounded-md mb-4 bg-gray-50 relative"
        >
          <div className="flex items-center space-x-2">
            <div className="flex flex-col gap-4 w-[100%]">
              <label
                htmlFor={`Subtitle ${toRoman(subtitleIndex + 1)}`}
                className="block text-sm font-medium text-gray-700"
              >
                {`Subtitle ${toRoman(subtitleIndex + 1)}`}{" "}
              </label>
              <input
                type="text"
                value={subtitle.fisttitle}
                onChange={(e) =>
                  handleSubtitleChange(subtitleIndex, e.target.value)
                }
                className="w-full border  p-2 border-gray-300 rounded-md "
                placeholder={`Subtitle ${toRoman(subtitleIndex + 1)}`}
              />
              
              <label
            htmlFor={`sub image${toRoman(subtitleIndex + 1)}`}
            className="block text-sm font-medium text-gray-700"
          > {`sub image ${toRoman(subtitleIndex + 1)}`}{" "}
          </label>
            {subtitle.imageUrl && (
           <div className="relative"> <Image
              src={subtitle.imageUrl}
              alt="Subtitle Image"
              width={500}
              height={500}
              className="rounded-md w-[100%] h-40 "
            />
           <button 
                    type='button' 
                    onClick={() =>  handleImageRemoval(subtitleIndex)} 
                    className='absolute top-1 left-1 py-1 px-2 text-xs bg-red-500 text-white rounded-full'
                  >
                    &times;
                  </button></div>
          )}
           
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSubtitleImageChange(e, subtitleIndex)}
          />
          

              <label
                htmlFor={`sub description ${toRoman(subtitleIndex + 1)}`}
                className="block text-sm font-medium text-gray-700"
              >
                {`sub description ${toRoman(subtitleIndex + 1)}`}{" "}
              </label>
              
              <textarea
                value={subtitle.description}
                onChange={(e) =>
                  handleSubdescriptionChange(subtitleIndex, e.target.value)
                }
                className="w-full  border border-gray-300 rounded-md mb-3 "
                placeholder={`Subtitle ${toRoman(subtitleIndex + 1)}`}
              />
            </div>
            <button
              type="button"
              onClick={() => deleteSubtitle(subtitleIndex)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-semibold"
            >
              <FaRegCircleXmark />
            </button>
          </div>
         
          {/* Subtitlesubtitles */}
          {subtitle.Postsecondsubsections.map(
            (subsubtitle, subsubtitleIndex) => (
              <div
                key={subsubtitleIndex+1}
                className="border p-4 rounded-md space-y-2 bg-gray-50 relative "
              >
                <div className='flex space-x-2 items-center justify-between' >
                <div className="flex flex-col gap-4 w-[100%]">
                  <label
                    htmlFor={`Sub Title subtitle ${subsubtitleIndex + 1}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {`Sub Title subtitle ${subsubtitleIndex + 1}`}{" "}
                  </label>
                  <input
                    type="text"
                    value={subsubtitle.secondtitle}
                    onChange={(e) =>
                      handleSubtitlesubtitleChange(
                        subtitleIndex,
                        subsubtitleIndex,
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder={`Subtitlesubtitle ${subsubtitleIndex + 1}`}
                  />
                  <label
                    htmlFor={`Sub Title subimage ${subsubtitleIndex + 1}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {`Sub Title subimage ${subsubtitleIndex + 1}`}{" "}
                  </label>
                 
                  {subsubtitle?.imageUrl && (
                   <div className="relative"> <Image
                      src={subsubtitle.imageUrl}
                      alt="Subtitlesubtitle Image"
                      width={500}
                      height={500}
                      className="rounded-md w-[100%] h-40"
                    />
                    <button 
                    type='button' 
                    onClick={() => handleImageRemoval(subtitleIndex,subsubtitleIndex)}
                    className='absolute top-1 left-1 py-1 px-2 text-xs bg-red-500 text-white rounded-full'
                  >
                    &times;
                  </button></div>
                    
                  )}
                   <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleSubtitlesubtitleImageChange(
                        e,
                        subtitleIndex,
                        subsubtitleIndex
                      )
                    }
                  />
                  <label
                    htmlFor={`Sub Title subdescription ${subsubtitleIndex + 1}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {`Sub Title subdescription ${subsubtitleIndex + 1}`}{" "}
                  </label>
                  <textarea
                    value={subsubtitle.description}
                    onChange={(e) =>
                      handleSubtitlesubdescriptionChange(
                        subtitleIndex,
                        subsubtitleIndex,
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder={`Subtitlesubdescription ${
                      subsubtitleIndex + 1
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    deleteSubtitlesubtitle(subtitleIndex, subsubtitleIndex)
                  }
                  className="text-red-500 hover:text-red-700 font-semibold absolute top-2 right-2"
                >
                  <FaRegCircleXmark />
                </button>
                </div>
              </div>
            )
          )}

          <button
            type="button"
            onClick={() => addSubtitlesubtitle(subtitleIndex)}
            className="mt-2 text-gray-400 hover:text-gray-700 font-semibold"
          >
            Add Subtitlesubtitle
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSubtitle}
        className="w-full p-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 font-semibold"
      >
        Add Subtitle
      </button>

      <div className="flex justify-between">
      <button
        onClick={() => handleback()}
        className="px-4 py-2 bg-gray-600 hover:bg-gray-400 text-white rounded-md mt-4"
      >
        Cancel
      </button>
      <button
        onClick={handleSaveUpdate}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-md mt-4"
      >
        Save Changes
      </button>
      </div>
    </div>
  );
}

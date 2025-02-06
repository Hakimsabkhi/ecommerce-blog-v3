'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import Postaffiche from '@/components/fPostadmin/Postaffiche';


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

function AddPost() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [postCategory, setPostCategory] = useState("");
  const [postfirstsubsections, setPostfirstsubsection] = useState<Postfirstsubsection[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const route=useRouter();
  const [listPostCategorie, setListPostCategorie] = useState<{ _id: string; name: string }[]>([]);

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

    
    fetchCategories();
   
  }, []);
  // Add a new subtitle
  const addSubtitleField = () => {
    setPostfirstsubsection([...postfirstsubsections, { fisttitle: '',  description:'',Postsecondsubsections: [], imageUrl: '' }]);
  };

  const deleteSubtitleField = (index: number) => {
    setPostfirstsubsection(postfirstsubsections.filter((_, i) => i !== index));
  };

  const addSubtitlesubtitleField = (subtitleIndex: number) => {
    const newSubtitles = [...postfirstsubsections];
    newSubtitles[subtitleIndex].Postsecondsubsections.push({ secondtitle: '', description:'',imageUrl: '' });
    setPostfirstsubsection(newSubtitles);
  };

  const deleteSubtitlesubtitleField = (subtitleIndex: number, subsubtitleIndex: number) => {
    const newSubtitles = [...postfirstsubsections];
    newSubtitles[subtitleIndex].Postsecondsubsections = newSubtitles[subtitleIndex].Postsecondsubsections.filter(
      (_, i) => i !== subsubtitleIndex
    );
    setPostfirstsubsection(newSubtitles);
  };

  const handleSubtitleChange = (index: number, value: string) => {
    const newSubtitles = [...postfirstsubsections];
    newSubtitles[index].fisttitle = value;
    setPostfirstsubsection(newSubtitles);
  };
  const handleSubdescriptionChange = (index: number, value: string) => {
    const newSubdescription = [...postfirstsubsections];
    newSubdescription[index].description = value;
    setPostfirstsubsection(newSubdescription);
  };

  const handleSubtitlesubtitleChange = (subtitleIndex: number, subsubtitleIndex: number, value: string) => {
    const newSubtitles = [...postfirstsubsections];
    newSubtitles[subtitleIndex].Postsecondsubsections[subsubtitleIndex].secondtitle = value;
    setPostfirstsubsection(newSubtitles);
  };
  const handleSubtitlesubdescriptionChange = (subtitleIndex: number, subsubtitleIndex: number, value: string) => {
    const newdescription = [...postfirstsubsections];
    newdescription[subtitleIndex].Postsecondsubsections[subsubtitleIndex].description = value;
    setPostfirstsubsection(newdescription);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubtitleImageChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSubtitles = [...postfirstsubsections];
      newSubtitles[index].imageUrl = URL.createObjectURL(file);
      newSubtitles[index].imageFile = file; // Temporarily store file for upload
      setPostfirstsubsection(newSubtitles);
    }
  };

  const handleSubtitlesubtitleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    subtitleIndex: number,
    subsubtitleIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSubtitles = [...postfirstsubsections];
      newSubtitles[subtitleIndex].Postsecondsubsections[subsubtitleIndex].imageUrl = URL.createObjectURL(file);
      newSubtitles[subtitleIndex].Postsecondsubsections[subsubtitleIndex].imageFile = file; // Temporarily store file for upload
      setPostfirstsubsection(newSubtitles);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    });
    const uploadData = await uploadResponse.json();
    return uploadData.url;
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    // Upload the main title image
    const uploadedImageUrl = image ? await uploadImage(image) : '';
  
    // Upload images for each subtitle and subtitlesubtitle
    const updatedSubtitles = await Promise.all(
      postfirstsubsections.map(async (subtitle) => {
        const subtitleImageUrl = subtitle.imageFile ? await uploadImage(subtitle.imageFile) : subtitle.imageUrl;
        const updatedSubtitlesubtitles = await Promise.all(
          subtitle.Postsecondsubsections.map(async (subsubtitle) => {
            const subsubtitleImageUrl = subsubtitle.imageFile
              ? await uploadImage(subsubtitle.imageFile)
              : subsubtitle.imageUrl;
            return {
              secondtitle: subsubtitle.secondtitle,
              description:subsubtitle.description,
              imageUrl: subsubtitleImageUrl,
            };
          })
        );
        return {
          fisttitle: subtitle.fisttitle,
          description:subtitle.description,
          imageUrl: subtitleImageUrl,
          Postsecondsubsections: updatedSubtitlesubtitles,
        };
      })
    );
  
    // Prepare the final data without `imageFile`
    const dataToSend = {
      title,
      postCategory,
      description,
      imageUrl: uploadedImageUrl,
      subtitles: updatedSubtitles,
    };
  
    // Send data to backend
    const response = await fetch('/api/blog/admin/postblog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
  
    if (response.ok) {
    route.push('/admin/blog')
      

    } else {
      console.error("Failed to save the title data");
    }
  };
  

  return (
    <div className='flex gap-2 w-full pt-5'>
    <div className="max-w-2xl mx-auto w-1/2 p-4 bg-gray-50 ">
    <h1 className='flex text-4xl font-bold uppercase pb-3 justify-center'>Add post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
    
      <div>
        <label  htmlFor="Category"
                className="block text-sm font-medium text-gray-700">Post Category </label>
          <select
            name="category"
            value={postCategory}
            onChange={(e) => setPostCategory(e.target.value)}
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
        <label  htmlFor="Main Title"
                className="block text-sm font-medium text-gray-700">Main Title </label>
        <input
          type="text"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Main Title"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Main Title Image */}
        <div className="space-y-2">
        {previewUrl && (
            <Image src={previewUrl} alt="Image preview" width={500} height={500} className=" rounded-md w-[100%] h-40" />
          )}
          <label className="block text-sm font-medium text-gray-700">Main Title Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          
        </div>
        
         <label  htmlFor="Main Description"
                className="block text-sm font-medium text-gray-700">Main Description </label>
          <textarea
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Main Description "
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        

        {/* Subtitles */}
        {postfirstsubsections.map((subtitleItem, subtitleIndex) => (
          <div key={subtitleIndex} className="border p-4 rounded-md space-y-2 bg-gray-50">
            <div className="flex space-x-2 items-center justify-between">
              <div className=' flex flex-col gap-4 w-[100%]' >
              <label  htmlFor={`Subtitle ${subtitleIndex + 1}`}
                className="block text-sm font-medium text-gray-700">{`Subtitle ${toRoman(subtitleIndex + 1)}`} </label>
                <input
                type="text"
                value={subtitleItem.fisttitle}
                onChange={(e) => handleSubtitleChange(subtitleIndex, e.target.value)}
                placeholder={`Subtitle ${toRoman(subtitleIndex + 1)}`}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
            {/* Subtitle Image */}
            {subtitleItem.imageUrl && (
              <Image src={subtitleItem.imageUrl} alt="Subtitle Image" width={500} height={500} className="rounded-md w-[100%] h-40" />
            )}
            <label  htmlFor={`sub image  ${toRoman(subtitleIndex + 1)}`}
                className="block text-sm font-medium text-gray-700">{`sub image  ${toRoman(subtitleIndex + 1)}`} </label>
            <input type="file" accept="image/*" onChange={(e) => handleSubtitleImageChange(e, subtitleIndex)}  className=''/>
           
                   <label  htmlFor={`sub description  ${toRoman(subtitleIndex + 1)}`}
                className="block text-sm font-medium text-gray-700">{`sub description  ${toRoman(subtitleIndex + 1)}`} </label>
                 <textarea
               
                value={subtitleItem.description}
                onChange={(e) => handleSubdescriptionChange(subtitleIndex, e.target.value)}
                placeholder={`sub description ${toRoman(subtitleIndex + 1)}`}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              </div>
              <button
                type="button"
                onClick={() => deleteSubtitleField(subtitleIndex)}
                className="text-red-500 hover:text-red-700 font-semibold   "
              >
                <FaRegCircleXmark/>
              </button>
            </div>


            {/* Subtitlesubtitles */}
            {subtitleItem.Postsecondsubsections.map((subsubtitle, subsubtitleIndex) => (
              <div key={subsubtitleIndex} className="border p-4 rounded-md space-y-2 bg-gray-50">
               <div className='flex space-x-2 items-center justify-between' >
                <div className=' flex flex-col gap-4 w-[100%]'>
                <label  htmlFor={`Sub Title subtitle ${subsubtitleIndex + 1}`}
                className="block text-sm font-medium text-gray-700">{`Sub Title subtitle ${subsubtitleIndex + 1}`} </label>
                <input
                  type="text"
                  value={subsubtitle.secondtitle}
                  onChange={(e) => handleSubtitlesubtitleChange(subtitleIndex, subsubtitleIndex, e.target.value)}
                  placeholder={`Sub Title subtitle ${subsubtitleIndex + 1}`}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                    <label  htmlFor={`Sub Title subimage ${subsubtitleIndex + 1}`}
                className="block text-sm font-medium text-gray-700">{`Sub Title subimage ${subsubtitleIndex + 1}`} </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSubtitlesubtitleImageChange(e, subtitleIndex, subsubtitleIndex)}
                />
                
                <label  htmlFor={`Sub Title subdescription ${subsubtitleIndex + 1}`}
                className="block text-sm font-medium text-gray-700">{`Sub Title subdescription ${subsubtitleIndex + 1}`} </label>
                  <textarea
                  value={subsubtitle.description}
                  onChange={(e) => handleSubtitlesubdescriptionChange(subtitleIndex, subsubtitleIndex, e.target.value)}
                  placeholder={`Sub Title subdescription ${subsubtitleIndex + 1}`}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
                <button
                  type="button"
                  onClick={() => deleteSubtitlesubtitleField(subtitleIndex, subsubtitleIndex)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                 <FaRegCircleXmark/>
                </button>
                </div>
            
              </div>
            ))}

            <button
              type="button"
              onClick={() => addSubtitlesubtitleField(subtitleIndex)}
              className="mt-2 text-gray-500 hover:text-gray-700 font-semibold"
            >
              Add Subtitlesubtitle
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSubtitleField}
          className=" p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold w-[30%]"
        >
          Add Subtitle
        </button>

        <button
          type="submit"
          className="w-full p-2 bg-gray-900 text-white rounded-md hover:bg-gray-600 font-semibold"
        >
          Submit
        </button>
      </form>
      
     
      </div>
      <Postaffiche title={title} previewUrl={previewUrl} description={description} postfirstsubsections={postfirstsubsections}/>
      
    </div>
  );
}

export default AddPost;

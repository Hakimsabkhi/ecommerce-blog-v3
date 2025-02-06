"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, ChangeEvent  } from "react";


import Link from "next/link";


import { toast } from "react-toastify";

interface CategoryData {
  name: string;

}

const ModifyCategory = () => {
 
  const params = useParams() as { updatecategory: string }; // Explicitly type the params object
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<CategoryData>({
    name: "",
  });

  
  useEffect(() => {
    // Fetch category data by ID
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(`/api/blog/PostCategory/admin/getCategoryById/${params.updatecategory}`);
  
        if (!response.ok) {
          throw new Error('Failed to fetch category data');
        }
  
        const data = await response.json();
        setCategoryData(data);
        console.log(data);
  
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };
  
    fetchCategoryData();
  }, [params.updatecategory]);
  

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", categoryData.name);
   
  
  
    try {
      const response = await fetch(`/api/blog/PostCategory/admin/updateCategory/${params.updatecategory}`, {
        method: 'PUT',
        body: formData,
        // Content-Type header is automatically set by the browser when using FormData
      });
  
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
   
      toast.success(`Category ${categoryData.name} modification successfully!`);
    router.push('/admin/blog/post-category')
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  

  return (
    <div className="mx-auto w-[90%] max-xl:w-[90%] py-8 max-lg:pt-20 flex flex-col gap-8">
      <p className="text-3xl font-bold">Modify Category</p>
      <form onSubmit={handleSubmit} className="flex max-lg:flex-col max-lg:gap-4 lg:items-center gap-4">
        <div className="flex items-center w-[40%] max-lg:w-full gap-6 justify-between">
          <p className="text-xl max-lg:text-base font-bold">Name*</p>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[80%] block p-2.5"
          />
        </div>
      
       <div className="w-[20%] max-xl:w-[30%] max-md:w-[50%] items-start">
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-600 text-white rounded-md w-full h-10"
          >
            <p className="text-white font-bold">Modify</p>
          </button>
        </div>
        <div className="w-[20%] max-xl:w-[30%] max-md:w-[50%] items-start">
          <Link href="/admin/blog/post-category">
            <button className="bg-white border-2 border-gray-400 text-black hover:bg-gray-600 hover:text-white hover:border-0 rounded-md w-full h-10 flex items-center justify-center">
              <p className="font-bold">Cancel</p>
            </button>
          </Link>
        </div> 
      
      </form>
    </div>
  );
};

export default ModifyCategory;

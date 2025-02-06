"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Define the Category and Brand types
interface Category {
  _id: string;
  name: string;
}
interface SubCategory {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface boutique {
  _id: string;
  nom: string;
}
const AddProduct = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [boutiques, setBoutiques] = useState<boutique[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    ref: "",
    info: "",
    category: "",
    brand: "",
    boutique: "",
    stock: "",
    price: "",
    tva: "",
    discount: "",
    color: "",
    material: "",
    weight: "",
    warranty: "",
    dimensions: "",
    statuspage:"",
    subcategory:""
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category/admin/getAllCategoryAdmin', {
          method: 'GET',
          next: { revalidate: 0 }, // Disable caching to always fetch the latest data
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
   
      const fetchboutique= async () => {
        try {
          const response = await fetch('/api/store/admin/getstoreapprove', {
            method: 'GET',
            next: { revalidate: 0 }, // Disable caching to always fetch the latest data
          });
          if (!response.ok) throw new Error("Failed to fetch categories");
          const data = await response.json();
          setBoutiques(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brand/admin/getAllBrand");
        if (!response.ok) throw new Error("Failed to fetch brands");
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchboutique();
  }, []);
    const fetchsubCategories = async (selectcatgoray:string) => {
      try {
        const response = await fetch(`/api/SubCategory/admin/getsubcategoraybycategoray/${selectcatgoray}`, {
          method: 'GET',
          next: { revalidate: 0 }, // Disable caching to always fetch the latest data
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
      setSubCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
  
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "category") {
      if(value){
        fetchsubCategories(value)
       }else{
         setSubCategories([])
       }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };
  const handleImageChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
   
      /* if    (images.length + fileArray.length > 3) {
        setError('Please select 1 or 2 images.');
        return;
      } */


      setImages(prevImages => [...prevImages, ...fileArray]);
      setError(null);
    }
  };
  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  
  useEffect(() => {
    // Cleanup function to revoke object URLs when images are removed or component unmounts
    return () => {
      images.forEach(image => URL.revokeObjectURL(URL.createObjectURL(image)));
    };
  }, [images]);
  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("info", productData.info);
    formData.append("description", productData.description);
    formData.append("ref", productData.ref);
    formData.append("category", productData.category);
    formData.append("subcategory", productData.subcategory);
    formData.append("brand", productData.brand);
    formData.append("boutique", productData.boutique);
    formData.append("stock", productData.stock);
    formData.append("price", productData.price);
    formData.append("tva", productData.tva);
    formData.append("discount", productData.discount);
    formData.append("color", productData.color);
    formData.append("material", productData.material);
    formData.append("weight", productData.weight);
    formData.append("warranty", productData.warranty);
    formData.append("dimensions", productData.dimensions);
    formData.append("statuspage", productData.statuspage);
    if (image) formData.append("image", image);
    if (images) {
      images.forEach((img, index) => formData.append(`images[${index}]`, img));
    }
    try {
      const response = await fetch("/api/products/admin/postProduct", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit product");
      }

      toast.success(`Product ${productData.name} added successfully!`);
      router.push("/admin/product");
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
        setError(error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
        setError(error);
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="mx-auto w-[90%] max-lg:w-[90%] py-8 max-lg:pt-20 flex flex-col gap-8 uppercase"
    >
      <p className="text-3xl font-bold">ADD New Product</p>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-8 lg:gap-x-20">
        <div className="flex items-center w-full justify-between gap-2">
          <p className="text-xl font-bold">Name *</p>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[80%] block p-2.5"
            required
          />
        </div>
        <div className="flex items-center w-full justify-between gap-2">
          <p className="text-xl font-bold">Upload Image *</p>
          <input
            type="file"
            onChange={handleImageChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-[#EFEFEF] text-white rounded-md w-[50%] h-10 border-2 flex justify-center items-center cursor-pointer"
          >
            <p className="text-black">Select an Image</p>
          </label>
        </div>
        {imagePreview && (
          <div className="flex items-center w-full justify-between gap-2">
            <p className="text-xl font-bold">Image Preview</p>
            <Image
              src={imagePreview}
              alt="Image preview"
              className="w-24 h-24 object-cover"
              width={60}
              height={60}
            />
          </div>
        )}
        <div className="flex items-center w-full justify-between gap-4">
          <p className="text-xl font-bold">Category *</p>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center w-full justify-between gap-4">
          <p className="text-xl font-bold">Sous Categorie </p>
          <select
            name="subcategory"
            value={productData.subcategory}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
            
          >
            <option value="">Select a Sous Categorie</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center w-full justify-between gap-4">
          <p className="text-xl font-bold">Brand </p>
          <select
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
            
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 max-sm:grid-cols-1 max-md:grid-cols-2 gap-8 lg:gap-x-20">
        <div className="flex items-center w-full justify-between gap-4">
          <p className="text-xl font-bold">Quantity *</p>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
            required
          />
        </div>
        <div className="flex items-center w-full justify-between gap-4">
          <p className="text-xl font-bold">Ref *</p>
          <input
            type="text"
            name="ref"
            value={productData.ref}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
            required
          />
        </div>
        <div className="flex items-center w-full  justify-between gap-4">
          <p className="text-xl font-bold">Tva *</p>
          <input
            type="number"
            name="tva"
             min="0"
            max="50"
            placeholder="%"
            value={productData.tva}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
            required
          />
        </div>
        <div className="flex items-center w-full  justify-between gap-4">
          <p className="text-xl font-bold">Price *</p>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
            required
          />
        </div>
        <div className="flex items-center w-full  justify-between gap-4">
          <p className="text-xl font-bold">Discount</p>
          <input
            type="number"
            name="discount"
            min="0"
            max="100"
            placeholder="%"
            value={productData.discount}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
          />
        </div>
            <div className="flex items-center w-full  justify-between gap-4">
          <p className="text-xl font-bold">Place</p>
          <select
            name="statuspage"
            value={productData.statuspage}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
            required
          >
            <option value="none">Select a Place</option>
            <option value="home-page" >
               Home Page
             </option>
              <option value="best-collection" >
              Best Collection
            </option>
            <option value="promotion">
            Promotion
            </option>
          </select>
        </div>
      </div>
      <div className="flex items-center w-full gap-4">
        <p className="text-xl font-bold">Info*</p>
        <textarea
          name="info"
          value={productData.info}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full block p-2.5"
          required
        />
      </div>
      <div className="flex items-center w-full gap-4">
        <p className="text-xl font-bold">Description</p>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full block p-2.5"
          
        />
      </div>
      <div className="grid grid-cols-2 max-md:grid-cols-1 md:gap-x-32 gap-8">
        <div className="flex items-center justify-between w-full gap-4">
          <label className="text-xl font-bold">Color</label>
          <input
            type="text"
            name="color"
            value={productData.color}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          />
        </div>
        <div className="flex items-center justify-between w-full gap-4">
          <label className="text-xl font-bold">Material</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          />
        </div>
        <div className="flex items-center justify-between w-full gap-4">
          <label className="text-xl font-bold">Weight</label>
          <input
            type="text"
            name="weight"
            value={productData.weight}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          />
        </div>
        <div className="flex items-center justify-between w-full gap-4">
          <label className="text-xl font-bold">Warranty</label>
          <input
            type="text"
            name="warranty"
            value={productData.warranty}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          />
        </div>
        <div className="flex items-center justify-between w-full gap-4">
          <label className="text-xl font-bold">Dimensions</label>
          <input
            type="text"
            name="dimensions"
            value={productData.dimensions}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          />
        </div>
        <div className="flex items-center w-full justify-between gap-4">
          <p className="text-xl font-bold">Boutique </p>
          <select
            name="boutique"
            value={productData.boutique}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
            
          >
            <option value="">Select a Boutique</option>
            {boutiques.map((boutique) => (
              <option key={boutique._id} value={boutique._id}>
                {boutique.nom}
              </option>
            ))}
          </select>
        </div>
      
      </div>
    
      <div className="flex max-lg:flex-col items-center max-lg:gap-8 justify-between">
        <div className="flex items-center justify-between max-lg:w-full w-1/2 gap-4">
          <p className="text-xl font-bold">Add Images </p>
          <input
            type="file"
            onChange={handleImageChanges}
            multiple
            className="hidden"
            id="file-upload-multiple"
          />
          <label
            htmlFor="file-upload-multiple"
            className="bg-[#EFEFEF] text-white rounded-md w-[50%] h-10 border-2 flex justify-center items-center cursor-pointer"
          >
            <p className="text-black">Select Images</p>
          </label>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <Image
                  src={URL.createObjectURL(img)}
                  alt={`Image ${index}`}
                  className="w-52 h-52 object-cover"
                  width={60}
                  height={60}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full flex justify-end gap-4">
       
        <Link
          href="/admin/product"
          className="border border-gray-400 rounded-md w-[20%] text-center justify-center p-2 max-lg:w-[50%] h-10 text-black hover:text-white hover:bg-gray-600"
        >
          Cancel
        </Link>
         <button
          type="submit"
          className="bg-gray-800 text-white rounded-md w-[20%] max-lg:w-[50%] h-10 hover:bg-gray-600"
        >
          <p className="text-white">Add the New Product</p>
        </button>
      </div>
    </form>
    
  );
};

export default AddProduct;

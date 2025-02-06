"use client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import React, {  useEffect, useState } from "react";

import { Costmizecomp } from "@/components/costmize/Costmizecomp";

const Costmizecatgorey = () => {
  const router = useRouter();
  const [formdata, setFormdata] = useState({
    title:'',
    subtitle:''
  });
   const name="category"
            const url="/admin/category/"
const [id,setId]=useState('')
  const [error, setError] = useState<string | null>(null);
  useEffect(()=>{
  const fetchcostmizeData = async () => {
    try {
      const response = await fetch(`/api/category/admin/costmize/getcostmize`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.status===200){
        const data = await response.json();
      setId(data._id);
      setFormdata(data);
      }else if(response.status===404){
        setFormdata( {title:'',
          subtitle:''})
      }

     
    } catch (error) {
      console.error("Error fetching costmize data:", error);
    } 
  };
  fetchcostmizeData()
},[])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
// Check if required fields are empty
if (!formdata.title || !formdata.subtitle) {
  setError("Title  are required.");
  return;
}


   
    try {
      const response = await fetch("/api/category/admin/costmize/postcostmize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),

      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error posting costmize");
      }

      toast.success(`costmize category ${formdata.title} Add successfully!`);
      router.push(url);
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting costmize:", error.message);
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
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    for (const [key, value] of Object.entries(formdata)) {
      formData.append(key, value); // appending the key-value pairs to FormData
    }
    formData.append('id', id);
    try {
      const response = await fetch("/api/category/admin/costmize/updatecostmize", {
        method: "put",
        body: formData,

      });
      if (!response.ok) {
        throw new Error("Failed to update costmize");
      }

      toast.success(`costmize category ${formdata.title} update successfully!`);
      router.push(url);
     
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };
  return (
    <Costmizecomp name={name} handleSubmit={handleSubmit }handleUpdate={handleUpdate } formdata={formdata} handleChange={handleChange} error={error} url={url} id={id}/>
  );
};

export default Costmizecatgorey;


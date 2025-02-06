import React from 'react';
import Link from 'next/link';

interface CostmizecompParam {
    name:string;
  handleSubmit: (e: React.FormEvent) => void;
  handleUpdate: (e: React.FormEvent) => void;
  formdata: { title: string; subtitle: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  url:string;
  id:string;
}

export const Costmizecomp: React.FC<CostmizecompParam> = ({ name,handleSubmit,handleUpdate, formdata, handleChange, error,url,id }) => {

  return (
    <div>    <div className="flex flex-col gap-8  mx-auto w-[90%] py-8 ">
    <p className="text-3xl font-bold">{id ? "Update" : "Create"} Costmize {name} Title</p>
    
    <form
      onSubmit={id ? handleUpdate:handleSubmit}
      className="flex flex-col items-center mx-auto gap-4 w-full lg:w-3/5"
    >
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">Title*</p>
        <input
          name="title"
          type="text"
          value={formdata.title}
          onChange={handleChange}
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          required
        />
      </div>
      <div className="flex items-center gap-6 w-full justify-between">
        <p className="text-xl max-lg:text-base font-bold">SubTitle*</p>
        <input
          name="subtitle"
          type="text"
          value={formdata.subtitle}
          onChange={handleChange}
          className="bg-gray-50 border w-1/2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
          required
        />
      </div>
    
      <div className="flex w-full justify-center gap-4 px-20">
        <Link
        className="w-1/2" href={`${url}`}>
          <button className="w-full  rounded-md border-2 font-light  h-10
           ">
            <p className="font-bold">Cancel</p>
          </button>
        </Link>
        <button
          type="submit"
          className="w-1/2 bg-gray-800 text-white rounded-md  hover:bg-gray-600 h-10"
        >
          <p className="text-white">{id ? "Update" : "Create"} Title</p>
        </button>
      
        
      </div>
    </form>

    {error && <p className="text-red-500">{error}</p>}
  </div></div>
  )
}

"use client"
import Pagination from '@/components/Pagination';
import useIs2xl from '@/hooks/useIs2x';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';
type Product = {
    _id: string;
    name: string;
    
    ref: string;
  
    imageUrl: string;
   
    user: {_id:string}; // Reference to a User document or User ID
    nbreview:number;
    createdAt: Date;
    updatedAt: Date;
};

const Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
     const [colSpan, setColSpan] = useState(5);
    const is2xl = useIs2xl();
    const productsPerPage =is2xl ? 7 : 5;
    const fetchProducts = async () => {
            try {
                const response = await fetch('/api/review/admin/getAllProductReview', {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data); // Assuming data is an array of products
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        useEffect(() => {
              const updateColSpan = () => {
                const isSmallestScreen = window.innerWidth <= 640; // max-sm
                
                const isMediumScreen = window.innerWidth <= 1024; // max-lg
          
                if (isSmallestScreen) {
                  setColSpan(3); // max-sm: colSpan = 3
                
                } else if (isMediumScreen) {
                  setColSpan(4); // max-lg: colSpan = 5
                } else {
                  setColSpan(5); // Default: colSpan = 6
                }
              };
          
              // Initial check
              updateColSpan();
          
              // Add event listener
              window.addEventListener("resize", updateColSpan);
          
              // Cleanup event listener
              return () => window.removeEventListener("resize", updateColSpan);
            }, []);
        
    useEffect(() => {
        setFilteredProducts(products);
        setCurrentPage(1);
        setLoading(false);
      }, [products]);
    
      useEffect(() => {
        const filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.ref.toLowerCase().includes(searchTerm.toLowerCase())
          // product.user.toLowerCase().includes(searchTerm.toLowerCase())
          
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
      
      }, [searchTerm, products]);
    
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
      );
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    
    
      
    
    
    
    useEffect(() => {
        
        setLoading(true);
        fetchProducts();
    }, []);

    return (
      <div className="flex flex-col mx-auto w-[90%] gap-4">
      <div className="flex items-center h-[80px] ">
        <p className="text-3xl max-sm:text-sm font-bold"> Product Reviews</p>
      </div>
      <div className="h-[50px] flex items-center ">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg max-w-max"
          />
      </div>
      <div className="h-[50vh] max-2xl:h-80 max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed ">
          <thead>
          <tr className="bg-gray-800 ">
            <th className="px-4 py-3 w-1/5 md:max-lg:w-1/4 ">REF</th>
            <th className="px-4 py-3 w-1/5 md:max-lg:w-1/4 ">Name</th>
            <th className="px-4 py-3 w-1/5  max-lg:hidden">Number Review</th>
            <th className="px-4 py-3 w-1/5 md:max-lg:w-1/4 ">ImageURL</th>
            <th className="px-4 py-3 w-1/5 md:max-lg:w-1/4 ">
              Action
            </th>
          </tr>
        </thead>
        {loading ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px]" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredProducts.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={colSpan}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>Aucun review trouvée.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
        <tbody>
          {currentProducts.map((item) => (
            <tr key={item._id}  className="even:bg-gray-100 odd:bg-white">
              <td className="border px-4 py-2 text-center">{item.ref}</td>
              <td className="border px-4 py-2 text-center truncate">{item.name}</td>
              <td className="border px-4 py-2 text-center max-lg:hidden">{item.nbreview}</td>
              <td className="border px-4 py-2 max-sm:hidden text-center">
                <Image
                  alt={item.name}
                  src={item.imageUrl}
                  height={30}
                  width={30}
                />
              </td>
              <td className="border px-4 py-2 flex justify-center items-center">
                <Link href={`/admin/review/${item._id}`}>
                  <button className="bg-gray-800 text-white px-2 w-10 h-10 hover:bg-gray-600 rounded-md max-sm:text-sm">
                    Reviews 
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody> )}
      </table>
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
          {loading ? (
            <div className="flex justify-center items-center h-full w-full py-6">
              <FaSpinner className="animate-spin text-[30px]" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-6 text-gray-600 w-full">
              <p>No reviews found.</p>
            </div>
          ) : (
            currentProducts.map((item) => (
              <div
                key={item._id}
            className="p-4 mb-4 flex flex-col gap-4 bg-gray-100 rounded shadow-md"
              >
                <div>
                  <div className="flex gap-1 text-3xl font-semibold uppercase text-center justify-center ">
                    <p className="text-gray-600  w-1/5">REF:</p>
                    <p>{item.ref}</p>
                  </div>
                  <hr className="border-white border-2 w-full my-2" />
                  <div className="flex  gap-1 font-semibold pl-[15%]">
                    <p className="text-gray-600 w-1/5 mr-4">Name:</p>
                    <p className="truncate">{item.name}</p>
                  </div>
                  <div className="flex gap-1 font-semibold pl-[15%]">
                    <p className="text-gray-600  w-1/5 mr-4">Reviews:</p>
                    <p>{item.nbreview}</p>
                  </div>
  
                  <div className="w-full flex justify-center py-2">
                    <Image
                      alt={item.name}
                      src={item.imageUrl}
                      width={300}
                      height={500}
                      className="rounded-md"
                    />
                  </div>
                </div>
                
                <div className='flex justify-center'>
                
                <Link href={`/admin/review/${item._id}`}>
                  <button className="bg-gray-800 text-white px-4 py-2 hover:bg-gray-600 rounded-md">
                    Reviews
                  </button>
                </Link></div>
              </div>
            ))
          )}
        </div>
      <div className="mt-4">
       
      <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}/>
      </div>
    </div>
            
      
    )
}

export default Page;

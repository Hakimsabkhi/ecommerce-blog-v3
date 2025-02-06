"use client"
import { FC, useEffect, useState } from "react";
import { BiPencil ,BiTrash} from "react-icons/bi";
import { FaSpinner } from "react-icons/fa6";
import Link from "next/link";
interface descriptions{
    _id:string;
    text:string;
    type:string;
}


const ProductsDescriptions: FC = () => {
      const [descriptionData, setDescriptionData] = useState<descriptions[]>([]);
       const [loading, setLoading] = useState(true);
      const fetchDescriptionsData = async () => {
        try {
          const response = await fetch(`/api/description/admin/getdescription`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          if (!response.ok) {
            throw new Error("Error fetching description data");
          }
          const data = await response.json();
          setDescriptionData(data);
          
        } catch (error) {
          console.error("Error fetching description data:", error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchDescriptionsData();
      }, []);
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      
      <h1 className="text-3xl font-bold mb-6">Products Descriptions</h1>
      <div className="flex justify-end pb-8">
      <Link href={'/admin/descriptions/adddescription'}>
      <button className="bg-gray-900 text-white px-4 py-2 rounded-md mb-4">
        Add Products Descriptions
      </button>
      </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="py-3 px-6 text-left"> Descriptions</th>
              <th className="py-3 px-6 text-left"> type</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
            {loading ? (
                                  <tbody>
                                    <tr>
                                      <td colSpan={7}>
                                        <div className="flex justify-center items-center w-full ">
                                          <FaSpinner className="animate-spin text-[30px]" />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                ) : descriptionData.length==0 ? (
                                  <tbody>
                                    <tr>
                                      <td colSpan={7}>
                                        <div className="text-center py-6 text-gray-600 w-full">
                                          <p>Aucune Company trouvée.</p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                ) : (
          <tbody>
            {descriptionData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-3 px-6 font-medium">{item.text}</td>
                <td className="py-3 px-6">{item.type}</td>
                <td className="py-3 px-6 flex space-x-2">
                  <Link href={`/admin/descriptions/${item._id}`}className="bg-gray-800 text-white p-2 rounded-md">
                    <BiPencil size={16} />
                  </Link>
                  <button className="bg-gray-800 text-white p-2 rounded-md">
                    <BiTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
                                )}
        </table>
      </div>
    </div>
  );
};

export default ProductsDescriptions;
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa6";

interface Company {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  governorate?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  logoUrl?: string;
  imageUrl?: string;
  bannercontacts?: string;
}

const Display: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [governorate, setGovernorate] = useState("");
  
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconPreviewBanner, setIconPreviewBanner] = useState<string | null>(
    null
  );
  const [iconPreviewContacts, setIconPreviewBannerContacts] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCompanyData = async () => {
    try {
      const response = await fetch(`/api/websiteinfo/getwebsiteinfo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Error fetching websiteinfo data");
      }
      const data = await response.json();
      setCompanyData(data);
      setName(data.name || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setCity(data.city || "");
      setZipcode(data.zipcode || "");
      setGovernorate(data.governorate || "");
      setFacebook(data.facebook || "");
      setLinkedin(data.linkedin || "");
      setInstagram(data.instagram || "");
      setIconPreview(data.logoUrl || null);
      setIconPreviewBanner(data.imageUrl || null);
      setIconPreviewBannerContacts(data.bannercontacts || null);
    } catch (error) {
      console.error("Error fetching company data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
      
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between h-[80px] ">
            <p className="text-3xl max-sm:text-sm font-bold">Company Details</p>
            <button
              type="button"
              className="bg-gray-800 hover:bg-gray-600 max-sm:text-sm text-white rounded-lg py-2 px-4"
              onClick={() => router.push("company/details")}
            >
              <p className="text-white">{companyData ? "Update" : "Create"}</p>
            </button>
          </div>
          <div className="h-[50px] flex justify-between items-center"></div>
          <table className="w-full h-28 rounded overflow-hidden table-fixed mb-8 max-lg:hidden">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-3">Name Company</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3"> Address </th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">ZipCode </th>
                <th className="px-4 py-3">Governorate </th>
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
                      ) : name === null ? (
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
              <tr>
                <td className="border px-4 py-2 truncate">{name}</td>

                <td className="border px-4 py-2 truncate">{phone}</td>

                <td className="border px-4 py-2 truncate">{email}</td>

                <td className="border px-4 py-2 truncate">{address}</td>

                <td className="border px-4 py-2 truncate">{city}</td>

                <td className="border px-4 py-2 truncate">{zipcode}</td>

                <td className="border px-4 py-2 truncate">{governorate}</td>
              </tr>
            </tbody>)}
          </table>
          <div className="w-full space-y-4 lg:hidden ">
      {loading ? (
        <div className="flex justify-center items-center w-full h-28">
          <FaSpinner className="animate-spin text-[30px]" />
        </div>
      ) : name === null ? (
        <div className="text-center py-6 text-gray-600 w-full">
          <p>Aucune Company trouvée.</p>
        </div>
      ) : (
        <div className=" shadow-lg rounded-lg p-4 w-full bg-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Name Company</p>
              <p className="font-semibold">{name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-semibold">{phone}</p>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm">Address</p>
              <p className="font-semibold">{address}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">City</p>
              <p className="font-semibold">{city}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Zip Code</p>
              <p className="font-semibold">{zipcode}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Governorate</p>
              <p className="font-semibold">{governorate}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-semibold">{email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
          <table className="w-full h-36 rounded overflow-hidden table-fixed ">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-3 text-center">Upload Icon</th>
                <th className="px-4 py-3 text-center"> Banner</th>
                <th className="px-4 py-3 text-center"> B. Contact</th>
              </tr>
            </thead>
            {loading ? (
                        <tbody>
                          <tr>
                            <td colSpan={3}>
                              <div className="flex justify-center items-center w-full">
                                <FaSpinner className="animate-spin text-[30px]" />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ) : iconPreview === null ? (
                        <tbody>
                          <tr>
                            <td colSpan={3}>
                              <div className="text-center py-6 text-gray-600 w-full">
                                <p>Aucune Company trouvée.</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ) : (
            <tbody>
              <tr>
                <td className="border px-4 py-2 ">{iconPreview && (
                <Image
                  src={iconPreview}
                  alt="Icon preview"
                  className="w-24 h-auto mx-auto"
                  width={50}
                  height={50}
                />
              )}</td>

                <td className="border px-4 py-2 ">{iconPreviewBanner && (
                <Image
                  src={iconPreviewBanner}
                  alt="Banner preview"
                  className="w-24 h-auto  mx-auto"
                  width={50}
                  height={50}
                />
              )}</td>

                <td className="border px-4 py-2 ">{iconPreviewContacts && (
                <Image
                  src={iconPreviewContacts}
                  alt="Banner Contact preview"
                  className="w-24 h-auto mx-auto "
                  width={50}
                  height={50}
                />
              )}</td>
              </tr>
            </tbody>)}
          </table>
          <table className="w-full h-28 rounded overflow-hidden table-fixed ">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-3 text-center">Facebook</th>
                <th className="px-4 py-3 text-center">LinkedIn</th>
                <th className="px-4 py-3 text-center">Instagram</th>
              </tr>
            </thead>
            {loading ? (
                        <tbody>
                          <tr>
                            <td colSpan={3}>
                              <div className="flex justify-center items-center w-full">
                                <FaSpinner className="animate-spin text-[30px]" />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ) : facebook === null ? (
                        <tbody>
                          <tr>
                            <td colSpan={3}>
                              <div className="text-center py-6 text-gray-600 w-full">
                                <p>Aucune Company trouvée.</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ) : (
            <tbody>
              <tr>
                <td className="border px-4 py-2 text-center ">{facebook && (
                <p>{facebook}</p>
            )}</td>

                <td className="border px-4 py-2 text-center"> {linkedin && (
              
                
                <p>{linkedin}</p>
              
            )}
            </td>

                <td className="border px-4 py-2  text-center">{instagram && (
              
                <p>{instagram}</p>
             
            )}</td>
              </tr>
            </tbody>
                      )}
          </table>

          
        </div>
        
    </div>
  );
};

export default Display;

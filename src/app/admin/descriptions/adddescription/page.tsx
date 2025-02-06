"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddProductDescriptions() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptions, setDescriptions] = useState<{ type: string; text: string }[]>([]);
const router=useRouter()
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setIsDropdownOpen(false);
  };

  const handleAddDescription = () => {
    if (description && selectedType) {
      setDescriptions([...descriptions, { type: selectedType, text: description }]);
      setDescription("");
      setSelectedType(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
   
    try {
      const response = await fetch("/api/description/admin/postdescription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Add this header to specify the content type
          },
          body: JSON.stringify(descriptions),
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error posting descriptions");
      }

      router.push("/admin/descriptions");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error  descriptions:", error.message);
      
      } else if (typeof error === "string") {
        console.error("String error:", error);
    
      } else {
        console.error("Unknown error:", error);
      
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Add Products Descriptions</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-4 py-2 border rounded-md bg-gray-100 text-center"
          placeholder="Enter description"
        />

        <div className="relative">
          <button 
            className="px-4 py-2 bg-gray-300 rounded-md" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedType || "Select type"}
          </button>
          {isDropdownOpen && (
            <div className="absolute mt-2 w-32 bg-gray-200 rounded-md shadow-md">
              {["Colors", "Text", "Dimension"].map((type) => (
                <button
                  key={type}
                  className="w-full py-2 hover:bg-gray-400"
                  onClick={() => handleTypeSelect(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="px-4 py-2 bg-gray-900 text-white rounded-md"
          onClick={handleAddDescription}
        >
          Add Description
        </button>
      </div>

      {descriptions.length > 0 && (
        <table className="mt-4 border border-gray-300 w-full max-w-lg text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Type</th>
            </tr>
          </thead>
          <tbody>
            {descriptions.map((desc, index) => (
              <tr key={index} className="border">
                <td className="px-4 py-2 border">{desc.text}</td>
                <td className="px-4 py-2 border">{desc.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-4 mt-6">
        <Link href={'/admin/descriptions/'} className="px-4 py-2 border rounded-md bg-gray-100 text-black">Cancel</Link>
        <button onClick={handleSubmit} className="px-4 py-2 bg-gray-900 text-white rounded-md">Confirm</button>
      </div>
    </div>
  );
}
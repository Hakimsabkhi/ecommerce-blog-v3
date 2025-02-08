"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductDescriptions() { // Renamed to PascalCase
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [description, setDescription] = useState("");
  const params = useParams() as { id: string }; 
  const router = useRouter();

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(
          `/api/description/admin/getdescriptionbyid/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch category data");
        }

        const data = await response.json();
        setDescription(data.text);
        setSelectedType(data.type);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", description);
    if (selectedType) formData.append("type", selectedType);

    try {
      const response = await fetch(
        `/api/description/admin/updatedescription/${params.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error posting descriptions");
      }

      router.push("/admin/descriptions");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error descriptions:", error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Update Products Descriptions</h1>

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
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          href={"/admin/descriptions/"}
          className="px-4 py-2 border rounded-md bg-gray-100 text-black"
        >
          Cancel
        </Link>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-gray-900 text-white rounded-md"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

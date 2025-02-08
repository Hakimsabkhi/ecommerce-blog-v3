import React, { useEffect, useState } from "react";
import Color from "./Color";
import Text from "./Text";
import Dimension from "./Dimension"; // Corrected spelling

interface Description {
  _id: string;
  text: string;
  type: string;
}

const ProductDic = () => {
  const [descriptionData, setDescriptionData] = useState<Description[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [dimensions, setDimensions] = useState<number[]>([]);
  const [color, setColor] = useState<number[]>([]);
  const [text, setText] = useState<number[]>([]);

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
    }
  };

  useEffect(() => {
    fetchDescriptionsData();
  }, []);

  // Handle selection change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDescription(e.target.value);
  };

  // Handle "Add Description" button click
  const handleAddDescription = () => {
    if (selectedDescription === "Dimension") {
      setDimensions((prev) => [...prev, prev.length + 1]); // Add a new dimension
    }
    if (selectedDescription === "Colors") {
      setColor((prev) => [...prev, prev.length + 1]); // Add a new dimension
    }
    if (selectedDescription === "Text") {
      setText((prev) => [...prev, prev.length + 1]); // Add a new dimension
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Product Descriptions</h1>
      <div className="flex gap-2">
        <select
          value={selectedDescription}
          onChange={handleDescriptionChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[60%] block p-2.5"
        >
          <option value="">Select Description</option>
          {descriptionData.map((item) => (
            <option key={item._id} value={item.type}>
              {item.text}
            </option>
          ))}
        </select>

        <button
          className="bg-gray-800 text-white p-2 rounded-md"
          type="button"
          onClick={handleAddDescription}
        >
          Add Description
        </button>
      </div>

      {text.map((_, index) => (
        
        <Text key={index}/>))}
      {color.map((_, index) => (
      <Color  key={index} />
      ))}
      
      {/* Render multiple Dimension components */}
      {dimensions.map((_, index) => (
        <Dimension key={index} />
      ))}
    </div>
  );
};

export default ProductDic;

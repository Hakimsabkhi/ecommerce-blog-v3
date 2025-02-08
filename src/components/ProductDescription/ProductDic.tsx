import React, { useEffect, useState } from "react";
import Color from "./Color";
import Text from "./Text";
import Dimension from "./Dimension";

interface Description {
  _id: string;
  text: string;
  type: string;
}

interface SelectedDescription {
  id: number;
  type: string;
  text: string;
}

const ProductDic = () => {
  const [descriptionData, setDescriptionData] = useState<Description[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [addedDescriptions, setAddedDescriptions] = useState<SelectedDescription[]>([]);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const fetchDescriptionsData = async () => {
      try {
        const response = await fetch(`/api/description/admin/getdescription`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Error fetching description data");
        const data = await response.json();
        setDescriptionData(data);
      } catch (error) {
        console.error("Error fetching description data:", error);
      }
    };

    fetchDescriptionsData();
  }, []);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setSelectedDescription(selectedType);

    const selectedItem = descriptionData.find((item) => item.type === selectedType);
    setSelectedText(selectedItem ? selectedItem.text : "");
  };

  const handleAddDescription = () => {
    if (!selectedDescription) return;

    setAddedDescriptions((prev) => [
      ...prev,
      { id: counter, type: selectedDescription, text: selectedText },
    ]);

    setCounter((prev) => prev + 1);

    setSelectedDescription("");
    setSelectedText("");
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

      {addedDescriptions.map((desc) => (
        <div key={desc.id} className="mt-4 p-3 border rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-semibold">{desc.text}</h2>
          {desc.type === "Text" && <Text />}
          {desc.type === "Colors" && <Color />}
          {desc.type === "Dimension" && <Dimension />}
        </div>
      ))}
    </div>
  );
};

export default ProductDic;

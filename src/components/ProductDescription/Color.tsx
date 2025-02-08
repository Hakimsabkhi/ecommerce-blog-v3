import React, { useState } from 'react';

const Color = ({ index, onColorChange, desc }: { index: number; onColorChange: (index: number, colors: string[], desc: string) => void; desc: string }) => {
  const [colors, setColors] = useState<string[]>([]);
  const [colorInputs, setColorInputs] = useState<string[]>([""]);

  const handleAddColorInput = () => {
    setColorInputs([...colorInputs, ""]);
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const updatedInputs = [...colorInputs];
    updatedInputs[idx] = e.target.value;
    setColorInputs(updatedInputs);
    
  };

  const handleAddColor = () => {
    const validColors = colorInputs.filter((color) => color && !colors.includes(color));
    const updatedColors = [...colors, ...validColors];
    setColors(updatedColors);
   // Reset inputs after adding

    onColorChange(index, updatedColors, desc);
  };

  return (
    <div className="mt-4 flex gap-2">
      {colorInputs.map((colorInput, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            value={colorInput}
            onChange={(e) => handleColorInputChange(e, idx)}
            placeholder={`Color ${idx + 1}`}
            className="flex-1 border border-gray-300 rounded p-2"
          />
        </div>
      ))}
      <div className="flex gap-4 pb-2">
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={handleAddColorInput}
          type="button"
        >
          +
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddColor}
          type="button"
        >
          Add Colors
        </button>
      </div>
    </div>
  );
};

export default Color;

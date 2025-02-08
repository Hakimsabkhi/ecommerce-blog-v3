import React, { useState } from 'react';

const Dimension = ({ index, onDimensionChange ,desc}: { index: number; onDimensionChange: (index: number, dimension: { desc:string,height?: string; width?: string; thickness?: string }) => void ,desc:string}) => {
  const [selectHeight, setSelectHeight] = useState('');
  const [selectWidth, setSelectWidth] = useState('');
  const [selectThickness, setSelectThickness] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const handleDimensionClick = (dimension: 'H' | 'L' | 'E',index:number) => {
    if (dimension === 'H') {
      setSelectHeight((prev) => (prev === dimension ? '' : dimension))
      setHeight('');
    }
    if (dimension === 'L'){
      setSelectWidth((prev) => (prev === dimension ? '' : dimension));
      setWidth('');
    } 
    if (dimension === 'E') {
      setSelectThickness((prev) => (prev === dimension ? '' : dimension));
      setThickness('');
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, dimension: 'H' | 'L' | 'E') => {
    const value = e.target.value;
    if (dimension === 'H') setHeight(value);
    if (dimension === 'L') setWidth(value);
    if (dimension === 'E') setThickness(value);
    onDimensionChange(index, {
      desc:desc,
      height:  height,
      width:  width,
      thickness:  thickness,
    });
  };

  return (
    <div className="mt-4 border border-gray-300 p-4 rounded-md">
      <div className="flex gap-2 mb-3">
        <span
          onClick={() => handleDimensionClick('H',index)}
          className={`px-3 py-1 rounded text-lg font-bold cursor-pointer ${selectHeight === 'H' ? 'bg-gray-800' : 'bg-gray-400'} text-white`}
        >
          H
        </span>
        <span
          onClick={() => handleDimensionClick('L',index)}
          className={`px-3 py-1 rounded text-lg font-bold cursor-pointer ${selectWidth === 'L' ? 'bg-gray-800' : 'bg-gray-400'} text-white`}
        >
          L
        </span>
        <span
          onClick={() => handleDimensionClick('E',index)}
          className={`px-3 py-1 rounded text-lg font-bold cursor-pointer ${selectThickness === 'E' ? 'bg-gray-800' : 'bg-gray-400'} text-white`}
        >
          E
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {selectHeight === 'H' && (
          <div>
            <label htmlFor="height" className="block text-sm font-semibold text-gray-700">
              Hauteur
            </label>
            <input
              id="height"
              onChange={(e) => handleInputChange(e, 'H')}
              placeholder="Hauteur"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
        )}
        {selectWidth === 'L' && (
          <div>
            <label htmlFor="width" className="block text-sm font-semibold text-gray-700">
              Largeur
            </label>
            <input
              id="width"
              placeholder="Largeur"
              className="border border-gray-300 rounded p-2 w-full"
              onChange={(e) => handleInputChange(e, 'L')}
            />
          </div>
        )}
        {selectThickness === 'E' && (
          <div>
            <label htmlFor="thickness" className="block text-sm font-semibold text-gray-700">
              Épaisseur
            </label>
            <input
              id="thickness"
              placeholder="Épaisseur"
              onChange={(e) => handleInputChange(e, 'E')}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dimension;

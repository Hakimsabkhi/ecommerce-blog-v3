import React from 'react';

interface TextProp {
  index: number;
  desc: { text: string; type: string };
  onTextChange: (index: number , text: string,desc:string) => void;
}

const Text: React.FC<TextProp> = ({ index, desc, onTextChange }) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-4">
        <input
          name={desc.text}
          type="text"
          placeholder="Text"
          className="border border-gray-300 rounded p-2"
          onChange={(e) => onTextChange(index, e.target.value,desc.text)}
        />
      </div>
    </div>
  );
};

export default Text;
